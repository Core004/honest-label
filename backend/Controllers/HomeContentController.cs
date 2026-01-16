using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.Models;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeContentController : ControllerBase
{
    private readonly AppDbContext _context;

    public HomeContentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HomeContent>>> GetHomeContent()
    {
        var content = await _context.HomeContents
            .OrderBy(h => h.Section)
            .ThenBy(h => h.Key)
            .ToListAsync();
        return Ok(content);
    }

    [HttpGet("section/{section}")]
    public async Task<ActionResult<IEnumerable<HomeContent>>> GetHomeContentBySection(string section)
    {
        var content = await _context.HomeContents
            .Where(h => h.Section == section)
            .OrderBy(h => h.Key)
            .ToListAsync();
        return Ok(content);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<HomeContent>> CreateHomeContent(HomeContent content)
    {
        content.UpdatedAt = DateTime.UtcNow;
        _context.HomeContents.Add(content);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetHomeContent), new { id = content.Id }, content);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHomeContent(int id, HomeContent dto)
    {
        var content = await _context.HomeContents.FindAsync(id);
        if (content == null) return NotFound();

        content.Section = dto.Section;
        content.Key = dto.Key;
        content.Value = dto.Value;
        content.ImageUrl = dto.ImageUrl;
        content.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpPut("upsert")]
    public async Task<IActionResult> UpsertHomeContent(HomeContent dto)
    {
        var content = await _context.HomeContents
            .FirstOrDefaultAsync(h => h.Section == dto.Section && h.Key == dto.Key);

        if (content == null)
        {
            dto.UpdatedAt = DateTime.UtcNow;
            _context.HomeContents.Add(dto);
        }
        else
        {
            content.Value = dto.Value;
            content.ImageUrl = dto.ImageUrl;
            content.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHomeContent(int id)
    {
        var content = await _context.HomeContents.FindAsync(id);
        if (content == null) return NotFound();

        _context.HomeContents.Remove(content);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
