using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.DTOs;
using HonestLabel.API.Models;
using HonestLabel.API.Services;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ISlugService _slugService;

    public BlogController(AppDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BlogPostListDto>>> GetPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var posts = await _context.BlogPosts
            .Where(b => b.IsPublished)
            .OrderByDescending(b => b.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new BlogPostListDto
            {
                Id = b.Id,
                Title = b.Title,
                Slug = b.Slug,
                Excerpt = b.Excerpt,
                ImageUrl = b.ImageUrl,
                Author = b.Author,
                PublishedAt = b.PublishedAt
            })
            .ToListAsync();

        return Ok(posts);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<BlogPostDto>> GetPost(string slug)
    {
        var post = await _context.BlogPosts
            .Where(b => b.Slug == slug && b.IsPublished)
            .Select(b => new BlogPostDto
            {
                Id = b.Id,
                Title = b.Title,
                Slug = b.Slug,
                Excerpt = b.Excerpt,
                Content = b.Content,
                ImageUrl = b.ImageUrl,
                Author = b.Author,
                IsPublished = b.IsPublished,
                PublishedAt = b.PublishedAt,
                CreatedAt = b.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (post == null)
            return NotFound();

        return Ok(post);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<BlogPostDto>>> GetAllPosts()
    {
        var posts = await _context.BlogPosts
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new BlogPostDto
            {
                Id = b.Id,
                Title = b.Title,
                Slug = b.Slug,
                Excerpt = b.Excerpt,
                Content = b.Content,
                ImageUrl = b.ImageUrl,
                Author = b.Author,
                IsPublished = b.IsPublished,
                PublishedAt = b.PublishedAt,
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();

        return Ok(posts);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BlogPostDto>> CreatePost(CreateBlogPostDto dto)
    {
        var post = new BlogPost
        {
            Title = dto.Title,
            Slug = _slugService.GenerateSlug(dto.Title),
            Excerpt = dto.Excerpt,
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            Author = dto.Author,
            IsPublished = dto.IsPublished,
            PublishedAt = dto.IsPublished ? DateTime.UtcNow : null
        };

        _context.BlogPosts.Add(post);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPost), new { slug = post.Slug }, new BlogPostDto
        {
            Id = post.Id,
            Title = post.Title,
            Slug = post.Slug,
            Excerpt = post.Excerpt,
            Content = post.Content,
            ImageUrl = post.ImageUrl,
            Author = post.Author,
            IsPublished = post.IsPublished,
            PublishedAt = post.PublishedAt,
            CreatedAt = post.CreatedAt
        });
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(int id, UpdateBlogPostDto dto)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null)
            return NotFound();

        if (!string.IsNullOrEmpty(dto.Title))
        {
            post.Title = dto.Title;
            post.Slug = _slugService.GenerateSlug(dto.Title);
        }
        if (dto.Excerpt != null)
            post.Excerpt = dto.Excerpt;
        if (dto.Content != null)
            post.Content = dto.Content;
        if (dto.ImageUrl != null)
            post.ImageUrl = dto.ImageUrl;
        if (dto.Author != null)
            post.Author = dto.Author;
        if (dto.IsPublished.HasValue)
        {
            if (dto.IsPublished.Value && !post.IsPublished)
                post.PublishedAt = DateTime.UtcNow;
            post.IsPublished = dto.IsPublished.Value;
        }

        post.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null)
            return NotFound();

        _context.BlogPosts.Remove(post);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
