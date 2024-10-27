using API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilters;


public class ValidateGuildExistsAttribute() : TypeFilterAttribute(typeof(ValidateGuildRole));
public class ValidateGuildExists(UnitOfWork unitOfWork) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var guildId = (string?) context.ActionArguments["guildId"];
        if (guildId == null) throw new Exception("ClanId not provided for validation");
    
        var guildExists = await unitOfWork.GuildRepository.ExistsById(guildId);
    
        if (!guildExists)
        {
            context.Result = new NotFoundObjectResult("No guild found by that Id");
            return;
        }
    
        await next.Invoke();
    }
}