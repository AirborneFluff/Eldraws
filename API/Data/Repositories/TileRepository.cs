using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class TileRepository(DataContext context)
{
    public void Add(Tile tile)
    {
        context.Tiles.Add(tile);
    }

    public Task<List<Tile>> GetAllTiles(string guildId)
    {
        return context.Tiles
            .Where(t => t.GuildId == null || t.GuildId == guildId)
            .ToListAsync();
    }
}