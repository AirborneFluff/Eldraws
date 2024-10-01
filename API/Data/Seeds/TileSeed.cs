using AutoMapper;
using API.Data.DTOs;
using API.Entities;
using API.Services;
using System.Text.Json;

namespace API.Data.Seeds
{
    public sealed class TileSeed
    {
        public static async Task SeedTiles(IMapper mapper, UnitOfWork unitOfWork, ImageService imageService)
        {
            if (await unitOfWork.TileRepository.Any()) return;
            
            var tileData = await File.ReadAllTextAsync("Data/Seeds/TileSeed.json");
            var tileDTOs = JsonSerializer.Deserialize<List<TileDto>>(tileData);
            if (tileDTOs == null) return;

            var imageUrls = (await imageService.GetImagesAsync()).ToList();
            var random = new Random();

            var newTiles = mapper.Map<List<Tile>>(tileDTOs).Select(tile =>
            {
                tile.Id = Guid.NewGuid().ToString();
                tile.ImagePath = imageUrls[random.Next(imageUrls.Count)];
                return tile;
            });

            foreach (var newTile in newTiles)
            {
                unitOfWork.TileRepository.Add(newTile);
            }
            
            await unitOfWork.Complete();
        }
    }
}