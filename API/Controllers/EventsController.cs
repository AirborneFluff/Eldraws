using API.ActionFilters;
using API.Data;
using API.Data.DTOs;
using API.Entities;
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
        unitOfWork.EventRepository.Add(newEvent);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<EventDto>(newEvent));
        return BadRequest();
    }
}