using API.ActionFilters;
using API.Data;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public partial class GuildsController(UnitOfWork unitOfWork, IMapper mapper, UserManager<AppUser> userManager) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult> CreateGuild([FromBody] NewGuildDto guild)
    {
        var guildNameTaken = await unitOfWork.GuildRepository.ExistsByName(guild.Name);
        if (guildNameTaken) return Conflict("That Guild name is already taken.");
        
        var newGuild = mapper.Map<Guild>(guild);
        newGuild.Id = Guid.NewGuid().ToString();
        newGuild.OwnerId = User.GetUserId();
        var ownerRole = new GuildRole()
        {
            Id = Guid.NewGuid().ToString(),
            GuildId = newGuild.Id,
            Name = "Owner"
        };
        var defaultRole = new GuildRole()
        {
            Id = Guid.NewGuid().ToString(),
            GuildId = newGuild.Id,
            Name = "Member"
        };
        newGuild.DefaultGuildMemberRoleId = defaultRole.Id;
        newGuild.Roles.Add(ownerRole);
        newGuild.Roles.Add(defaultRole);
        newGuild.Memberships.Add(new GuildMembership()
        {
            AppUserId = newGuild.OwnerId,
            GuildId = newGuild.Id,
            RoleId = ownerRole.Id
        });
        
        unitOfWork.GuildRepository.Add(newGuild);
        if (await unitOfWork.Complete()) return Ok(mapper.Map<GuildDto>(newGuild));

        return BadRequest("There was an issue creating this guild.");
    }
    
    [HttpGet("getUsersGuilds")]
    public async Task<ActionResult> GetUsersGuilds()
    {
        var guilds = await unitOfWork.GuildRepository.GetUsersGuilds(User.GetUserId());
        return Ok(mapper.Map<IEnumerable<GuildDto>>(guilds));
    }
    
    [HttpGet("search")]
    public async Task<ActionResult> GetUsersGuilds([FromQuery] string searchTerm)
    {
        var guilds = await unitOfWork.GuildRepository.SearchByName(searchTerm);
        return Ok(mapper.Map<IEnumerable<GuildDto>>(guilds));
    }
    
    [HttpGet("{guildId}")]
    [ServiceFilter(typeof(ValidateGuildMember))]
    public async Task<ActionResult> GetGuild(string guildId)
    {
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        return Ok(mapper.Map<GuildDto>(guild));
    }
    
    [HttpDelete("{guildId}")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> ArchiveGuild(string guildId)
    {
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        guild.Archived = true;

        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("There was an issue archiving this guild");
    }

    [HttpGet("{guildId}/events")]
    [ServiceFilter(typeof(ValidateGuildMember))]
    public async Task<ActionResult> GetGuildEvents(string guildId)
    {
        var events = await unitOfWork.GuildRepository.GetGuildEvents(guildId);
        return Ok(mapper.Map<List<EventDto>>(events));
    }
}
