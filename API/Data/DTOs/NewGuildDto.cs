using System.ComponentModel.DataAnnotations;

namespace API.Data.DTOs;

public class NewGuildDto
{
    [MaxLength(25)]
    public required string Name { get; set; }
}