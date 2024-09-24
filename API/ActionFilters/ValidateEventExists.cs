using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilters;

public class ValidateEventExists(UnitOfWork unitOfWork) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var eventId = (string?) context.ActionArguments["eventId"];
        if (eventId == null) throw new Exception("EventId not provided for validation");
    
        var eventExists = await unitOfWork.EventRepository.ExistsById(eventId);
    
        if (!eventExists)
        {
            context.Result = new NotFoundObjectResult("No event found by that Id");
            return;
        }
    
        await next.Invoke();
    }
}