using API.Data.Repositories;

namespace API.Data;

public class UnitOfWork(DataContext context)
{
    public GuildRepository GuildRepository => new GuildRepository(context);

    public async Task<bool> Complete()
    {
        try { return await context.SaveChangesAsync() > 0; }
        catch { return false; }
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}