namespace backend.Models;

public class Episode
{
    public int Id {get; set;}
    public int EpisodeNumber {get; set;}
    public int SeasonId {get; set;}
    public Season Season {get; set;}
    public string Title {get; set;}
    public string? Description {get; set;}
    public DateOnly? PremiereDate {get; set;}
    public double? Rating {get; set;}
}