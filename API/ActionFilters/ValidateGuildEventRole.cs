using API.Data;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.ActionFilters;

public class ValidateGuildEventRoleAttribute : TypeFilterAttribute
{
    public ValidateGuildEventRoleAttribute(string roleName)
        : base(typeof(ValidateGuildEventRole))
    {
        Arguments = [roleName];
    }
}

public class ValidateGuildEventRole(UnitOfWork unitOfWork, GuildRoleService roleService, string roles) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var eventId = (string?) context.ActionArguments["eventId"];
        if (eventId == null) throw new Exception("EventId not provided for validation");
        
        var guildEvent = await unitOfWork.Context.Events
            .FirstOrDefaultAsync(e => e.Id == eventId);
        
        if (guildEvent is null)
        {
            context.Result = new NotFoundObjectResult("No event found by that Id");
            return;
        }

        var userId = context.HttpContext.User.GetUserId();
        if (userId == null) throw new Exception("UserId not provided for validation");
        
        var hasRole = await roleService.HasPermissionAsync(guildEvent.GuildId, userId, roles);
    
        if (!hasRole)
        {
            context.Result = new UnauthorizedObjectResult("You are not authorized to perform this action");
            return;
        }
    
        await next.Invoke();
    }
}