using API.Data;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilters;

public class ValidateBingoEventHost(UnitOfWork unitOfWork) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var eventId = (string?) context.ActionArguments["eventId"];
        if (eventId == null) throw new Exception("EventId not provided for validation");

        var userId = context.HttpContext.User.GetUserId();
        if (userId == null) throw new Exception("UserId not provided for validation");
        
        var bingoEventExists = await unitOfWork.EventRepository.EventTypeHostById(eventId, userId, Event.EventType.Bingo);
        
        if (!bingoEventExists)
        {
            context.Result = new UnauthorizedObjectResult("Only the event host can do this action");
            return;
        }
    
        await next.Invoke();
    }
}