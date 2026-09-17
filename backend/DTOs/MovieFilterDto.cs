namespace backend.DTOs;

public class MovieFilterDto
{
    public string? Query { get; set; }
    public int? Year { get; set; }
    public int? GenreId { get; set; }
    public string? SortBy { get; set; }
    public int? Page { get; set; }
    public int? MinVotes { get; set; } = 100;
}