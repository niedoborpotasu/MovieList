namespace backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;

[ApiController]
[Route("api/[controller]")]
public class RankingController : ControllerBase
{
    private readonly AppDbContext _context;

    public RankingController(AppDbContext context)
    {
        _context = context;
    }

    private static WatchStatus ParseWatchStatus(string status)
    {
        var normalized = status.Trim().ToLower().Replace(" ", "").Replace("-", "");
        return normalized switch
        {
            "watching" => WatchStatus.Watching,
            "completed" => WatchStatus.Completed,
            "plantowatch" or "towatch" => WatchStatus.Planning,
            "dropped" => WatchStatus.Dropped,
            _ => WatchStatus.Planning
        };
    }

    private static string FormatWatchStatus(WatchStatus? status)
    {
        return status switch
        {
            WatchStatus.Watching => "Watching",
            WatchStatus.Completed => "Completed",
            WatchStatus.Planning => "To Watch",
            WatchStatus.Dropped => "Dropped",
            _ => "To Watch"
        };
    }

    private async Task EnsureInitialDataAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            user = new User
            {
                Username = "Tony Stark",
                Email = "tony@stark.com",
                PasswordHash = "hashed_default",
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            userId = user.Id;
        }

        var count = await _context.UserMediaItems.CountAsync(u => u.UserId == userId);
        if (count == 0)
        {
            var seedData = new List<(string Title, string Poster, int Year, WatchStatus Status, double Rating)>
            {
                ("Inception", "posters/inception.jpg", 2010, WatchStatus.Completed, 9),
                ("Interstellar", "posters/interstellar.jpg", 2014, WatchStatus.Watching, 10),
                ("The Dark Knight", "posters/dark_knight.jpg", 2008, WatchStatus.Planning, 9),
                ("Pulp Fiction", "", 1994, WatchStatus.Dropped, 8),
                ("Fight Club", "posters/fight_club.jpg", 1999, WatchStatus.Completed, 9),
                ("The Matrix", "", 1999, WatchStatus.Watching, 10),
                ("The Conjuring", "posters/the_conjuring.jpg", 2013, WatchStatus.Planning, 7),
                ("Gladiator", "posters/gladiator.jpg", 2000, WatchStatus.Dropped, 8)
            };

            foreach (var item in seedData)
            {
                var media = await _context.MediaItems.FirstOrDefaultAsync(m => m.Title == item.Title);
                if (media == null)
                {
                    media = new MediaItem
                    {
                        Title = item.Title,
                        Poster = item.Poster,
                        Year = item.Year,
                        MediaType = MediaType.Movie
                    };
                    _context.MediaItems.Add(media);
                    await _context.SaveChangesAsync();
                }

                var userMedia = new UserMediaItem
                {
                    UserId = userId,
                    MediaItemId = media.Id,
                    WatchStatus = item.Status,
                    Rating = item.Rating,
                    WatchedAt = DateTime.UtcNow
                };
                _context.UserMediaItems.Add(userMedia);
            }

            await _context.SaveChangesAsync();
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RankingItemDto>>> GetRanking([FromQuery] int userId = 1)
    {
        await EnsureInitialDataAsync(userId);

        var items = await _context.UserMediaItems
            .Include(u => u.MediaItem)
            .Where(u => u.UserId == userId)
            .Select(u => new RankingItemDto
            {
                Id = u.Id,
                MediaItemId = u.MediaItemId,
                Title = u.MediaItem != null ? u.MediaItem.Title : "Unknown",
                Poster = u.MediaItem != null ? u.MediaItem.Poster : null,
                Year = u.MediaItem != null ? u.MediaItem.Year : null,
                WatchStatus = FormatWatchStatus(u.WatchStatus),
                Rating = u.Rating,
                Review = u.Review
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<RankingItemDto>> AddToRanking([FromBody] AddRankingDto dto)
    {
        await EnsureInitialDataAsync(dto.UserId);

        var media = await _context.MediaItems.FirstOrDefaultAsync(m => m.Title == dto.Title);
        if (media == null)
        {
            media = new MediaItem
            {
                Title = dto.Title,
                Poster = dto.Poster,
                Year = dto.Year,
                MediaType = MediaType.Movie
            };
            _context.MediaItems.Add(media);
            await _context.SaveChangesAsync();
        }

        var userMedia = await _context.UserMediaItems
            .FirstOrDefaultAsync(u => u.UserId == dto.UserId && u.MediaItemId == media.Id);

        var parsedStatus = ParseWatchStatus(dto.WatchStatus);

        if (userMedia == null)
        {
            userMedia = new UserMediaItem
            {
                UserId = dto.UserId,
                MediaItemId = media.Id,
                WatchStatus = parsedStatus,
                Rating = dto.Rating,
                WatchedAt = DateTime.UtcNow
            };
            _context.UserMediaItems.Add(userMedia);
        }
        else
        {
            userMedia.WatchStatus = parsedStatus;
            if (dto.Rating.HasValue)
            {
                userMedia.Rating = dto.Rating;
            }
        }

        await _context.SaveChangesAsync();

        var result = new RankingItemDto
        {
            Id = userMedia.Id,
            MediaItemId = media.Id,
            Title = media.Title,
            Poster = media.Poster,
            Year = media.Year,
            WatchStatus = FormatWatchStatus(userMedia.WatchStatus),
            Rating = userMedia.Rating,
            Review = userMedia.Review
        };

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<RankingItemDto>> UpdateRanking(int id, [FromBody] UpdateRankingDto dto)
    {
        var userMedia = await _context.UserMediaItems
            .Include(u => u.MediaItem)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (userMedia == null)
        {
            return NotFound();
        }

        userMedia.WatchStatus = ParseWatchStatus(dto.WatchStatus);
        if (dto.Rating.HasValue)
        {
            userMedia.Rating = dto.Rating.Value;
        }

        await _context.SaveChangesAsync();

        var result = new RankingItemDto
        {
            Id = userMedia.Id,
            MediaItemId = userMedia.MediaItemId,
            Title = userMedia.MediaItem != null ? userMedia.MediaItem.Title : "Unknown",
            Poster = userMedia.MediaItem != null ? userMedia.MediaItem.Poster : null,
            Year = userMedia.MediaItem != null ? userMedia.MediaItem.Year : null,
            WatchStatus = FormatWatchStatus(userMedia.WatchStatus),
            Rating = userMedia.Rating,
            Review = userMedia.Review
        };

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFromRanking(int id)
    {
        var userMedia = await _context.UserMediaItems.FindAsync(id);
        if (userMedia == null)
        {
            return NotFound();
        }

        _context.UserMediaItems.Remove(userMedia);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
