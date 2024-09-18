using API.Entities;

namespace API.Data.Repositories;

public class EventRepository(DataContext context)
{
    public void Add(Event newEvent)
    {
        context.Events.Add(newEvent);
    }
}