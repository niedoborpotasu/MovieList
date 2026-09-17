namespace backend.Config;

public class TmdbConfig
{
    public string BaseUrl { get; set; } = "https://api.themoviedb.org/3/";
    public string BearerToken { get; set; } = string.Empty;
}