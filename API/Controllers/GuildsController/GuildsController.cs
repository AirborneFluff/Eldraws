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
        newGuild.CreatorId = User.GetUserId();

        var guildRoles = GuildRole
            .CreateDefaultGuildRoles(newGuild.Id, out var defaultRoleId, out var ownerRoleId);
        
        newGuild.DefaultGuildMemberRoleId = defaultRoleId;
        newGuild.Roles.AddRange(guildRoles);
        
        newGuild.Memberships.Add(new GuildMembership
        {
            AppUserId = User.GetUserId(),
            GuildId = newGuild.Id,
            RoleId = ownerRoleId
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
    [ValidateGuildRole("Owner, Admin, Moderator, Member")]
    public async Task<ActionResult> GetGuild(string guildId)
    {
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        return Ok(mapper.Map<GuildDto>(guild));
    }
    
    [HttpDelete("{guildId}")]
    [ValidateGuildRole("Owner")]
    public async Task<ActionResult> ArchiveGuild(string guildId)
    {
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        guild.Archived = true;

        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("There was an issue archiving this guild");
    }

    [HttpGet("{guildId}/events")]
    [ValidateGuildRole("Owner, Admin, Moderator, Member")]
    public async Task<ActionResult> GetGuildEvents(string guildId)
    {
        var events = await unitOfWork.GuildRepository.GetGuildEvents(guildId);
        return Ok(mapper.Map<List<EventDto>>(events));
    }
}
