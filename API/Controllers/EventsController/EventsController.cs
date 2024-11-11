using API.ActionFilters;
using API.Data;
using API.Data.DTOs;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class EventsController(UnitOfWork unitOfWork, IMapper mapper, IConfiguration config,
    FileService fileService) : BaseApiController
{
    [HttpGet("{eventId}")]
    [ValidateGuildEventRole("Owner, Admin, Moderator, Member")]
    public async Task<ActionResult> GetEvent(string eventId)
    {
        var guildEvent = await unitOfWork.EventRepository.GetById(eventId);
        return Ok(mapper.Map<EventDto>(guildEvent));
    }
    
    [HttpPost("{eventId}/start")]
    [ValidateGuildEventRole("Owner, Admin")]
    public async Task<ActionResult> StartEvent(string eventId)
    {
        var guildEvent = await unitOfWork.EventRepository.GetById(eventId);
        guildEvent.Started = true;
        
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest("There was an issue starting the event");
    }
}