using System.Text;
using Discord;

namespace API.Domain.Discord.Models;

public class EmbedTable
{
    private readonly string _title;
    private readonly List<string> _titles;
    private readonly List<int> _titleIndexes;
    private readonly List<int> _columnIndexes;
    private readonly int _padEnd;
    private readonly List<string> _rows = [];

    public EmbedTable(EmbedTableOptions options)
    {
        _titles = options.Titles;
        _titleIndexes = options.TitleIndexes;
        _columnIndexes = options.ColumnIndexes;
        _padEnd = options.PadEnd;

        if (_titles.Count != _titleIndexes.Count)
        {
            throw new Exception("The 'titles' and 'titleIndex' array must be of the same length.");
        }
        
        _title = string.Empty;
        for (var i = 0; i < _titles.Count; i++)
        {
            _title += PadTitle(i);
        }
    }

    public override string ToString()
    {
        var str = _title + "\n" + string.Join("\n", _rows);
        return str;
    }
    
    public EmbedFieldBuilder ToField()
    {
        var field = new EmbedFieldBuilder()
        {
            Name = _title,
            Value = string.Join("\n", _rows),
            IsInline = false,
        };

        return field;
    }

    public void AddRow(List<string> columns)
    {
        var sb = new StringBuilder();
        sb.Append('`');
        sb.Append(new EmbedTableRow(new EmbedTableRowOptions
        {
            Columns = columns,
            Indexes = _columnIndexes
        }).ToString().PadRight(_columnIndexes[^1] + _padEnd));
        sb.Append('`');
        
        _rows.Add(sb.ToString());
    }
    
    private string PadTitle(int i)
    {
        if (!CheckTitles())
        {
            throw new Exception("Length of a 'title' cannot be longer than the starting index of the next title. Try increasing the value of the subsequent 'titleIndex'.");
        }

        var currentIndex = _titleIndexes[i];
        var previousIndex = i > 0 ? _titleIndexes[i - 1] : 0;
        var previousLength = i > 0 ? _titles[i - 1].Length : 0;

        var spacesCount = currentIndex - previousIndex - previousLength;

        var maxLength = i < _titleIndexes.Count - 1 ?
            _titleIndexes[i + 1] - currentIndex - 1 :
            _titles[i].Length;

        maxLength = Math.Max(0, maxLength);

        return string.Concat(new string(' ', spacesCount), _titles[i].AsSpan(0, Math.Min(_titles[i].Length, maxLength)));
    }

    private bool CheckTitles()
    {
        for (var i = 0; i < _titles.Count - 1; i++)
        {
            if (_titles[i].Length > _titleIndexes[i + 1]) return false;
        }
        return true;
    }
}