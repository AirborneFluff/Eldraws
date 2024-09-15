using API.ActionFilters;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class GuildsController
{
    [HttpPost("{guildId}/apply")]
    [ServiceFilter(typeof(ValidateGuildExists))]
    public async Task<ActionResult> ApplyToGuild(string guildId)
    {
        var isUserMember = await unitOfWork.GuildRepository.IsGuildMember(guildId, User.GetUserId());
        if (isUserMember) return BadRequest("You're already a member of this guild");
        
        var isUserBlacklisted = await unitOfWork.GuildRepository.IsUserNameBlacklisted(guildId, User.GetUserName());
        if (isUserBlacklisted) return BadRequest("You've been blacklisted from this guild");
        
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
    
    [HttpGet("{guildId}/applications")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> GetGuildApplications(string guildId)
    {
        var applications = await unitOfWork.GuildRepository.GetGuildApplications(guildId);
        return Ok(mapper.Map<IEnumerable<GuildApplicationDto>>(applications));
    }
    
    [HttpPost("{guildId}/applications/{applicationId}/accept")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> AcceptApplication(string guildId, string applicationId)
    {
        var application = await unitOfWork.GuildRepository.GetApplicationById(applicationId);
        if (application == null) return NotFound("No application found by that Id.");
        if (application.Accepted != null) return BadRequest("This application has already been reviewed");

        var userBlacklisted = await unitOfWork.GuildRepository
            .IsUserNameBlacklisted(guildId, application.AppUser!.UserName!);
        if (userBlacklisted) return BadRequest("This user has been blacklisted");

        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        guild.Memberships.Add(new GuildMembership
        {
            AppUserId = application.AppUserId,
            GuildId = guildId,
            RoleId = guild.DefaultGuildMemberRoleId,
        });

        application.ReviewerId = User.GetUserId();
        application.ReviewDate = DateTime.UtcNow;
        application.Accepted = true;

        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("There was an issue accepting this application");
    }
    
    [HttpPost("{guildId}/applications/{applicationId}/blacklist")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> BlacklistApplication(string guildId, string applicationId)
    {
        var application = await unitOfWork.GuildRepository.GetApplicationById(applicationId);
        if (application == null) return NotFound("No application found by that Id.");
        if (application.Accepted != null) return BadRequest("This application has already been reviewed");

        var userBlacklisted = await unitOfWork.GuildRepository
            .IsUserNameBlacklisted(guildId, application.AppUser!.UserName!);
        if (!userBlacklisted)
        {
            var guild = await unitOfWork.GuildRepository.GetById(guildId);
            guild.Blacklist.Add(new GuildBlacklist
            {
                UserName = application.AppUser!.UserName!,
                GuildId = guildId
            });
        }

        application.ReviewerId = User.GetUserId();
        application.ReviewDate = DateTime.UtcNow;
        application.Accepted = false;

        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("There was an issue rejecting this application");
    }
    
    [HttpPost("{guildId}/applications/{applicationId}/reject")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> RejectApplication(string guildId, string applicationId)
    {
        var application = await unitOfWork.GuildRepository.GetApplicationById(applicationId);
        if (application == null) return NotFound("No application found by that Id.");
        if (application.Accepted != null) return BadRequest("This application has already been reviewed");

        application.ReviewerId = User.GetUserId();
        application.ReviewDate = DateTime.UtcNow;
        application.Accepted = false;

        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("There was an issue rejecting this application");
    }
}