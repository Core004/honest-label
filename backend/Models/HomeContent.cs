namespace HonestLabel.API.Models;

public class HomeContent
{
    public int Id { get; set; }
    public required string Section { get; set; } // hero, stats, cta
    public required string Key { get; set; }
    public string? Value { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
