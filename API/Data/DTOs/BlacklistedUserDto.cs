namespace API.Data.DTOs;

public class BlacklistedUserDto
{
    public required string GuildId { get; set; }
    public required string UserName { get; set; }
}