using API.Entities;

namespace API.Data.Repositories;

public class GuildRepository(DataContext context)
{
    public void Add(Guild guild)
    {
        context.Guilds.Add(guild);
    }
}