using System.Text.Json;
using System.Text.Json.Serialization;
using API.Entities;

namespace API.Helpers;

public class DiscordAuthenticationHelper(IConfiguration config)
{
    private const string TokenEndpoint = "https://discord.com/api/v10/oauth2/token";
    private const string UserInformationEndpoint = "https://discord.com/api/users/@me";
    private readonly string _clientId = config.GetValue<string>("Discord:ClientId") ?? throw new InvalidOperationException();
    private readonly string _clientSecret = config.GetValue<string>("Discord:ClientSecret") ?? throw new InvalidOperationException();
    private readonly string _redirectUri = config.GetValue<string>("Discord:RedirectUri") ?? throw new InvalidOperationException();

    public static async Task<AppUser?> CreateUserFromDiscord(string token)
    {
        using var client = new HttpClient();

        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync(UserInformationEndpoint);
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var userResponse = JsonSerializer.Deserialize<UserResponse>(responseContent);
        if (userResponse == null) return null;

        return new AppUser()
        {
            Email = userResponse.Email,
            UserName = userResponse.UserName
        };
    }

    public async Task<TokenResponse?> ExchangeCode(string code)
    {
        using var client = new HttpClient();
        var data = new Dictionary<string, string>
        {
            { "grant_type", "authorization_code" },
            { "code", code },
            { "redirect_uri", _redirectUri }
        };

        var content = new FormUrlEncodedContent(data);

        var authToken = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);

        var response = await client.PostAsync(TokenEndpoint, content);
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<TokenResponse>(responseContent);
    }
}

public class TokenResponse
{
    [JsonPropertyName("token_type")]
    public required string TokenType { get; set; }
    [JsonPropertyName("access_token")]
    public required string AccessToken { get; set; }
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
    [JsonPropertyName("refresh_token")]
    public required string RefreshToken { get; set; }
    [JsonPropertyName("scope")]
    public required string Scope { get; set; }
}

public class UserResponse
{
    [JsonPropertyName("username")]
    public required string UserName { get; set; }
    [JsonPropertyName("email")]
    public required string Email { get; set; }
}