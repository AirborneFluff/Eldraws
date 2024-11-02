using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class DiscordController(DiscordService discordService) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult> PostTest()
    {
        await discordService.SendEmbedAsync();
        return Ok();
    }
}