using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class DiagnosticsController : BaseApiController
{
    [HttpGet]
    public ActionResult Ping()
    {
        return Ok("Pong");
    }
}