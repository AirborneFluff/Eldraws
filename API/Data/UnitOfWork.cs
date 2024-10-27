using API.Data.Repositories;

namespace API.Data;

public class UnitOfWork(DataContext context)
{
    public DataContext Context { get; } = context;
    public GuildRepository GuildRepository => new GuildRepository(Context);
    public EventRepository EventRepository => new EventRepository(Context);
    public TileRepository TileRepository => new TileRepository(Context);

    public async Task<bool> Complete()
    {
        try { return await context.SaveChangesAsync() > 0; }
        catch { return false; }
    }

    public bool HasChanges()
    {
        return Context.ChangeTracker.HasChanges();
    }
}