namespace backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly TmdbService _tmdbService;
    
        public MoviesController(TmdbService tmdbService)
        {
            _tmdbService = tmdbService;
        }
    
        [HttpGet]
        public async Task<IActionResult> GetMovies([FromQuery] MovieFilterDto filter)
        {
            var movies = await _tmdbService.GetMoviesAsync(filter);
            return Ok(movies);
        }
}