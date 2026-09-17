namespace backend.Models;

public class UserSeason
{
    public int Id {get; set;}
    public int UserId {get; set;}
    public User User {get; set;}
    public int SeasonId {get; set;}
    public Season Season {get; set;}
    public double? Rating {get; set;}
    public string? Review {get; set;}
    public DateTime? WatchedAt {get; set;}
    public WatchStatus? WatchStatus {get; set;}
    public bool? IsFavorite {get; set;}
}