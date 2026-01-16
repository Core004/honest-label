using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.Models;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientLogosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClientLogosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientLogo>>> GetClientLogos()
    {
        var logos = await _context.ClientLogos
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
        return Ok(logos);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<ClientLogo>>> GetAllClientLogos()
    {
        var logos = await _context.ClientLogos
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
        return Ok(logos);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ClientLogo>> CreateClientLogo(ClientLogo logo)
    {
        logo.CreatedAt = DateTime.UtcNow;
        _context.ClientLogos.Add(logo);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetClientLogos), new { id = logo.Id }, logo);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClientLogo(int id, ClientLogo dto)
    {
        var logo = await _context.ClientLogos.FindAsync(id);
        if (logo == null) return NotFound();

        logo.Name = dto.Name;
        logo.ImageUrl = dto.ImageUrl;
        logo.Website = dto.Website;
        logo.IsActive = dto.IsActive;
        logo.DisplayOrder = dto.DisplayOrder;
        logo.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClientLogo(int id)
    {
        var logo = await _context.ClientLogos.FindAsync(id);
        if (logo == null) return NotFound();

        _context.ClientLogos.Remove(logo);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
