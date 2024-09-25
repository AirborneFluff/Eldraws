using Azure.Storage.Blobs;

namespace API.Services;

public class ImageService(IConfiguration config, BlobServiceClient blobServiceClient)
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
}