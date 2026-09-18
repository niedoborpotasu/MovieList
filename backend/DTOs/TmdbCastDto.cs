namespace backend.DTOs;

using System.Text.Json.Serialization;

public class TmdbCastDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("character")]
    public string? Character { get; set; }
}
