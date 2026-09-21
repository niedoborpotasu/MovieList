namespace backend.DTOs;

public class RankingItemDto
{
    public int Id { get; set; }
    public int MediaItemId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Poster { get; set; }
    public int? Year { get; set; }
    public string WatchStatus { get; set; } = string.Empty;
    public double? Rating { get; set; }
    public string? Review { get; set; }
}
