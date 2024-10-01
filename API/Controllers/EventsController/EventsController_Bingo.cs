using API.ActionFilters;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class EventsController
{
    [HttpPut("{eventId}/bingo")]
    [ServiceFilter(typeof(ValidateBingoEventHost))]
    public async Task<ActionResult> SetBingoTile([FromBody] UpdateBingoTileDto bingoTileDto, string eventId)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventId(eventId);

        var tile = await unitOfWork.TileRepository.GetTileById(bingoTileDto.TileId);
        if (tile is null) return NotFound("No tile found by that Id");

        var bingoTile = await unitOfWork.EventRepository.GetBingoBoardTileByPosition(bingoEvent.Id, bingoTileDto.TilePosition);

        if (bingoTile is not null)
        {
            bingoTile.TileId = bingoTileDto.TileId;
        }

        if (bingoTile is null)
        {
            bingoEvent.BoardTiles.Add(new BingoBoardTile
            {
                Id = Guid.NewGuid().ToString(),
                BingoEventId = bingoEvent.Id,
                TileId = bingoTileDto.TileId,
                Position = bingoTileDto.TilePosition
            });
        }

        if (await unitOfWork.Complete()) return Ok(mapper.Map<BingoBoardTileDto>(bingoTile));
        return BadRequest();
    }

    [HttpGet("{eventId}/bingo")]
    [ServiceFilter(typeof(ValidateBingoEventExists))]
    public async Task<ActionResult> GetBingoTiles(string eventId)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventId(eventId);

        var tiles = await unitOfWork.EventRepository.GetBingoBoardTiles(bingoEvent.Id);
        return Ok(mapper.Map<List<BingoBoardTileDto>>(tiles));
    }

    [HttpPost("{eventId}/bingo/{bingoTileId}/submit")]
    [ServiceFilter(typeof(ValidateBingoEventExists))]
    public async Task<ActionResult> SubmitTile(string eventId, string bingoTileId, [FromBody]NewTileSubmissionDto dto)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventId(eventId);
        var bingoTile = bingoEvent.BoardTiles.FirstOrDefault(t => t.Id == bingoTileId);
        if (bingoTile is null) return NotFound("No tile found by that Id");

        if (bingoTile.Submissions.Any(t => t.AppUserId == User.GetUserId()))
            return BadRequest("You've already submitted this tile");

        var submission = new TileSubmission
        {
            Id = Guid.NewGuid().ToString(),
            AppUserId = User.GetUserId(),
            BingoBoardTileId = bingoTileId,
            SubmittedAt = dto.SubmittedAt
        };
        
        bingoTile.Submissions.Add(submission);
        if (await unitOfWork.Complete()) return Ok();
        return BadRequest();
    }
}