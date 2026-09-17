namespace backend.Models;

public class Actor : Person
{
    public List<MediaItem> MediaItems {get; set;} = new();
}