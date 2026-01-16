using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.Models;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConsumablesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ConsumablesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Consumable>>> GetConsumables()
    {
        var consumables = await _context.Consumables
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
        return Ok(consumables);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Consumable>> GetConsumable(string slug)
    {
        var consumable = await _context.Consumables
            .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive);
        if (consumable == null) return NotFound();
        return Ok(consumable);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<Consumable>>> GetAllConsumables()
    {
        var consumables = await _context.Consumables
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
        return Ok(consumables);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Consumable>> CreateConsumable(Consumable consumable)
    {
        consumable.CreatedAt = DateTime.UtcNow;
        _context.Consumables.Add(consumable);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetConsumable), new { slug = consumable.Slug }, consumable);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateConsumable(int id, Consumable dto)
    {
        var consumable = await _context.Consumables.FindAsync(id);
        if (consumable == null) return NotFound();

        consumable.Name = dto.Name;
        consumable.Slug = dto.Slug;
        consumable.Description = dto.Description;
        consumable.ImageUrl = dto.ImageUrl;
        consumable.Icon = dto.Icon;
        consumable.IsActive = dto.IsActive;
        consumable.DisplayOrder = dto.DisplayOrder;
        consumable.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteConsumable(int id)
    {
        var consumable = await _context.Consumables.FindAsync(id);
        if (consumable == null) return NotFound();

        _context.Consumables.Remove(consumable);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
