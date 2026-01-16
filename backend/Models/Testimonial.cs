namespace HonestLabel.API.Models;

public class Testimonial
{
    public int Id { get; set; }
    public required string ClientName { get; set; }
    public required string Company { get; set; }
    public required string Content { get; set; }
    public string? ImageUrl { get; set; }
    public int Rating { get; set; } = 5;
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
