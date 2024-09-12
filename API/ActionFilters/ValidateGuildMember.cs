using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilters;

public class ValidateGuildMember(UnitOfWork unitOfWork) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var guildId = (string?) context.ActionArguments["guildId"];
        if (guildId == null) throw new Exception("ClanId not provided for validation");

        var userId = context.HttpContext.User.GetUserId();
        if (userId == null) throw new Exception("UserId not provided for validation");
    
        var isMember = await unitOfWork.GuildRepository.IsGuildMember(guildId, userId);
    
        if (!isMember)
        {
            context.Result = new UnauthorizedObjectResult("Only guild members can do this action");
            return;
        }
    
        await next.Invoke();
    }
}