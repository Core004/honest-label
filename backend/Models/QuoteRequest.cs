namespace HonestLabel.API.Models;

public enum QuoteRequestStatus
{
    New,
    InProgress,
    Quoted,
    Completed,
    Closed
}

public class QuoteRequest
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? Company { get; set; }
    public string? Phone { get; set; }
    public required string ProductType { get; set; }
    public string? Size { get; set; }
    public string? Quantity { get; set; }
    public string? Material { get; set; }
    public string? PrintType { get; set; }
    public string? AdditionalDetails { get; set; }
    public QuoteRequestStatus Status { get; set; } = QuoteRequestStatus.New;
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
