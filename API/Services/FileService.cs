using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace API.Services;

public class FileService(IConfiguration config, BlobServiceClient blobServiceClient)
{
    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string mimeType, string containerName)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(fileName);

        await blobClient.UploadAsync(fileStream, new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders
            {
                ContentType = mimeType
            }
        });
        
        return blobClient.Uri.ToString();
    }
    
    public async Task<List<string>> GetFilesAsync(string containerName)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        var blobNames = await containerClient
            .GetBlobsAsync()
            .Select(blobItem => $"{containerClient.Uri}/{blobItem.Name}")
            .ToListAsync();

        return blobNames;
    }
}