using API.Data;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class GuildsController(UnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpPost]
    [Authorize]
    public async Task<ActionResult> CreateGuild([FromBody] NewGuildDto guild)
    {
        var newGuild = mapper.Map<Guild>(guild);
        newGuild.Id = Guid.NewGuid().ToString();
        newGuild.OwnerId = User.GetUserId();
        
        unitOfWork.GuildRepository.Add(newGuild);
        if (await unitOfWork.Complete()) return Ok(newGuild);

        return BadRequest();
    }
}
