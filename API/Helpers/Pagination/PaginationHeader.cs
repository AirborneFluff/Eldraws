using API.Interfaces;

namespace API.Helpers.Pagination;

public sealed class PaginationHeader(int currentPage, int itemsPerPage, int totalItems, int totalPages)
{
    public int CurrentPage { get; set; } = currentPage;
    public int PageSize { get; set; } = itemsPerPage;
    public int TotalCount { get; set; } = totalItems;
    public int TotalPages { get; set; } = totalPages;

    public PaginationHeader(IPagedList list) : this(list.CurrentPage, list.PageSize, list.TotalCount, list.TotalPages)
    {
    }
}