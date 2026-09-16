namespace backend.Models;

public abstract class Person
{
    public int Id {get; set;}
    public string Name {get; set;}
    public string Surname {get; set;}
    public string? Bio {get; set;}
    public bool? IsMale {get; set;}
    public string? PlaceOfBirth {get; set;} 
    public DateOnly? DateOfBirth {get; set;}
}