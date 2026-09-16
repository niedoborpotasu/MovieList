namespace backend.Models;

public class Director : Person
{
    public List<Movie> DirectedMovies {get; set;} = new();
}