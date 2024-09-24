using API.Entities;

namespace API.Data.Repositories;

public class TileRepository(DataContext context)
{
    public void Add(Tile tile)
    {
        context.Tiles.Add(tile);
    }
}