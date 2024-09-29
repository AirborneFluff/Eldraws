using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilters;

public class ValidateBingoEventExists(UnitOfWork unitOfWork) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var eventId = (string?) context.ActionArguments["eventId"];
        if (eventId == null) throw new Exception("EventId not provided for validation");
        
        var bingoEventExists = await unitOfWork.EventRepository.EventTypeExistsById(eventId, Event.EventType.Bingo);
    
        if (!bingoEventExists)
        {
            context.Result = new NotFoundObjectResult("No bingo event found by that Id");
            return;
        }
    
        await next.Invoke();
    }
}