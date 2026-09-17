namespace backend.Data;

using Microsoft.EntityFrameworkCore;                                                                                                
using backend.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    
    public DbSet<MediaItem> MediaItems {get; set;}
    public DbSet<Actor> Actors {get; set;}
    public DbSet<Director> Directors {get; set;}
    public DbSet<User> Users {get; set;}
    public DbSet<UserMediaItem> UserMediaItems {get; set;}
    public DbSet<Season> Seasons {get; set;}
    public DbSet<Episode> Episodes {get; set;}
    public DbSet<UserSeason> UserSeasons { get; set; }
    public DbSet<UserEpisode> UserEpisodes { get; set; }

}