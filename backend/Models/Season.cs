namespace backend.Models;

public class Season
{
    public int Id {get; set;}
    public int SeasonNumber {get; set;}
    public int MediaItemId {get; set;}
    public MediaItem MediaItem {get; set;}
    public List<Episode> Episodes {get; set;} = new();
    public double? Rating {get; set;}
    public DateOnly? PremiereDate {get; set;}
    public DateOnly? EndDate {get; set;}
    public string? Description {get; set;}
    public string? Title {get; set;}
}