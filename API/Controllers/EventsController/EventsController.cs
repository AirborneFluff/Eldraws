using API.ActionFilters;
using API.Data;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class EventsController(UnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult> CreateEvent([FromBody] NewEventDto eventDto)
    {
        var isGuildOwner = await unitOfWork.GuildRepository.IsGuildOwner(eventDto.GuildId, User.GetUserId());
        if (!isGuildOwner) return NotFound("Only the guild owner can do this action");

        var newEvent = mapper.Map<Event>(eventDto);
        newEvent.Id = Guid.NewGuid().ToString();
        newEvent.HostId = User.GetUserId();
        unitOfWork.EventRepository.Add(newEvent);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<EventDto>(newEvent));
        return BadRequest();
    }
    
    [HttpGet("{eventId}")]
    [ServiceFilter(typeof(ValidateEventExists))]
    public async Task<ActionResult> GetEvent(string eventId)
    {
        var guildEvent = await unitOfWork.EventRepository.GetById(eventId);
        return Ok(mapper.Map<EventDto>(guildEvent));
    }
    
    [HttpPost("{eventId}/start")]
    [ServiceFilter(typeof(ValidateEventHost))]
    public async Task<ActionResult> StartEvent(string eventId)
    {
        var guildEvent = await unitOfWork.EventRepository.GetById(eventId);
        guildEvent.Started = true;
        
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("There was an issue starting the event");
    }
}