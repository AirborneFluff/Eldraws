using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class EventRepository(DataContext context)
{
    public void Add(Event newEvent)
    {
        context.Events.Add(newEvent);

        switch (newEvent.Type)
        {
            case Event.EventType.TileRace:
                context.TileRaceEvents.Add(new TileRaceEvent
                {
                    Id = Guid.NewGuid().ToString(),
                    EventId = newEvent.Id
                });
                break;
            case Event.EventType.Bingo:
                context.BingoEvents.Add(new BingoEvent
                {
                    Id = Guid.NewGuid().ToString(),
                    EventId = newEvent.Id
                });
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }
    
    public Task<bool> ExistsById(string eventId)
    {
        return context.Events
            .AnyAsync(e => e.Id == eventId);
    }

    public Task<bool> EventTypeExistsById(string eventId, Event.EventType type)
    {
        return type switch
        {
            Event.EventType.TileRace => context.TileRaceEvents.AnyAsync(e => e.EventId == eventId),
            Event.EventType.Bingo => context.BingoEvents.AnyAsync(e => e.EventId == eventId),
            _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
        };
    }

    public Task<bool> EventTypeHostById(string eventId, string userId, Event.EventType type)
    {
        return type switch
        {
            Event.EventType.TileRace => context.TileRaceEvents
                .Include(e => e.Event)
                .AnyAsync(e => e.EventId == eventId && e.Event!.HostId == userId),
            Event.EventType.Bingo => context.BingoEvents
                .Include(e => e.Event)
                .AnyAsync(e => e.EventId == eventId && e.Event!.HostId == userId),
            _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
        };
    }

    public Task<Event> GetById(string id)
    {
        return context.Events.FirstAsync(e => e.Id == id);
    }

    public Task<BingoEvent> GetBingoEventByEventId(string id)
    {
        return context.BingoEvents
            .Include(e => e.Event)
            .Include(e => e.BoardTiles)
            .ThenInclude(bt => bt.Submissions)
            .FirstAsync(e => e.EventId == id);
    }

    public Task<BingoBoardTile?> GetBingoBoardTileByPosition(string bingoEventId, Position position)
    {
        return context.BingoBoardTiles
            .Where(tile => tile.BingoEventId == bingoEventId)
            .FirstOrDefaultAsync(tile => tile.Position.Column == position.Column && tile.Position.Row == position.Row);
    }

    public async Task<List<BingoBoardTile>> GetBingoBoardTiles(string bingoEventId)
    {
        var boardTiles = await context.BingoBoardTiles
            .Include(t => t.Tile)
            .Where(tile => tile.BingoEventId == bingoEventId)
            .ToListAsync();

        foreach (var tile in boardTiles)
        {
            var tileSubmissions = await context.TileSubmissions
                .Include(s => s.AppUser)
                .Where(s => s.BingoBoardTileId == tile.Id)
                .ToListAsync();
            
            var submissionsPerUser = tileSubmissions
                .GroupBy(s => s.AppUserId)
                .Select(g => g.OrderByDescending(s => s.SubmittedAt).First())
                .ToList();

            tile.Submissions = submissionsPerUser;
        }

        return boardTiles;
    }

    public Task<TileSubmission?> GetBingoTileSubmissionById(string submissionId)
    {
        return context.TileSubmissions.FirstOrDefaultAsync(t => t.Id == submissionId);
    }
}