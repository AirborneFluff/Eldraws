using API.ActionFilters;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public partial class EventsController
{
    [HttpPut("{eventId}/bingotiles")]
    [ServiceFilter(typeof(ValidateEventExists))]
    public async Task<ActionResult> SetBingoTile([FromBody] UpdateBingoTileDto bingoTileDto, string eventId)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventId(eventId);
        if (bingoEvent is null) return BadRequest("You cannot perform this action on this event type");
        if (bingoEvent.Event!.HostId != User.GetUserId()) return NotFound("Only the guild owner can do this action");

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

    [HttpGet("{eventId}/bingotiles")]
    public async Task<ActionResult> GetBingoTiles(string eventId)
    {
        var bingoEvent = await unitOfWork.EventRepository.GetBingoEventByEventId(eventId);
        if (bingoEvent is null) return BadRequest("You cannot perform this action on this event type");

        var tiles = await unitOfWork.EventRepository.GetBingoBoardTiles(bingoEvent.Id);
        return Ok(mapper.Map<List<BingoBoardTileDto>>(tiles));
    }
}