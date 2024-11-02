namespace API.Domain.Discord.Models;

public class EmbedTableOptions
{
    public required List<string> Titles { get; set; }
    public required List<int> TitleIndexes { get; set; }
    public required List<int> ColumnIndexes { get; set; }
    public int PadEnd { get; set; } = 5;
}