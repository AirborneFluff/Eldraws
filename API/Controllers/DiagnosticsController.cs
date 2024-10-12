using API.Data;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class DiagnosticsController(UnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpGet]
    public ActionResult Ping()
    {
        return Ok("Pong");
    }

    [HttpGet("stress/events/{eventId}/bingo")]
    public async Task<ActionResult> GetBingoTilesStress(string eventId)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventId(eventId);
        var tiles = await unitOfWork.EventRepository.GetBingoBoardTiles(bingoEvent.Id);
        return Ok();
    }
}