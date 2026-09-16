namespace backend.Models;

public class Actor : Person
{
    public List<Movie> Movies {get; set;} = new();
}