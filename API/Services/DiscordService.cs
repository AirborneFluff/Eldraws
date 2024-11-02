using Discord;
using Discord.WebSocket;

namespace API.Services;

public sealed class DiscordService(IConfiguration config, DiscordSocketClient client) : IAsyncDisposable
{
    private readonly string _token = config.GetValue<string>("Discord:BotToken") ?? throw new InvalidOperationException();

    public async Task SendEmbedAsync(ulong channelId, Embed embed)
    {
        await OpenConnection();
        if (await client.GetChannelAsync(channelId) is not IMessageChannel channel) return;

        await channel.SendMessageAsync("Test", embed: embed);
    }
    
    private async Task OpenConnection()
    {
        if (client.LoginState == LoginState.LoggedOut) 
            await client.LoginAsync(TokenType.Bot, _token);
        
        if (client.ConnectionState is ConnectionState.Disconnected)
            await client.StartAsync();
    }

    public async ValueTask DisposeAsync()
    {
        await client.StopAsync();
    }
}