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
            await HandleWebSocket(webSocket);
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
        try
        {
            var receiveResult = await currentSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            if (receiveResult.MessageType == WebSocketMessageType.Text)
            {
                var message = System.Text.Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
                Console.WriteLine($"Received: {message}");

                // Process message and broadcast state
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
                Console.WriteLine("WebSocket Closed");
                clients.TryTake(out _);
                await currentSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by client", CancellationToken.None);
            }
        }
        catch (WebSocketException ex)
        {
            Console.WriteLine($"WebSocket error: {ex.Message}");
            break;
        }
    }

    // Remove the client when the connection is closed
    clients.TryTake(out _);
}


app.Run();
