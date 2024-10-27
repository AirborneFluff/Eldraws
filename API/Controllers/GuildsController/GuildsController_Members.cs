using API.ActionFilters;
using API.Data.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public partial class GuildsController
{
    [HttpGet("{guildId}/members")]
    [ValidateGuildRole("Owner, Admin, Moderator")]
    public async Task<ActionResult> GetGuildMembers(string guildId)
    {
        var members = await unitOfWork.GuildRepository.GetGuildMembers(guildId);
        return Ok(mapper.Map<IEnumerable<GuildMemberDto>>(members));
    }
    
    [HttpGet("{guildId}/blacklist")]
    [ValidateGuildRole("Owner, Admin, Moderator")]
    public async Task<ActionResult> GetGuildBlacklist(string guildId)
    {
        var users = await unitOfWork.GuildRepository.GetGuildBlacklist(guildId);
        return Ok(mapper.Map<IEnumerable<BlacklistedUserDto>>(users));
    }
    
    [HttpPost("{guildId}/blacklist/{userName}")]
    [ValidateGuildRole("Owner, Admin")]
    public async Task<ActionResult> AddUserToBlacklist(string guildId, string userName)
    {
        var userBlacklisted = await unitOfWork.GuildRepository
            .IsUserNameBlacklisted(guildId, userName);
        if (userBlacklisted) return BadRequest("This username has already been blacklisted");
        
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        guild.Blacklist.Add(new GuildBlacklist
        {
            UserName = userName,
            GuildId = guildId
        });

        var outstandingApplications = await unitOfWork.GuildRepository.GetGuildApplications(guildId);
        var application = outstandingApplications
            .FirstOrDefault(apl => apl.AppUser!.UserName!.ToLower() == userName.ToLower());

        if (application != null)
            return BadRequest("This user has already applied.\nBlacklist this user through the applications page");
        

        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("Issue adding username to blacklist");
    }
    
    [HttpDelete("{guildId}/blacklist/{userName}")]
    [ValidateGuildRole("Owner, Admin")]
    public async Task<ActionResult> RemoveFromBlacklist(string guildId, string userName)
    {
        var blacklistedUser = await unitOfWork.GuildRepository.GetBlacklistByUserName(guildId, userName);
        if (blacklistedUser == null) return NotFound("No blacklisted member found by this username");
        
        unitOfWork.GuildRepository.RemoveBlacklist(blacklistedUser);
        
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("Issue removing username from blacklist");
    }
    
    [HttpPost("{guildId}/members/{appUserId}/remove")]
    [ValidateGuildRole("Owner, Admin")]
    public async Task<ActionResult> RemoveGuildMember(string guildId, string appUserId)
    {
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        if (guild.CreatorId == appUserId) return BadRequest("You cannot remove the owner from the Guild");
        
        var membership = await unitOfWork.GuildRepository.GetMembership(guildId, appUserId);
        if (membership == null) return NotFound("There is no member with that user id");
        
        unitOfWork.GuildRepository.RemoveMember(membership);

        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("Issue removing member from Guild");
    }
    
    [HttpPost("{guildId}/members/{appUserId}/blacklist")]
    [ValidateGuildRole("Owner, Admin")]
    public async Task<ActionResult> BlacklistGuildMember(string guildId, string appUserId)
    {
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        if (guild.CreatorId == appUserId) return BadRequest("You cannot remove the owner from the Guild");
        
        var membership = await unitOfWork.GuildRepository.GetMembership(guildId, appUserId);
        if (membership == null) return NotFound("There is no member with that user id");
        
        var user = await userManager.FindByIdAsync(appUserId);
        if (user == null) return BadRequest("Couldn't find any user by that Id");
        
        var userBlacklisted = await unitOfWork.GuildRepository
            .IsUserNameBlacklisted(guildId, user.UserName!);
        if (userBlacklisted) return BadRequest("This username has already been blacklisted");
        
        unitOfWork.GuildRepository.RemoveMember(membership);
        guild.Blacklist.Add(new GuildBlacklist
        {
            UserName = user.UserName!,
            GuildId = guildId
        });

        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("Issue blacklisting and removing member from Guild");
    }
    
    [HttpPut("{guildId}/members/{appUserId}/role")]
    [ValidateGuildRole("Owner")]
    public async Task<ActionResult> UpdateGuildMemberRole(string guildId, string appUserId, [FromBody] GuildMembershipRoleUpdateDto roleUpdateDto)
    {
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        if (guild.CreatorId == appUserId) return BadRequest("You cannot update the Guild owner");
        
        var membership = await unitOfWork.Context.GuildMemberships
            .Include(gm => gm.Role)
            .FirstOrDefaultAsync(gm => gm.GuildId == guildId && gm.AppUserId == appUserId);
        if (membership is null) return BadRequest("No membership between this guild and user");
        
        var guildRole = await unitOfWork.Context.GuildRoles
            .FirstOrDefaultAsync(gr => gr.GuildId == guildId && gr.Name == roleUpdateDto.RoleName);
        if (guildRole is null) return BadRequest("The role could not be found");
        
        membership.Role = guildRole;
        if (await unitOfWork.Complete()) return Ok(mapper.Map<GuildRoleDto>(guildRole));
        return BadRequest("Issue updating member role");
    }
}