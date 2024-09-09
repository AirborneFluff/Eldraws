using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class GuildRepository(DataContext context)
{
    public void Add(Guild guild)
    {
        context.Guilds.Add(guild);
    }

    public Task<bool> Exists(string name)
    {
        return context.Guilds
            .AnyAsync(guild => guild.Name.ToUpper() == name.ToUpper());
    }

    public Task<List<Guild>> SearchByName(string name)
    {
        return context.Guilds
            .Where(guild => guild.Name.ToUpper().Contains(name.ToUpper()))
            .OrderBy(guild => guild.Name)
            .Take(10)
            .AsNoTracking()
            .ToListAsync();
    }
    
    public Task<List<Guild>> GetUsersGuilds(string userId)
    {
        return context.GuildMemberships
            .Where(gm => gm.AppUserId == userId)
            .Include(gm => gm.Guild)
            .AsNoTracking()
            .Select(gm => gm.Guild!)
            .ToListAsync();
    }
}