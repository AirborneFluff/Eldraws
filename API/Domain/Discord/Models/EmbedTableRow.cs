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

        var spaces = currentIndex - previousIndex - previousLength;
        var substringLength = Math.Min(nextIndex - currentIndex, _columns[i].Length);
        var pad = new string(' ', Math.Max(0, spaces));

        return string.Concat(pad, _columns[i].AsSpan(0, substringLength));
    }
}