namespace backend.Models;

public class MediaItem
{
    public int Id {get; set;}
    public string Title {get; set;}
    public string? Poster {get; set;}
    public int? Year {get; set;}
    public string? Description {get; set;}
    public Director? Director {get; set;}
    public double? Rating {get; set;}
    public MediaType MediaType {get; set;}
    public double? Popularity {get; set;}

    public List<Actor> Actors {get; set;} = new();
    public List<Genre> Genres {get; set;} = new();
    public List<Season> Seasons {get; set;} = new();
}