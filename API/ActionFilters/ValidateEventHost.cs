using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilters;

public class ValidateEventHost(UnitOfWork unitOfWork) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var eventId = (string?) context.ActionArguments["eventId"];
        if (eventId == null) throw new Exception("EventId not provided for validation");

        var userId = context.HttpContext.User.GetUserId();
        if (userId == null) throw new Exception("UserId not provided for validation");
    
        var eventExists = await unitOfWork.EventRepository.EventHostById(eventId, userId);
    
        if (!eventExists)
        {
            context.Result = new NotFoundObjectResult("No event found by that Id");
            return;
        }
    
        await next.Invoke();
    }
}