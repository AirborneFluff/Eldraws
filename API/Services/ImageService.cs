using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace API.Services;

public class ImageService(IConfiguration config, BlobServiceClient blobServiceClient, FileService fileService)
{
    private readonly string _imageContainerName = 
        config.GetSection("Azure")["ImagesBlobContainer"] ?? throw new Exception("Azure blob storage not configured");

    public async Task<List<string>> GetImagesAsync()
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(_imageContainerName);
        var blobNames = await containerClient
            .GetBlobsAsync()
            .Select(blobItem => $"{containerClient.Uri}/{blobItem.Name}")
            .ToListAsync();

        return blobNames;
    }
    
    public Task<string> UploadImageAsync(Stream imageStream, string imageName, string mimeType)
    {
        return fileService.UploadFileAsync(imageStream, imageName, mimeType, _imageContainerName);
    }
}