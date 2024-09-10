﻿using API.Entities;
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
}