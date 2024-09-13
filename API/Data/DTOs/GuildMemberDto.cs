namespace API.Data.DTOs;

public class GuildMemberDto
{
    public required string GuildId { get; set; }
    public required string AppUserId { get; set; }
    
    public required string UserName { get; set; }
    public required string Email { get; set; }
    
    public required string RoleId { get; set; }
    public required string RoleName { get; set; }
}