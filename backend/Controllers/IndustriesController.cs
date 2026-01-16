using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.Models;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IndustriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public IndustriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Industry>>> GetIndustries()
    {
        var industries = await _context.Industries
            .Where(i => i.IsActive)
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync();
        return Ok(industries);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Industry>> GetIndustry(string slug)
    {
        var industry = await _context.Industries
            .FirstOrDefaultAsync(i => i.Slug == slug && i.IsActive);
        if (industry == null) return NotFound();
        return Ok(industry);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<Industry>>> GetAllIndustries()
    {
        var industries = await _context.Industries
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync();
        return Ok(industries);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Industry>> CreateIndustry(Industry industry)
    {
        industry.CreatedAt = DateTime.UtcNow;
        _context.Industries.Add(industry);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetIndustry), new { slug = industry.Slug }, industry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateIndustry(int id, Industry dto)
    {
        var industry = await _context.Industries.FindAsync(id);
        if (industry == null) return NotFound();

        industry.Name = dto.Name;
        industry.Slug = dto.Slug;
        industry.Description = dto.Description;
        industry.ImageUrl = dto.ImageUrl;
        industry.Icon = dto.Icon;
        industry.IsActive = dto.IsActive;
        industry.DisplayOrder = dto.DisplayOrder;
        industry.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteIndustry(int id)
    {
        var industry = await _context.Industries.FindAsync(id);
        if (industry == null) return NotFound();

        _context.Industries.Remove(industry);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
