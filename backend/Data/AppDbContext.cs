namespace backend.Data;

using Microsoft.EntityFrameworkCore;                                                                                                
using backend.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    
    public DbSet<Movie> Movies {get; set;}
    public DbSet<Actor> Actors {get; set;}
    public DbSet<Director> Directors {get; set;}

}