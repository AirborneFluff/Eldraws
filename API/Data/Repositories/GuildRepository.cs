using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class GuildRepository(DataContext context)
{
    public void Add(Guild guild)
    {
        context.Guilds.Add(guild);
    }
    
    public void Remove(Guild guild)
    {
        context.Guilds.Remove(guild);
    }

    public Task<Guild> GetById(string guildId)
    {
        return context.Guilds
            .SingleAsync(guild => guild.Id == guildId);
    }

    public Task<bool> ExistsById(string guildId)
    {
        return context.Guilds
            .AnyAsync(guild => guild.Id == guildId);
    }

    public Task<bool> IsGuildOwner(string guildId, string userId)
    {
        return context.Guilds
            .AnyAsync(guild => guild.Id == guildId && guild.OwnerId == userId);
    }

    public Task<bool> ExistsByName(string name)
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
    
    public Task<List<GuildMembership>> GetGuildMembers(string guildId)
    {
        return context.GuildMemberships
            .Where(gm => gm.GuildId == guildId)
            .Include(gm => gm.AppUser)
            .Include(gm => gm.Role)
            .AsNoTracking()
            .ToListAsync();
    }
    
    public Task<List<GuildApplication>> GetGuildApplications(string guildId)
    {
        return context.GuildApplications
            .Where(ga => ga.GuildId == guildId && ga.Accepted == null)
            .Include(ga => ga.AppUser)
            .AsNoTracking()
            .ToListAsync();
    }

    public Task<bool> IsGuildMember(string guidId, string appUserId)
    {
        return context.GuildMemberships
            .AnyAsync(gm => gm.GuildId == guidId && gm.AppUserId == appUserId);
    }

    public Task<bool> IsEmailBlacklisted(string guidId, string email)
    {
        return context.GuildBlacklists
            .AnyAsync(blacklist => blacklist.GuildId == guidId && blacklist.Email.ToUpper() == email.ToUpper());
    }

    public Task<bool> HasOutstandingApplication(string guidId, string userId)
    {
        return context.GuildApplications
            .AnyAsync(ga =>
                ga.GuildId == guidId &&
                ga.AppUserId == userId &&
                ga.ReviewerId == null);
    }

    public Task<GuildApplication?> GetApplicationById(string applicationId)
    {
        return context.GuildApplications
            .Include(ga => ga.AppUser)
            .FirstOrDefaultAsync(a => a.Id == applicationId);
    }

    public Task<GuildMembership?> GetMembership(string guildId, string appUserId)
    {
        return context.GuildMemberships
            .FirstOrDefaultAsync(m => m.AppUserId == appUserId && m.GuildId == guildId);
    }

    public void RemoveMember(GuildMembership membership)
    {
        context.GuildMemberships.Remove(membership);
    }
}