using API.Data.Parameters;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class EventRepository(DataContext context)
{
    public void AddBingo(Event newEvent, BingoEventParams bingoParams)
    {
        if (newEvent.Type != Event.EventType.Bingo) throw new Exception("Event type is not Bingo");
        context.Events.Add(newEvent);
        context.BingoEvents.Add(new BingoEvent
        {
            Id = Guid.NewGuid().ToString(),
            EventId = newEvent.Id,
            ColumnCount = bingoParams.ColumnCount,
            RowCount = bingoParams.RowCount
        });
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

    public Task<BingoEvent> GetBingoEventByEventIdMinimal(string id)
    {
        return context.BingoEvents
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
                .OrderBy(s => s.SubmittedAt)
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