namespace API.Data.DTOs;

public class GuildRoleDto
{
    public required string Id { get; set; }
    public required string GuildId { get; set; }
    public required string Name { get; set; }
}