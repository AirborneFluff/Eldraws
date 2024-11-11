using API.ActionFilters;
using API.Data.DTOs.Raffle;
using API.Data.Parameters;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class EventsController
{
    [HttpGet("{eventId}/raffle")]
    [ValidateGuildEventRole("Owner, Admin, Moderator, Member")]
    public async Task<ActionResult> GetRaffleEventDetails(string eventId)
    {
        var raffle = await unitOfWork.RaffleRepository.GetRaffleEventByEventIdMinimal(eventId);
        return Ok(mapper.Map<RaffleEventDto>(raffle));
    }
    
    [HttpPost("{eventId}/raffle/prizes")]
    [ValidateGuildEventRole("Owner, Admin")]
    public async Task<ActionResult> AddPrize(string eventId, [FromBody] NewRafflePrizeDto prizeDto)
    {
        var raffle = await unitOfWork.RaffleRepository.GetRaffleEventByEventIdMinimal(eventId);
        var newPrize = mapper.Map<RafflePrize>(prizeDto);
        newPrize.Id = Guid.NewGuid().ToString();
        raffle.Prizes.Add(newPrize);
        
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest();
    }
    
    [HttpPost("{eventId}/raffle/entries")]
    [ValidateGuildEventRole("Owner, Admin")]
    public async Task<ActionResult> AddEntry(string eventId, [FromBody] NewRaffleEntryDto entryDto)
    {
        var raffle = await unitOfWork.RaffleRepository.GetRaffleEventByEventIdMinimal(eventId);
        var participant = await unitOfWork.GuildRepository.GetEventParticipant(entryDto.ParticipantId);
        if (participant is null) return BadRequest("Participant not found");
        
        var newEntry = mapper.Map<RaffleEntry>(entryDto);
        newEntry.Id = Guid.NewGuid().ToString();

        var lowTicket = await unitOfWork.RaffleRepository.GetNextAvailableTicket(raffle.Id);
        var highTicket = raffle.GetHighTicket(entryDto.Donation, lowTicket);
        
        newEntry.HighTicket = highTicket;
        newEntry.LowTicket = lowTicket;
        raffle.Entries.Add(newEntry);

        if (!entryDto.Complimentary)
        {
            participant.TotalDonations += newEntry.Donation;
            raffle.TotalDonations += newEntry.Donation;
        }
        
        raffle.TotalTickets += newEntry.HighTicket == 0 ? 0 : newEntry.HighTicket - newEntry.LowTicket + 1;
        
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest();
    }
    
    [HttpGet("{eventId}/raffle/entries")]
    [ValidateGuildEventRole("Owner, Admin")]
    public async Task<ActionResult> GetEntries(string eventId, [FromQuery] RaffleEntryParams raffleEntryParams)
    {
        var raffle = await unitOfWork.RaffleRepository.GetRaffleEventByEventIdMinimal(eventId);
        var result = await unitOfWork.RaffleRepository.GetPagedEntries(raffle.Id, raffleEntryParams);
        var entries =  result.Select(mapper.Map<RaffleEntryDto>);
        
        Response.AddPaginationHeader(result);
        return Ok(entries);
    }
}