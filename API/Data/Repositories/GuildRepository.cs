﻿using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class GuildRepository(DataContext context)
{
    public void Add(Guild guild)
    {
        context.Guilds.Add(guild);
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