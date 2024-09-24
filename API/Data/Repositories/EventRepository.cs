using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class EventRepository(DataContext context)
{
    public void Add(Event newEvent)
    {
        context.Events.Add(newEvent);
    }
    
    public Task<bool> ExistsById(string eventId)
    {
        return context.Events
            .AnyAsync(e => e.Id == eventId);
    }

    public Task<Event> GetById(string id)
    {
        return context.Events.FirstAsync(e => e.Id == id);
    }
}