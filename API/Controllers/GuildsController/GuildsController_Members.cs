﻿using API.ActionFilters;
using API.Data.DTOs;
using API.Entities;
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
    
    [HttpGet("{guildId}/blacklist")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> GetGuildBlacklist(string guildId)
    {
        var users = await unitOfWork.GuildRepository.GetGuildBlacklist(guildId);
        return Ok(mapper.Map<IEnumerable<BlacklistedUserDto>>(users));
    }
    
    [HttpPost("{guildId}/blacklist/{userName}")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
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
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> RemoveFromBlacklist(string guildId, string userName)
    {
        var blacklistedUser = await unitOfWork.GuildRepository.GetBlacklistByUserName(guildId, userName);
        if (blacklistedUser == null) return NotFound("No blacklisted member found by this username");
        
        unitOfWork.GuildRepository.RemoveBlacklist(blacklistedUser);
        
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("Issue removing username from blacklist");
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
}