using API.ActionFilters;
using API.Data.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class GuildsController
{
    [HttpGet("{guildId}/participants/search")]
    [ValidateGuildRole("Owner, Admin")]
    public async Task<ActionResult> SearchParticipants(string guildId, string searchTerm)
    {
        var result = await unitOfWork.GuildRepository.SearchParticipantsByGamertag(guildId, searchTerm);
        var participants =  result.Select(mapper.Map<EventParticipantDto>);
        return Ok(participants);
    }
    
    [HttpPost("{guildId}/participants")]
    [ValidateGuildRole("Owner, Admin")]
    public async Task<ActionResult> AddParticipants(string guildId, NewEventParticipantDto participantDto)
    {
        var participant = mapper.Map<EventParticipant>(participantDto);
        participant.GuildId = guildId;
        participant.Id = Guid.NewGuid().ToString();
        unitOfWork.Context.EventParticipants.Add(participant);
        
        if (await unitOfWork.Complete()) return Ok(mapper.Map<EventParticipantDto>(participant));
        return BadRequest();
    }
}