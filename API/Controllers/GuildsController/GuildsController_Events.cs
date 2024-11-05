using API.ActionFilters;
using API.Data.DTOs;
using API.Data.Parameters;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class GuildsController
{
    [HttpPost("{guildId}/events/bingo")]
    [ValidateGuildRole("Owner, Admin")]
    public async Task<ActionResult> CreateBingoEvent(string guildId, [FromBody] NewBingoEventDto eventDto)
    {
        var newEvent = mapper.Map<Event>(eventDto);
        var bingoParams = mapper.Map<BingoEventParams>(eventDto);
        newEvent.Id = Guid.NewGuid().ToString();
        newEvent.HostId = User.GetUserId();
        newEvent.GuildId = guildId;
        newEvent.Type = Event.EventType.Bingo;
        
        unitOfWork.EventRepository.AddBingo(newEvent, bingoParams);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<EventDto>(newEvent));
        return BadRequest();
    }
    
    [HttpPost("{guildId}/events/raffle")]
    [ValidateGuildRole("Owner, Admin")]
    public async Task<ActionResult> CreateRaffleEvent(string guildId, [FromBody] NewRaffleEventDto eventDto)
    {
        var newEvent = mapper.Map<Event>(eventDto);
        var raffleParams = mapper.Map<RaffleEventParams>(eventDto);
        newEvent.Id = Guid.NewGuid().ToString();
        newEvent.HostId = User.GetUserId();
        newEvent.GuildId = guildId;
        newEvent.Type = Event.EventType.Raffle;
        
        unitOfWork.RaffleRepository.AddRaffle(newEvent, raffleParams);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<EventDto>(newEvent));
        return BadRequest();
    }
}