namespace backend.Services;
using backend.Config;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using backend.DTOs;
using System.Net.Http.Json;

public class TmdbService
{
    private readonly HttpClient _httpClient;
    private readonly TmdbConfig _config;

    public TmdbService(HttpClient httpClient, IOptions<TmdbConfig> config)
    {
        _httpClient = httpClient;
        _config = config.Value;
        _httpClient.BaseAddress = new Uri(_config.BaseUrl);
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
        _config.BearerToken);
    }

    async public Task<List<TmdbMovieDto>> GetPopularMoviesAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<TmdbResponseDto>("movie/popular");
        return response?.Results ?? new List<TmdbMovieDto>();
    }

    public async Task<List<TmdbMovieDto>> GetMoviesAsync(MovieFilterDto filter)
    {
        var page = filter.Page ?? 1;
        string url;
    
        if (!string.IsNullOrWhiteSpace(filter.Query))
        {
            url = $"search/movie?query={Uri.EscapeDataString(filter.Query)}&page={page}";
            if (filter.Year.HasValue)
            {
                url += $"&primary_release_year={filter.Year.Value}";
            }
        }
        else
        {
            var sortBy = string.IsNullOrWhiteSpace(filter.SortBy) ? "popularity.desc" : filter.SortBy;
            url = $"discover/movie?page={page}&sort_by={sortBy}";
    
            if (filter.Year.HasValue)
            {
                url += $"&primary_release_year={filter.Year.Value}";
            }
    
            if (filter.GenreId.HasValue)
            {
                url += $"&with_genres={filter.GenreId.Value}";
            }

            if (filter.MinVotes.HasValue)
            {
                url += $"&vote_count.gte={filter.MinVotes.Value}";
            }
        }
        var response = await _httpClient.GetFromJsonAsync<TmdbResponseDto>(url);
        return response?.Results ?? new List<TmdbMovieDto>();
    }

    public async Task<TmdbMovieDetailsDto?> GetMovieDetailsAsync(int movieId)
    {
        var response = await _httpClient.GetFromJsonAsync<TmdbMovieDetailsDto>($"movie/{movieId}?append_to_response=credits");
        return response;
    }
}
