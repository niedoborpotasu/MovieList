namespace backend.DTOs;
using System.Text.Json.Serialization;

public class TmdbMovieDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; } 
    [JsonPropertyName("original_title")]
    public string OriginalTitle { get; set; } = string.Empty;
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    [JsonPropertyName("overview")] 
    public string Overview { get; set; } = string.Empty;
    [JsonPropertyName("release_date")]
    public string ReleaseDate { get; set; } = string.Empty;
    [JsonPropertyName("poster_path")]
    public string PosterPath { get; set; } = string.Empty;
    [JsonPropertyName("vote_average")]
    public double VoteAverage { get; set; }
    [JsonPropertyName("vote_count")]
    public int VoteCount { get; set; }
    [JsonPropertyName("popularity")]
    public double Popularity { get; set; }
    [JsonPropertyName("genre_ids")]
    public List<int> GenreIds { get; set; } = new List<int>();
}