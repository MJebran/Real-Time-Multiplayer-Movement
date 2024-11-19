using System.Net.WebSockets;


var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();



List<WebSocket> clients = new();

app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        clients.Add(webSocket);

        while (webSocket.State == WebSocketState.Open)
        {
            var buffer = new byte[1024];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Text)
            {
                foreach (var client in clients)
                {
                    if (client.State == WebSocketState.Open)
                    {
                        await client.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
            }
        }

        clients.Remove(webSocket);
    }
});
app.MapGet("/", () => "Hello World!");

app.Run();
