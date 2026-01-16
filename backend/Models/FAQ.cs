namespace HonestLabel.API.Models;

public class FAQ
{
    public int Id { get; set; }
    public required string Question { get; set; }
    public required string Answer { get; set; }
    public string? Category { get; set; } // general, products, shipping, etc.
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
