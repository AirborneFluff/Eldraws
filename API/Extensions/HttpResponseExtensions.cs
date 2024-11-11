using System.Text.Json;
using API.Helpers.Pagination;
using API.Interfaces;

namespace API.Extensions;

public static class HttpResponseExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, IPagedList list)
    {
        var pageHeader = new PaginationHeader(list);

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        response.Headers.Append("Pagination", JsonSerializer.Serialize(pageHeader, options));
        response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
    }
}