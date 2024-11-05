using API.ActionFilters;
using API.Data.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class EventsController
{
    [HttpGet("{eventId}/bingo")]
    [ValidateGuildEventRole("Owner, Admin, Moderator, Member")]
    public async Task<ActionResult> GetRaffleEventDetails(string eventId)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventIdMinimal(eventId);
        return Ok(mapper.Map<BingoEventDto>(bingoEvent));
    }
    
    [HttpPost("{eventId}/raffle/prizes")]
    [ValidateGuildRole("Owner, Admin")]
    public async Task<ActionResult> AddPrize(string eventId, [FromBody] NewRafflePrizeDto prizeDto)
    {
        var raffle = await unitOfWork.RaffleRepository.GetBingoEventByEventIdMinimal(eventId);
        var newPrize = mapper.Map<RafflePrize>(prizeDto);
        raffle.Prizes.Add(newPrize);
        
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest();
    }
}