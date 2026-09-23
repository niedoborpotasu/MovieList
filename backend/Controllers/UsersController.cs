namespace backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using backend.Data;
using backend.Models;
using backend.DTOs;
using backend.Services;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly PhotoService _photoService;

    public UsersController(AppDbContext context, PhotoService photoService)
    {
        _context = context;
        _passwordHasher = new PasswordHasher<User>();
        _photoService = photoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                IsAdmin = u.IsAdmin,
                AvatarUrl = u.AvatarUrl,
                BannerUrl = u.BannerUrl,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                IsAdmin = u.IsAdmin,
                AvatarUrl = u.AvatarUrl,
                BannerUrl = u.BannerUrl,
                CreatedAt = u.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
    {
        var emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
        if (emailExists)
        {
            return BadRequest("Email is already registered.");
        }

        var usernameExists = await _context.Users.AnyAsync(u => u.Username == dto.Username);
        if (usernameExists)
        {
            return BadRequest("Username is already taken.");
        }

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var result = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            AvatarUrl = user.AvatarUrl,
            BannerUrl = user.BannerUrl,
            CreatedAt = user.CreatedAt
        };

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, result);
    }

    [HttpPost("{id}/avatar")]
    public async Task<ActionResult<UserDto>> UploadAvatar(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file was uploaded.");
        }

        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var uploadResult = await _photoService.UploadAvatarAsync(file);
        if (uploadResult.Error != null)
        {
            return BadRequest(uploadResult.Error.Message);
        }

        user.AvatarUrl = uploadResult.SecureUrl?.ToString();
        await _context.SaveChangesAsync();

        var result = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            AvatarUrl = user.AvatarUrl,
            BannerUrl = user.BannerUrl,
            CreatedAt = user.CreatedAt
        };

        return Ok(result);
    }

    [HttpPost("{id}/banner")]
    public async Task<ActionResult<UserDto>> UploadBanner(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file was uploaded.");
        }

        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var uploadResult = await _photoService.UploadBannerAsync(file);
        if (uploadResult.Error != null)
        {
            return BadRequest(uploadResult.Error.Message);
        }

        user.BannerUrl = uploadResult.SecureUrl?.ToString();
        await _context.SaveChangesAsync();

        var result = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            AvatarUrl = user.AvatarUrl,
            BannerUrl = user.BannerUrl,
            CreatedAt = user.CreatedAt
        };

        return Ok(result);
    }
}