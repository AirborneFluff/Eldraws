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
        newGuild.Memberships.Add(new GuildMembership()
        {
            AppUserId = newGuild.OwnerId,
            GuidId = newGuild.Id
        });
        
        unitOfWork.GuildRepository.Add(newGuild);
        if (await unitOfWork.Complete()) return Ok(mapper.Map<GuildDto>(newGuild));

        return BadRequest();
    }
    
    
    [HttpGet("getUsersGuilds")]
    [Authorize]
    public async Task<ActionResult> GetUsersGuilds()
    {
        var guilds = await unitOfWork.GuildRepository.GetUsersGuilds(User.GetUserId());
        return Ok(mapper.Map<IEnumerable<GuildDto>>(guilds));
    }
}
