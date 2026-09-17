namespace backend.Models;

public class Director : Person
{
    public List<MediaItem> DirectedMediaItems {get; set;} = new();
}