namespace HonestLabel.API.Models;

public enum InquiryStatus
{
    New,
    InProgress,
    Completed,
    Closed
}

public class Inquiry
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? Company { get; set; }
    public string? Phone { get; set; }
    public string? LabelType { get; set; }
    public string? Message { get; set; }
    public InquiryStatus Status { get; set; } = InquiryStatus.New;
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
