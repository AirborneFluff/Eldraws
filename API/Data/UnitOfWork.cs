using API.Data.Repositories;

namespace API.Data;

public class UnitOfWork(DataContext context)
{
    public DataContext Context { get; } = context;
    public GuildRepository GuildRepository => new (Context);
    public EventRepository EventRepository => new (Context);
    public TileRepository TileRepository => new (Context);
    public RaffleRepository RaffleRepository => new (Context);

    public async Task<bool> Complete()
    {
        try { return await Context.SaveChangesAsync() > 0; }
        catch { return false; }
    }

    public bool HasChanges()
    {
        return Context.ChangeTracker.HasChanges();
    }
}