using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.Models;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamMembersController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeamMembersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamMember>>> GetTeamMembers()
    {
        var members = await _context.TeamMembers
            .Where(t => t.IsActive)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();
        return Ok(members);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<TeamMember>>> GetAllTeamMembers()
    {
        var members = await _context.TeamMembers
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();
        return Ok(members);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TeamMember>> CreateTeamMember(TeamMember member)
    {
        member.CreatedAt = DateTime.UtcNow;
        _context.TeamMembers.Add(member);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTeamMembers), new { id = member.Id }, member);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeamMember(int id, TeamMember dto)
    {
        var member = await _context.TeamMembers.FindAsync(id);
        if (member == null) return NotFound();

        member.Name = dto.Name;
        member.Position = dto.Position;
        member.Bio = dto.Bio;
        member.ImageUrl = dto.ImageUrl;
        member.Email = dto.Email;
        member.Phone = dto.Phone;
        member.LinkedIn = dto.LinkedIn;
        member.IsActive = dto.IsActive;
        member.DisplayOrder = dto.DisplayOrder;
        member.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeamMember(int id)
    {
        var member = await _context.TeamMembers.FindAsync(id);
        if (member == null) return NotFound();

        _context.TeamMembers.Remove(member);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
