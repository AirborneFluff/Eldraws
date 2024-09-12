namespace API.Data.DTOs;

public class GuildApplicationDto
{
    public required string AppUserId { get; set; }
    
    public required string UserName { get; set; }
    public required string Email { get; set; }
}