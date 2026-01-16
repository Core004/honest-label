namespace HonestLabel.API.DTOs;

public class BlogPostDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public string? Author { get; set; }
    public bool IsPublished { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class BlogPostListDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? ImageUrl { get; set; }
    public string? Author { get; set; }
    public DateTime? PublishedAt { get; set; }
}

public class CreateBlogPostDto
{
    public required string Title { get; set; }
    public string? Excerpt { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public string? Author { get; set; }
    public bool IsPublished { get; set; }
}

public class UpdateBlogPostDto
{
    public string? Title { get; set; }
    public string? Excerpt { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public string? Author { get; set; }
    public bool? IsPublished { get; set; }
}
