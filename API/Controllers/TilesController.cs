using API.Data;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class TilesController(UnitOfWork unitOfWork, IMapper mapper, ImageService imageService) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult> CreateTile([FromBody] NewTileDto tileDto)
    {
        var isGuildOwner = await unitOfWork.GuildRepository.IsGuildCreator(tileDto.GuildId, User.GetUserId());
        if (!isGuildOwner) return Unauthorized("Only the guild owner can do this action");

        var newTile = mapper.Map<Tile>(tileDto);
        newTile.Id = Guid.NewGuid().ToString();
        unitOfWork.TileRepository.Add(newTile);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<TileDto>(newTile));
        return BadRequest("There was an error creating the tile");
    }
    
    [HttpPut("{tileId}")]
    public async Task<ActionResult> UpdateTile(string tileId, [FromBody] TileUpdateDto tileDto)
    {
        var tile = await unitOfWork.TileRepository.GetTileById(tileId);
        if (tile is null) return NotFound("Tile not found");
        if (tile.GuildId is null) return Unauthorized("You cannot update this tile");
        
        var isGuildOwner = await unitOfWork.GuildRepository.IsGuildCreator(tile.GuildId, User.GetUserId());
        if (!isGuildOwner) return Unauthorized("Only the guild owner can do this action");
        
        mapper.Map(tileDto, tile);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<TileDto>(tile));
        return BadRequest("There was an error updating the tile");
    }

    [HttpGet("images")]
    public async Task<ActionResult> GetTileImages()
    {
        var images = await imageService.GetImagesAsync();
        return Ok(images);
    }
    
    [HttpPost("upload")]
    public async Task<IActionResult> UploadTileImage(IFormFile file) 
    {
        var fileName = file.FileName;
        var mimeType = file.ContentType;
        var url = await imageService.UploadImageAsync(file.OpenReadStream(), fileName, mimeType);

        return Ok(url);   
    }
}