namespace HonestLabel.API.Models;

public class SiteSetting
{
    public int Id { get; set; }
    public required string Key { get; set; }
    public string? Value { get; set; }
    public string? Description { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
