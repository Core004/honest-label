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
public class InquiriesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<InquiriesController> _logger;

    public InquiriesController(AppDbContext context, IEmailService emailService, ILogger<InquiriesController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<InquiryDto>> CreateInquiry(CreateInquiryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var inquiry = new Inquiry
        {
            Name = dto.Name,
            Email = dto.Email,
            Company = dto.Company,
            Phone = dto.Phone,
            LabelType = dto.LabelType,
            Message = dto.Message
        };

        _context.Inquiries.Add(inquiry);
        await _context.SaveChangesAsync();

        // Send email notifications
        try
        {
            await _emailService.SendInquiryNotificationAsync(dto.Name, dto.Email, dto.Message ?? "No message provided");
            await _emailService.SendInquiryConfirmationAsync(dto.Email, dto.Name);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send inquiry emails");
        }

        return CreatedAtAction(nameof(GetInquiry), new { id = inquiry.Id }, new InquiryDto
        {
            Id = inquiry.Id,
            Name = inquiry.Name,
            Email = inquiry.Email,
            Company = inquiry.Company,
            Phone = inquiry.Phone,
            LabelType = inquiry.LabelType,
            Message = inquiry.Message,
            Status = inquiry.Status,
            CreatedAt = inquiry.CreatedAt
        });
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InquiryDto>>> GetInquiries(
        [FromQuery] InquiryStatus? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.Inquiries.AsQueryable();

        if (status.HasValue)
            query = query.Where(i => i.Status == status.Value);

        var inquiries = await query
            .OrderByDescending(i => i.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(i => new InquiryDto
            {
                Id = i.Id,
                Name = i.Name,
                Email = i.Email,
                Company = i.Company,
                Phone = i.Phone,
                LabelType = i.LabelType,
                Message = i.Message,
                Status = i.Status,
                AdminNotes = i.AdminNotes,
                CreatedAt = i.CreatedAt
            })
            .ToListAsync();

        return Ok(inquiries);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<InquiryDto>> GetInquiry(int id)
    {
        var inquiry = await _context.Inquiries
            .Where(i => i.Id == id)
            .Select(i => new InquiryDto
            {
                Id = i.Id,
                Name = i.Name,
                Email = i.Email,
                Company = i.Company,
                Phone = i.Phone,
                LabelType = i.LabelType,
                Message = i.Message,
                Status = i.Status,
                AdminNotes = i.AdminNotes,
                CreatedAt = i.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (inquiry == null)
            return NotFound();

        return Ok(inquiry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInquiry(int id, UpdateInquiryDto dto)
    {
        var inquiry = await _context.Inquiries.FindAsync(id);
        if (inquiry == null)
            return NotFound();

        if (dto.Status.HasValue)
            inquiry.Status = dto.Status.Value;
        if (dto.AdminNotes != null)
            inquiry.AdminNotes = dto.AdminNotes;

        inquiry.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInquiry(int id)
    {
        var inquiry = await _context.Inquiries.FindAsync(id);
        if (inquiry == null)
            return NotFound();

        _context.Inquiries.Remove(inquiry);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
