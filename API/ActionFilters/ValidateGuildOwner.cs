using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilters;

public class ValidateGuildOwner(UnitOfWork unitOfWork) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var guildId = (string?) context.ActionArguments["guildId"];
        if (guildId == null) throw new Exception("ClanId not provided for validation");

        var userId = context.HttpContext.User.GetUserId();
        if (userId == null) throw new Exception("UserId not provided for validation");
        
        var isGuildOwner = await unitOfWork.GuildRepository.IsGuildOwner(guildId, userId);
        if (!isGuildOwner)
        {
            context.Result = new UnauthorizedObjectResult("Only the guild owner can do this action");
            return;
        }
        
        await next.Invoke();
    }
}