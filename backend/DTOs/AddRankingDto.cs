namespace backend.DTOs;

public class AddRankingDto
{
    public int UserId { get; set; } = 1;
    public string Title { get; set; } = string.Empty;
    public string? Poster { get; set; }
    public int? Year { get; set; }
    public string WatchStatus { get; set; } = "To Watch";
    public double? Rating { get; set; }
}
