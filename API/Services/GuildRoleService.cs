using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class GuildRoleService(DataContext dbContext)
{
    public Task<bool> HasPermissionAsync(string guildId, string appUserId, string roles)
    {
        var requiredRoles = roles.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        return HasPermissionAsync(guildId, appUserId, requiredRoles);
    }

    public async Task<bool> HasPermissionAsync(string guildId, string appUserId, string[] requiredRoles)
    {
        return await dbContext.GuildMemberships
            .Include(gm => gm.Role)
            .AnyAsync(gm => gm.GuildId == guildId && gm.AppUserId == appUserId && requiredRoles.Contains(gm.Role!.Name));
    }
}