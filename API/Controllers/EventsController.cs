using API.ActionFilters;
using API.Data;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class EventsController(UnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult> CreateEvent([FromBody] NewEventDto eventDto)
    {
        var guildExists = await unitOfWork.GuildRepository.ExistsById(eventDto.GuildId);
        if (!guildExists) return NotFound("No guild found by that Id");

        var newEvent = mapper.Map<Event>(eventDto);
        newEvent.Id = Guid.NewGuid().ToString();
        newEvent.HostId = User.GetUserId();
        unitOfWork.EventRepository.Add(newEvent);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<EventDto>(newEvent));
        return BadRequest();
    }
    
    [HttpGet("{eventId}")]
    [ServiceFilter(typeof(ValidateEventExists))]
    public async Task<ActionResult> CreateEvent(string eventId)
    {
        var guildEvent = await unitOfWork.EventRepository.GetById(eventId);
        return Ok(mapper.Map<EventDto>(guildEvent));
    }
}