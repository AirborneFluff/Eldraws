using API.ActionFilters;
using API.Data;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class EventsController(UnitOfWork unitOfWork, IMapper mapper, IConfiguration config,
    FileService fileService, GuildRoleService roleService) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult> CreateEvent([FromBody] NewEventDto eventDto)
    {
        var hasAdminPermission = await roleService
            .HasPermissionAsync(eventDto.GuildId, User.GetUserId(), "Owner, Admin");

        if (!hasAdminPermission) return Unauthorized();

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