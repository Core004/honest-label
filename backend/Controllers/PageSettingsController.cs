using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.Models;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PageSettingsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<PageSettingsController> _logger;

    public PageSettingsController(AppDbContext context, ILogger<PageSettingsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/pagesettings - Public endpoint for navbar
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PageSetting>>> GetPageSettings()
    {
        var pages = await _context.PageSettings
            .Where(p => p.IsPublished && p.ShowInNavbar)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();

        return Ok(pages);
    }

    // GET: api/pagesettings/all - Admin endpoint to get all pages
    [HttpGet("all")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<PageSetting>>> GetAllPageSettings()
    {
        var pages = await _context.PageSettings
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();

        return Ok(pages);
    }

    // GET: api/pagesettings/{slug}
    [HttpGet("{slug}")]
    public async Task<ActionResult<PageSetting>> GetPageSetting(string slug)
    {
        var page = await _context.PageSettings
            .FirstOrDefaultAsync(p => p.PageSlug == slug);

        if (page == null)
        {
            return NotFound();
        }

        return Ok(page);
    }

    // GET: api/pagesettings/check/{slug} - Check if a page is published
    [HttpGet("check/{slug}")]
    public async Task<ActionResult<bool>> CheckPagePublished(string slug)
    {
        var page = await _context.PageSettings
            .FirstOrDefaultAsync(p => p.PageSlug == slug);

        if (page == null)
        {
            return Ok(true); // If page not in settings, assume it's published
        }

        return Ok(page.IsPublished);
    }

    // PUT: api/pagesettings/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdatePageSetting(int id, PageSetting pageSetting)
    {
        var existingPage = await _context.PageSettings.FindAsync(id);
        if (existingPage == null)
        {
            return NotFound();
        }

        existingPage.PageName = pageSetting.PageName;
        existingPage.PageTitle = pageSetting.PageTitle;
        existingPage.IsPublished = pageSetting.IsPublished;
        existingPage.ShowInNavbar = pageSetting.ShowInNavbar;
        existingPage.DisplayOrder = pageSetting.DisplayOrder;
        existingPage.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PageSettingExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return Ok(existingPage);
    }

    // PUT: api/pagesettings/{id}/toggle - Quick toggle publish status
    [HttpPut("{id}/toggle")]
    [Authorize]
    public async Task<IActionResult> TogglePageSetting(int id)
    {
        var page = await _context.PageSettings.FindAsync(id);
        if (page == null)
        {
            return NotFound();
        }

        page.IsPublished = !page.IsPublished;
        page.ShowInNavbar = page.IsPublished; // Also hide from navbar when unpublished
        page.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(page);
    }

    // POST: api/pagesettings - Create new page setting (admin only)
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<PageSetting>> CreatePageSetting(PageSetting pageSetting)
    {
        pageSetting.CreatedAt = DateTime.UtcNow;
        pageSetting.UpdatedAt = DateTime.UtcNow;

        _context.PageSettings.Add(pageSetting);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPageSetting), new { slug = pageSetting.PageSlug }, pageSetting);
    }

    // DELETE: api/pagesettings/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeletePageSetting(int id)
    {
        var page = await _context.PageSettings.FindAsync(id);
        if (page == null)
        {
            return NotFound();
        }

        _context.PageSettings.Remove(page);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PageSettingExists(int id)
    {
        return _context.PageSettings.Any(e => e.Id == id);
    }
}
