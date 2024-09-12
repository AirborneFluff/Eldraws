using API.ActionFilters;
using API.Data.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class GuildsController
{
    [HttpGet("{guildId}")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> GetGuild(string guildId)
    {
        var guild = await unitOfWork.GuildRepository.GetById(guildId);
        return Ok(mapper.Map<GuildDto>(guild));
    }
    
    [HttpGet("{guildId}/members")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> GetGuildMembers(string guildId)
    {
        var members = await unitOfWork.GuildRepository.GetGuildMembers(guildId);
        return Ok(mapper.Map<IEnumerable<GuildMemberDto>>(members));
    }
    
    [HttpGet("{guildId}/applications")]
    [ServiceFilter(typeof(ValidateGuildOwner))]
    public async Task<ActionResult> GetGuildApplications(string guildId)
    {
        var applications = await unitOfWork.GuildRepository.GetGuildApplications(guildId);
        return Ok(mapper.Map<IEnumerable<GuildApplicationDto>>(applications));
    }
}