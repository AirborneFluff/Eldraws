using API.Entities;

namespace API.Data.DTOs;

public class GuildApplicationDto
{
    public required string Id { get; set; }
    public required string AppUserId { get; set; }

    public required string GuildId { get; set; }
    public GuildDto? Guild { get; set; }
    
    public required string UserName { get; set; }
    public string? Gamertag { get; set; }
}