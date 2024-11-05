using API.Data.Parameters;
using API.Entities;
using API.Extensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class RaffleRepository(DataContext context)
{
    public Task<RaffleEvent> GetBingoEventByEventIdMinimal(string id)
    {
        return context.RaffleEvents
            .FirstAsync(e => e.EventId == id);
    }
    
    public void AddRaffle(Event newEvent, RaffleEventParams raffleParams)
    {
        if (newEvent.Type != Event.EventType.Raffle) throw new Exception("Event type is not Raffle");
        context.Events.Add(newEvent);
        context.RaffleEvents.Add(new RaffleEvent()
        {
            Id = Guid.NewGuid().ToString(),
            EventId = newEvent.Id,
            PrizeDrawDate = raffleParams.PrizeDrawDate,
        });
    }

    public async Task<int> GetNextAvailableTicket(string raffleEventId)
    {
        if (!await context.RaffleEntries
                .AnyAsync(entry => entry.RaffleEventId == raffleEventId)) return 1;
        
        return await context.RaffleEntries
            .Where(entry => entry.RaffleEventId == raffleEventId)
            .MaxAsync(entry => entry.HighTicket + 1);
    }

    public async Task<EventParticipant?> GetWinnerFromTicket(string raffleEventId, int ticketNumber)
    {
        var entry = await context.RaffleEntries
            .Where(entry => entry.RaffleEventId == raffleEventId)
            .FirstOrDefaultAsync(entry => ticketNumber >= entry.LowTicket && ticketNumber <= entry.HighTicket);
        
        if (entry is null) return null;
        return await context.EventParticipants
            .FirstAsync(entrant => entrant.Id == entry.ParticipantId);
    }

    public async Task RedistributeTickets(string raffleEventId)
    {
        var raffle = await context.RaffleEvents.FirstOrDefaultAsync(raffle => raffle.Id == raffleEventId);
        if (raffle is null) return;
        
        var query = context.RaffleEntries
            .Where(entry => entry.RaffleEventId == raffleEventId)
            .OrderBy(entry => entry.LowTicket)
            .AsEnumerable();
        
        var lowTicket = 1;
        
        foreach (var entry in query)
        {
            var highTicket = raffle.GetHighTicket(entry.Donation, lowTicket);
            if (highTicket == 0) continue;
        
            entry.LowTicket = lowTicket;
            entry.HighTicket = highTicket;
            
            lowTicket = highTicket + 1;
        }
    }
}