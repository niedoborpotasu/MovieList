namespace backend.DTOs;

public class UpdateRankingDto
{
    public string WatchStatus { get; set; } = string.Empty;
    public double? Rating { get; set; }
}
