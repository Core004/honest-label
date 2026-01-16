namespace HonestLabel.API.Models;

public class TeamMember
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Position { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? LinkedIn { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
