namespace API.Data.DTOs;

public class GuildMemberDto
{
    public required string AppUserId { get; set; }
    
    public required string UserName { get; set; }
    public required string Email { get; set; }
}