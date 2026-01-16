namespace HonestLabel.API.DTOs;

public class DashboardDto
{
    public int TotalProducts { get; set; }
    public int TotalCategories { get; set; }
    public int TotalBlogPosts { get; set; }
    public int TotalInquiries { get; set; }
    public int NewInquiries { get; set; }
    public List<InquiryDto> RecentInquiries { get; set; } = new();
}
