namespace backend.Models;

public class UserEpisode
{
    public int Id {get; set;}
    public int UserId {get; set;}
    public User User {get; set;}
    public int EpisodeId {get; set;}
    public Episode Episode {get; set;}
    public double? Rating {get; set;}
    public string? Review {get; set;}
    public DateTime? WatchedAt {get; set;}
    public WatchStatus? WatchStatus {get; set;}
    public bool? IsFavorite {get; set;}
}