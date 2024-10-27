using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilters;

public class ValidateGuildRoleAttribute : TypeFilterAttribute
{
    public ValidateGuildRoleAttribute(string roleName)
        : base(typeof(ValidateGuildRole))
    {
        Arguments = [roleName];
    }
}

public class ValidateGuildRole(GuildRoleService roleService, string roles) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var guildId = (string?) context.ActionArguments["guildId"];
        if (guildId == null) throw new Exception("ClanId not provided for validation");

        var userId = context.HttpContext.User.GetUserId();
        if (userId == null) throw new Exception("UserId not provided for validation");
        
        var hasRole = await roleService.HasPermissionAsync(guildId, userId, roles);
    
        if (!hasRole)
        {
            context.Result = new UnauthorizedObjectResult("You are not authorized to perform this action");
            return;
        }
    
        await next.Invoke();
    }
}