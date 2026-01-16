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
public class QuoteRequestsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<QuoteRequestsController> _logger;

    public QuoteRequestsController(AppDbContext context, IEmailService emailService, ILogger<QuoteRequestsController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<QuoteRequestDto>> CreateQuoteRequest(CreateQuoteRequestDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var quoteRequest = new QuoteRequest
        {
            Name = dto.Name,
            Email = dto.Email,
            Company = dto.Company,
            Phone = dto.Phone,
            ProductType = dto.ProductType,
            Size = dto.Size,
            Quantity = dto.Quantity,
            Material = dto.Material,
            PrintType = dto.PrintType,
            AdditionalDetails = dto.AdditionalDetails
        };

        _context.QuoteRequests.Add(quoteRequest);
        await _context.SaveChangesAsync();

        // Send email notifications
        try
        {
            var quoteDetails = $"Product: {dto.ProductType}\nSize: {dto.Size ?? "Not specified"}\nQuantity: {dto.Quantity ?? "Not specified"}\nMaterial: {dto.Material ?? "Not specified"}\nPrint Type: {dto.PrintType ?? "Not specified"}\nDetails: {dto.AdditionalDetails ?? "None"}";
            await _emailService.SendInquiryNotificationAsync(dto.Name, dto.Email, $"Quote Request:\n{quoteDetails}");
            await _emailService.SendInquiryConfirmationAsync(dto.Email, dto.Name);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send quote request emails");
        }

        return CreatedAtAction(nameof(GetQuoteRequest), new { id = quoteRequest.Id }, new QuoteRequestDto
        {
            Id = quoteRequest.Id,
            Name = quoteRequest.Name,
            Email = quoteRequest.Email,
            Company = quoteRequest.Company,
            Phone = quoteRequest.Phone,
            ProductType = quoteRequest.ProductType,
            Size = quoteRequest.Size,
            Quantity = quoteRequest.Quantity,
            Material = quoteRequest.Material,
            PrintType = quoteRequest.PrintType,
            AdditionalDetails = quoteRequest.AdditionalDetails,
            Status = quoteRequest.Status,
            CreatedAt = quoteRequest.CreatedAt
        });
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuoteRequestDto>>> GetQuoteRequests(
        [FromQuery] QuoteRequestStatus? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.QuoteRequests.AsQueryable();

        if (status.HasValue)
            query = query.Where(q => q.Status == status.Value);

        var quoteRequests = await query
            .OrderByDescending(q => q.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(q => new QuoteRequestDto
            {
                Id = q.Id,
                Name = q.Name,
                Email = q.Email,
                Company = q.Company,
                Phone = q.Phone,
                ProductType = q.ProductType,
                Size = q.Size,
                Quantity = q.Quantity,
                Material = q.Material,
                PrintType = q.PrintType,
                AdditionalDetails = q.AdditionalDetails,
                Status = q.Status,
                AdminNotes = q.AdminNotes,
                CreatedAt = q.CreatedAt
            })
            .ToListAsync();

        return Ok(quoteRequests);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<QuoteRequestDto>> GetQuoteRequest(int id)
    {
        var quoteRequest = await _context.QuoteRequests
            .Where(q => q.Id == id)
            .Select(q => new QuoteRequestDto
            {
                Id = q.Id,
                Name = q.Name,
                Email = q.Email,
                Company = q.Company,
                Phone = q.Phone,
                ProductType = q.ProductType,
                Size = q.Size,
                Quantity = q.Quantity,
                Material = q.Material,
                PrintType = q.PrintType,
                AdditionalDetails = q.AdditionalDetails,
                Status = q.Status,
                AdminNotes = q.AdminNotes,
                CreatedAt = q.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (quoteRequest == null)
            return NotFound();

        return Ok(quoteRequest);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuoteRequest(int id, UpdateQuoteRequestDto dto)
    {
        var quoteRequest = await _context.QuoteRequests.FindAsync(id);
        if (quoteRequest == null)
            return NotFound();

        if (dto.Status.HasValue)
            quoteRequest.Status = dto.Status.Value;
        if (dto.AdminNotes != null)
            quoteRequest.AdminNotes = dto.AdminNotes;

        quoteRequest.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuoteRequest(int id)
    {
        var quoteRequest = await _context.QuoteRequests.FindAsync(id);
        if (quoteRequest == null)
            return NotFound();

        _context.QuoteRequests.Remove(quoteRequest);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
