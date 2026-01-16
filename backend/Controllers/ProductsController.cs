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
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ISlugService _slugService;

    public ProductsController(AppDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductListDto>>> GetProducts(
        [FromQuery] string? category = null,
        [FromQuery] string? search = null,
        [FromQuery] bool? featured = null)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive && p.Category!.IsActive);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => p.Category!.Slug == category);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p => p.Name.Contains(search) ||
                                    (p.Description != null && p.Description.Contains(search)));

        if (featured.HasValue && featured.Value)
            query = query.Where(p => p.IsFeatured);

        var products = await query
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.Name)
            .Select(p => new ProductListDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                ShortDescription = p.ShortDescription,
                ImageUrl = p.ImageUrl,
                IsFeatured = p.IsFeatured,
                CategoryName = p.Category!.Name,
                CategorySlug = p.Category.Slug
            })
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductDto>> GetProduct(string slug)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.Slug == slug && p.IsActive)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Description = p.Description,
                ShortDescription = p.ShortDescription,
                ImageUrl = p.ImageUrl,
                Features = p.Features,
                IsFeatured = p.IsFeatured,
                CategoryId = p.CategoryId,
                CategoryName = p.Category!.Name,
                CategorySlug = p.Category.Slug
            })
            .FirstOrDefaultAsync();

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.Name)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Description = p.Description,
                ShortDescription = p.ShortDescription,
                ImageUrl = p.ImageUrl,
                Features = p.Features,
                IsFeatured = p.IsFeatured,
                CategoryId = p.CategoryId,
                CategoryName = p.Category!.Name,
                CategorySlug = p.Category.Slug
            })
            .ToListAsync();

        return Ok(products);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto)
    {
        var category = await _context.Categories.FindAsync(dto.CategoryId);
        if (category == null)
            return BadRequest("Invalid category");

        var product = new Product
        {
            Name = dto.Name,
            Slug = _slugService.GenerateSlug(dto.Name),
            Description = dto.Description,
            ShortDescription = dto.ShortDescription,
            ImageUrl = dto.ImageUrl,
            Features = dto.Features,
            IsFeatured = dto.IsFeatured,
            CategoryId = dto.CategoryId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { slug = product.Slug }, new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            Description = product.Description,
            ShortDescription = product.ShortDescription,
            ImageUrl = product.ImageUrl,
            Features = product.Features,
            IsFeatured = product.IsFeatured,
            CategoryId = product.CategoryId,
            CategoryName = category.Name,
            CategorySlug = category.Slug
        });
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        if (!string.IsNullOrEmpty(dto.Name))
        {
            product.Name = dto.Name;
            product.Slug = _slugService.GenerateSlug(dto.Name);
        }
        if (dto.Description != null)
            product.Description = dto.Description;
        if (dto.ShortDescription != null)
            product.ShortDescription = dto.ShortDescription;
        if (dto.ImageUrl != null)
            product.ImageUrl = dto.ImageUrl;
        if (dto.Features != null)
            product.Features = dto.Features;
        if (dto.IsFeatured.HasValue)
            product.IsFeatured = dto.IsFeatured.Value;
        if (dto.IsActive.HasValue)
            product.IsActive = dto.IsActive.Value;
        if (dto.CategoryId.HasValue)
            product.CategoryId = dto.CategoryId.Value;
        if (dto.DisplayOrder.HasValue)
            product.DisplayOrder = dto.DisplayOrder.Value;

        product.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
