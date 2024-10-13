using API.ActionFilters;
using API.Data;
using API.Data.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class TilesController(UnitOfWork unitOfWork, IMapper mapper, ImageService imageService) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult> CreateTile([FromBody] NewTileDto tileDto)
    {
        var isGuildOwner = await unitOfWork.GuildRepository.IsGuildOwner(tileDto.GuildId, User.GetUserId());
        if (!isGuildOwner) return Unauthorized("Only the guild owner can do this action");

        var newTile = mapper.Map<Tile>(tileDto);
        newTile.Id = Guid.NewGuid().ToString();
        unitOfWork.TileRepository.Add(newTile);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<TileDto>(newTile));
        return BadRequest();
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