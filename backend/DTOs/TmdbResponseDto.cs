namespace backend.DTOs;
using System.Text.Json.Serialization;

public class TmdbResponseDto
{
    [JsonPropertyName("page")]
    public int Page { get; set; }
    [JsonPropertyName("results")]
    public List<TmdbMovieDto> Results { get; set; } = new List<TmdbMovieDto>();
    [JsonPropertyName("total_pages")]
    public int TotalPages { get; set; }
    [JsonPropertyName("total_results")]
    public int TotalResults { get; set; }
}