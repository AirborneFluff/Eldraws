namespace API.Data.DTOs;

public class NewBingoEventDto : NewEventDto
{
    public int ColumnCount { get; set; } = 5;
    public int RowCount { get; set; } = 5;
}