namespace HonestLabel.API.Models;

public class PageSetting
{
    public int Id { get; set; }
    public string PageName { get; set; } = string.Empty;
    public string PageSlug { get; set; } = string.Empty;
    public string PageTitle { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
    public bool ShowInNavbar { get; set; } = true;
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
