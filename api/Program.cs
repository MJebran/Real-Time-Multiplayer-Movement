using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();
app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseWebSockets();

var clients = new ConcurrentBag<WebSocket>();
var vehicles = new ConcurrentDictionary<int, object>();

app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            Console.WriteLine("WebSocket Connected");

            clients.Add(webSocket);
            await HandleWebSocket(webSocket);

            Console.WriteLine("WebSocket Disconnected");
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }
    else
    {
        await next(context);
    }
});

async Task HandleWebSocket(WebSocket currentSocket)
{
    var buffer = new byte[1024 * 4];
    while (currentSocket.State == WebSocketState.Open)
    {
        var receiveResult = await currentSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        if (receiveResult.MessageType == WebSocketMessageType.Text)
        {
            var message = System.Text.Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
            Console.WriteLine($"Received: {message}");

            var jsonMessage = JsonSerializer.Deserialize<Dictionary<string, object>>(message);
            if (jsonMessage == null) continue;

            if (jsonMessage["type"]?.ToString() == "registerVehicle")
            {
                var vehicle = jsonMessage["vehicle"];
                if (vehicle is JsonElement element)
                {
                    var vehicleId = element.GetProperty("id").GetInt32();
                    vehicles[vehicleId] = vehicle;
                }
            }
            else if (jsonMessage["type"]?.ToString() == "updateVehicle")
            {
                var vehicleId = (int)jsonMessage["id"];
                vehicles.TryGetValue(vehicleId, out var vehicle);

                if (vehicle is JsonElement element)
                {
                    var updatedFlags = element.GetProperty("movementFlags");
                    vehicles[vehicleId] = updatedFlags;
                }
            }

            var gameStateMessage = JsonSerializer.Serialize(new { type = "gameState", vehicles = vehicles.Values });
            foreach (var client in clients)
            {
                if (client.State == WebSocketState.Open)
                {
                    await client.SendAsync(
                        new ArraySegment<byte>(System.Text.Encoding.UTF8.GetBytes(gameStateMessage)),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None
                    );
                }
            }
        }
        else if (receiveResult.MessageType == WebSocketMessageType.Close)
        {
            clients.TryTake(out _);
            await currentSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by client", CancellationToken.None);
        }
    }
}
app.MapGet("/", () => "Welcome to Real Time Multiplayer Game Server");
app.Run();