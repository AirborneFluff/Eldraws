namespace API.Domain.Discord.Models;

public class EmbedTableRowOptions
{
    public required List<string> Columns { get; set; }
    public required List<int> Indexes { get; set; }
}