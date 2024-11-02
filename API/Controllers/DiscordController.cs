using API.Domain.Discord.Models;
using API.Entities;
using API.Services;
using Discord;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class DiscordController(DiscordService discordService, UserManager<AppUser> userManager) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult> PostTest()
    {
        var users = await userManager.Users.ToListAsync();
        
        var embedTable = new EmbedTable(new EmbedTableOptions
        {
            Titles = ["UserName", "Gamertag"],
            TitleIndexes = [0, 29],
            ColumnIndexes = [0, 18],
            PadEnd = 5
        });
        
        embedTable.AddRows(users.Select(u => new List<string> {"awudhawudhawuhduwahawuhduawhduwhduahdhwaudhwa", u.Gamertag ?? string.Empty}));
        var embedBuilder = new EmbedBuilder();
        embedBuilder.AddField(embedTable.ToField());
        
        await discordService.SendEmbedAsync(1001780786950840330, embedBuilder.Build());
        return Ok();
    }
}