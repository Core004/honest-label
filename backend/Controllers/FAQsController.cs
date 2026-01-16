using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.Models;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FAQsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FAQsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FAQ>>> GetFAQs()
    {
        var faqs = await _context.FAQs
            .Where(f => f.IsActive)
            .OrderBy(f => f.DisplayOrder)
            .ToListAsync();
        return Ok(faqs);
    }

    [HttpGet("category/{category}")]
    public async Task<ActionResult<IEnumerable<FAQ>>> GetFAQsByCategory(string category)
    {
        var faqs = await _context.FAQs
            .Where(f => f.IsActive && f.Category == category)
            .OrderBy(f => f.DisplayOrder)
            .ToListAsync();
        return Ok(faqs);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<FAQ>>> GetAllFAQs()
    {
        var faqs = await _context.FAQs
            .OrderBy(f => f.Category)
            .ThenBy(f => f.DisplayOrder)
            .ToListAsync();
        return Ok(faqs);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<FAQ>> CreateFAQ(FAQ faq)
    {
        faq.CreatedAt = DateTime.UtcNow;
        _context.FAQs.Add(faq);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetFAQs), new { id = faq.Id }, faq);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFAQ(int id, FAQ dto)
    {
        var faq = await _context.FAQs.FindAsync(id);
        if (faq == null) return NotFound();

        faq.Question = dto.Question;
        faq.Answer = dto.Answer;
        faq.Category = dto.Category;
        faq.IsActive = dto.IsActive;
        faq.DisplayOrder = dto.DisplayOrder;
        faq.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFAQ(int id)
    {
        var faq = await _context.FAQs.FindAsync(id);
        if (faq == null) return NotFound();

        _context.FAQs.Remove(faq);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
