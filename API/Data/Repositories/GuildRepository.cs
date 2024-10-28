using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class GuildRepository(DataContext context)
{
    public void Add(Guild guild)
    {
        context.Guilds.Add(guild);
    }

    public Task<Guild> GetById(string guildId)
    {
        // todo, reduce dependency on includes
        return context.Guilds
            .Where(guild => !guild.Archived)
            .Include(guild => guild.Memberships)
            .ThenInclude(gm => gm.AppUser)
            .Include(guild => guild.Memberships)
            .ThenInclude(gm => gm.Role)
            .FirstAsync(guild => guild.Id == guildId);
    }

    public Task<Guild?> GetFirstOrDefault(string guildId)
    {
        return context.Guilds
            .FirstOrDefaultAsync(guild => guild.Id == guildId);
    }

    public Task<bool> ExistsById(string guildId)
    {
        return context.Guilds
            .Where(guild => !guild.Archived)
            .AnyAsync(guild => guild.Id == guildId);
    }

    public Task<bool> IsGuildCreator(string guildId, string userId)
    {
        return context.Guilds
            .Where(guild => !guild.Archived)
            .AnyAsync(guild => guild.Id == guildId && guild.CreatorId == userId);
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
            .Where(gm => gm.Guild != null && !gm.Guild.Archived)
            .AsNoTracking()
            .Select(gm => gm.Guild!)
            .ToListAsync();
    }

    public Task<List<Event>> GetGuildEvents(string guildId)
    {
        return context.Events
            .Where(gm => gm.GuildId == guildId)
            .AsNoTracking()
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

    public Task<List<GuildBlacklist>> GetGuildBlacklist(string guildId)
    {
        return context.GuildBlacklists
            .Where(gm => gm.GuildId == guildId)
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

    public Task<List<GuildApplication>> GetUserGuildApplications(string appUserId)
    {
        return context.GuildApplications
            .Where(ga => ga.AppUserId == appUserId && ga.Accepted == null)
            .Include(ga => ga.AppUser)
            .Include(ga => ga.Guild)
            .AsNoTracking()
            .ToListAsync();
    }

    public Task<bool> IsGuildMember(string guidId, string appUserId)
    {
        return context.GuildMemberships
            .Include(gm => gm.Guild)
            .Where(gm => gm.Guild != null && !gm.Guild.Archived)
            .AnyAsync(gm => gm.GuildId == guidId && gm.AppUserId == appUserId);
    }

    public Task<bool> IsUserNameBlacklisted(string guidId, string userName)
    {
        return context.GuildBlacklists
            .Where(bl => bl.GuildId == guidId)
            .AnyAsync(bl => bl.UserName.ToLower() == userName.ToLower());
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

    public void RemoveBlacklist(GuildBlacklist blacklist)
    {
        context.GuildBlacklists.Remove(blacklist);
    }
    
    public Task<GuildBlacklist?> GetBlacklistByUserName(string guildId, string userName)
    {
        return context.GuildBlacklists
            .Where(bl => bl.GuildId == guildId)
            .FirstOrDefaultAsync(gb => gb.UserName.ToLower() == userName.ToLower());
    }
}