using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

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
    
    public async Task<string> UploadImageAsync(Stream imageStream, string imageName, string mimeType)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(_imageContainerName);
        var blobClient = containerClient.GetBlobClient(imageName);

        await blobClient.UploadAsync(imageStream, new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders
            {
                ContentType = mimeType
            }
        });
        
        return blobClient.Uri.ToString();
    }
}