using API.Domain.Discord.Models;
using Discord;
using Discord.WebSocket;

namespace API.Services;

public sealed class DiscordService(IConfiguration config, DiscordSocketClient client) : IAsyncDisposable
{
    private readonly string _token = config.GetValue<string>("Discord:BotToken") ?? throw new InvalidOperationException();

    public async Task SendEmbedAsync()//string title, string description, Embed embed)
    {
        await client.LoginAsync(TokenType.Bot, _token);
        var channel = await GetMessageChannel(1001780786950840330);
        if (channel == null) return;
        
        var table = new EmbedTable(new EmbedTableOptions
        {
            Titles = ["Level", "Money", "Wins"],
            TitleIndexes =  [0, 8, 16],
            ColumnIndexes = [0, 5, 12]
        });
        
        table.AddRow(["1", "£10", "212311"]);
        table.AddRow(["2", "£50", "1"]);
        table.AddRow(["3", "£100", "5"]);

        var embedField = table.ToField();
        var embed = new EmbedBuilder();
        embed.AddField(embedField);

        await channel.SendMessageAsync("Test", embed: embed.Build());
    }
    
    private async Task<IMessageChannel?> GetMessageChannel(ulong channelId)
    {
        if (client.LoginState == LoginState.LoggedOut) 
            await client.LoginAsync(TokenType.Bot, _token);
        
        if (client.ConnectionState is ConnectionState.Disconnected)
            await client.StartAsync();

        return await client.GetChannelAsync(channelId) as IMessageChannel;
    }

    public async ValueTask DisposeAsync()
    {
        await client.StopAsync();
    }
}