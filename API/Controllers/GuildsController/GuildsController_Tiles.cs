using API.ActionFilters;
using API.Data.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class GuildsController
{
    [HttpGet("{guildId}/tiles")]
    [ValidateGuildRole("Owner, Admin, Moderator, Member")]
    public async Task<ActionResult> GetAllTiles(string guildId)
    {
        var tiles = await unitOfWork.TileRepository.GetAllTiles(guildId);
        return Ok(mapper.Map<List<TileDto>>(tiles));
    }
}