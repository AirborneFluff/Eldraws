using API.ActionFilters;
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
        var guildNameTaken = await unitOfWork.GuildRepository.ExistsByName(guild.Name);
        if (guildNameTaken) return Conflict("That Guild name is already taken.");
        
        var newGuild = mapper.Map<Guild>(guild);
        newGuild.Id = Guid.NewGuid().ToString();
        newGuild.OwnerId = User.GetUserId();
        newGuild.Memberships.Add(new GuildMembership()
        {
            AppUserId = newGuild.OwnerId,
            GuildId = newGuild.Id
        });
        
        unitOfWork.GuildRepository.Add(newGuild);
        if (await unitOfWork.Complete()) return Ok(mapper.Map<GuildDto>(newGuild));

        return BadRequest("There was an issue creating this guild.");
    }
    
    [HttpGet("getUsersGuilds")]
    [Authorize]
    public async Task<ActionResult> GetUsersGuilds()
    {
        var guilds = await unitOfWork.GuildRepository.GetUsersGuilds(User.GetUserId());
        return Ok(mapper.Map<IEnumerable<GuildDto>>(guilds));
    }
    
    [HttpGet("search")]
    [Authorize]
    public async Task<ActionResult> GetUsersGuilds([FromQuery] string searchTerm)
    {
        var guilds = await unitOfWork.GuildRepository.SearchByName(searchTerm);
        return Ok(mapper.Map<IEnumerable<GuildDto>>(guilds));
    }
    
    [HttpPost("{guildId}/apply")]
    [ServiceFilter(typeof(ValidateGuildExists))]
    [Authorize]
    public async Task<ActionResult> ApplyToGuild(string guildId)
    {
        var isUserMember = await unitOfWork.GuildRepository.IsGuildMember(guildId, User.GetUserId());
        if (isUserMember) return BadRequest("You're already a member of this guild");
        
        var isUserBlacklisted = await unitOfWork.GuildRepository.IsEmailBlacklisted(guildId, User.GetUserEmail());
        if (isUserBlacklisted) return BadRequest("You can't apply to this guild");
        
        var hasOutstanding = await unitOfWork.GuildRepository
            .HasOutstandingApplication(guildId, User.GetUserId());
        if (hasOutstanding) return BadRequest("You've already applied to this guild");

        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        guild.Applications.Add(new GuildApplication
        {
            Id = Guid.NewGuid().ToString(),
            AppUserId = User.GetUserId(),
            GuildId = guildId
        });
        
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("There was an issue creating your application.");
    }
}
