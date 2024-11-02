using System.Text;

namespace API.Domain.Discord.Models;

public class EmbedTableRow(EmbedTableRowOptions options)
{
    private readonly List<string> _columns = options.Columns;
    private readonly List<int> _indexes = options.Indexes;

    public override string ToString()
    {
        var sb = new StringBuilder();

        for (var i = 0; i < _columns.Count; i++)
        {
            sb.Append(PadRow(i));
        }

        return sb.ToString();
    }

    private string PadRow(int i)
    {
        var previousIndex = i > 0 ? _indexes[i - 1] : 0;
        var previousLength = i > 0 ? _columns[i - 1].Length : 0;
        var currentIndex = _indexes[i];
        var nextIndex = i < _indexes.Count - 1 ? _indexes[i + 1] : int.MaxValue;

        // Calculate the number of spaces between the previous and current index positions
        var spaces = currentIndex - previousIndex - previousLength;
        var pad = new string(' ', Math.Max(0, spaces - 2)); // Ensure a minimum of 2 spaces padding, but not more than current available

        // Calculate the max space available for the current word
        var availableSpace = Math.Max(0, nextIndex - currentIndex);

        // If the word length plus padding exceeds the available space, truncate it and add '...'
        string resultColumn;
        if (_columns[i].Length + pad.Length > availableSpace)
        {
            var substringLength = availableSpace - pad.Length - 3; // Allocating space for '...'
            substringLength = Math.Max(0, substringLength); // Ensure we don't have a negative substring length
            resultColumn = _columns[i].Substring(0, substringLength) + "...";
        }
        else
        {
            resultColumn = _columns[i];
        }

        // Concatenate the padding and the potentially truncated column content
        if (i == 0)
        {
            // No padding before the first element in the row
            return resultColumn;
        }
        else
        {
            return string.Concat(pad, resultColumn);
        }
    }
}