using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.DTOs;
using HonestLabel.API.Models;

namespace HonestLabel.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardDto>> GetDashboard()
    {
        var dashboard = new DashboardDto
        {
            TotalProducts = await _context.Products.CountAsync(),
            TotalCategories = await _context.Categories.CountAsync(),
            TotalBlogPosts = await _context.BlogPosts.CountAsync(),
            TotalInquiries = await _context.Inquiries.CountAsync(),
            NewInquiries = await _context.Inquiries.CountAsync(i => i.Status == InquiryStatus.New),
            RecentInquiries = await _context.Inquiries
                .OrderByDescending(i => i.CreatedAt)
                .Take(5)
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
                    CreatedAt = i.CreatedAt
                })
                .ToListAsync()
        };

        return Ok(dashboard);
    }
}
