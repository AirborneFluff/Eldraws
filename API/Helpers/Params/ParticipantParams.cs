using API.Helpers.Pagination;

namespace API.Helpers.Params;

public class ParticipantParams : PaginationParams
{
    public string? Gamertag { get; set; }
    public string? OrderBy { get; set; }
}