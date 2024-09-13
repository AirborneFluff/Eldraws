using API.ActionFilters;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class GuildsController
{
    [HttpGet("{guildId}/members")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> GetGuildMembers(string guildId)
    {
        var members = await unitOfWork.GuildRepository.GetGuildMembers(guildId);
        return Ok(mapper.Map<IEnumerable<GuildMemberDto>>(members));
    }
    
    [HttpPost("{guildId}/members/{appUserId}/remove")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> RemoveGuildMember(string guildId, string appUserId)
    {
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        if (guild.OwnerId == appUserId) return BadRequest("You cannot remove the owner from the Guild");
        
        var membership = await unitOfWork.GuildRepository.GetMembership(guildId, appUserId);
        if (membership == null) return NotFound("There is no member with that user id");
        
        unitOfWork.GuildRepository.RemoveMember(membership);

        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("Issue removing member from Guild");
    }
    
    [HttpPost("{guildId}/members/{appUserId}/blacklist")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> BlacklistGuildMember(string guildId, string appUserId)
    {
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        if (guild.OwnerId == appUserId) return BadRequest("You cannot remove the owner from the Guild");
        
        var membership = await unitOfWork.GuildRepository.GetMembership(guildId, appUserId);
        if (membership == null) return NotFound("There is no member with that user id");
        
        var user = await userManager.FindByIdAsync(appUserId);
        if (user == null) return BadRequest("Couldn't find any user by that Id");
        
        unitOfWork.GuildRepository.RemoveMember(membership);
        guild.Blacklist.Add(new GuildBlacklist
        {
            Email = user.Email!,
            GuildId = guildId
        });

        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("Issue blacklisting and removing member from Guild");
    }
}