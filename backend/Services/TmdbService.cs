using System.Net.Http.Headers;
using System.Text.Json;
using backend.DTOs;

namespace backend.Services;

public interface ITmdbService
{
    Task<List<TmdbMovieResult>> SearchMoviesAsync(string query);
    Task<TmdbMovieDetail?> GetMovieDetailAsync(int tmdbId);
    Task<TmdbCreditsResponse?> GetCreditsAsync(int tmdbId);
    Task<TmdbWatchProvidersResponse?> GetWatchProvidersAsync(int tmdbId);
    string? BuildPosterUrl(string? posterPath);
}

public class TmdbService : ITmdbService
{
    private readonly HttpClient _httpClient;
    private readonly string? _imageBaseUrl;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public TmdbService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _imageBaseUrl = configuration["Tmdb:ImageBaseUrl"];

        var readAccessToken = configuration["Tmdb:ReadAccessToken"];
        if (!string.IsNullOrWhiteSpace(readAccessToken))
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", readAccessToken);
        }
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<List<TmdbMovieResult>> SearchMoviesAsync(string query)
    {
        var response = await _httpClient.GetAsync($"search/movie?query={Uri.EscapeDataString(query)}&include_adult=false");
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadFromJsonAsync<TmdbSearchResponse>(JsonOptions);
        return body?.Results ?? [];
    }

    public async Task<TmdbMovieDetail?> GetMovieDetailAsync(int tmdbId)
    {
        var response = await _httpClient.GetAsync($"movie/{tmdbId}");
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<TmdbMovieDetail>(JsonOptions);
    }

    public async Task<TmdbCreditsResponse?> GetCreditsAsync(int tmdbId)
    {
        var response = await _httpClient.GetAsync($"movie/{tmdbId}/credits");
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<TmdbCreditsResponse>(JsonOptions);
    }

    public async Task<TmdbWatchProvidersResponse?> GetWatchProvidersAsync(int tmdbId)
    {
        var response = await _httpClient.GetAsync($"movie/{tmdbId}/watch/providers");
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<TmdbWatchProvidersResponse>(JsonOptions);
    }


    public string? BuildPosterUrl(string? posterPath) =>
        string.IsNullOrEmpty(posterPath) ? null : $"{_imageBaseUrl}{posterPath}";
}
