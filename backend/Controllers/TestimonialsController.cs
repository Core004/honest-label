using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.Models;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TestimonialsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Testimonial>>> GetTestimonials()
    {
        var testimonials = await _context.Testimonials
            .Where(t => t.IsActive)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();
        return Ok(testimonials);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<Testimonial>>> GetAllTestimonials()
    {
        var testimonials = await _context.Testimonials
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();
        return Ok(testimonials);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Testimonial>> CreateTestimonial(Testimonial testimonial)
    {
        testimonial.CreatedAt = DateTime.UtcNow;
        _context.Testimonials.Add(testimonial);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTestimonials), new { id = testimonial.Id }, testimonial);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTestimonial(int id, Testimonial dto)
    {
        var testimonial = await _context.Testimonials.FindAsync(id);
        if (testimonial == null) return NotFound();

        testimonial.ClientName = dto.ClientName;
        testimonial.Company = dto.Company;
        testimonial.Content = dto.Content;
        testimonial.ImageUrl = dto.ImageUrl;
        testimonial.Rating = dto.Rating;
        testimonial.IsActive = dto.IsActive;
        testimonial.DisplayOrder = dto.DisplayOrder;
        testimonial.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTestimonial(int id)
    {
        var testimonial = await _context.Testimonials.FindAsync(id);
        if (testimonial == null) return NotFound();

        _context.Testimonials.Remove(testimonial);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
