namespace backend.DTOs;

using System.Text.Json.Serialization;

public class TmdbCreditsDto
{
    [JsonPropertyName("cast")]
    public List<TmdbCastDto> Cast { get; set; } = new();

    [JsonPropertyName("crew")]
    public List<TmdbCrewDto> Crew { get; set; } = new();
}
