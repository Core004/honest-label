using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
    private const long MaxFileSize = 10 * 1024 * 1024; // 10MB

    public UploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [Authorize]
    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file, [FromQuery] string? folder = null, [FromQuery] string? name = null)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file uploaded" });

        if (file.Length > MaxFileSize)
            return BadRequest(new { error = "File size exceeds 10MB limit" });

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
            return BadRequest(new { error = "Invalid file type. Allowed: jpg, jpeg, png, gif, webp, svg" });

        // Validate folder parameter (only allow logos or photos)
        var allowedFolders = new[] { "logos", "photos", "clients" };
        var subFolder = !string.IsNullOrEmpty(folder) && allowedFolders.Contains(folder.ToLower()) ? folder.ToLower() : "";

        // Create uploads directory if it doesn't exist
        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads");
        if (!string.IsNullOrEmpty(subFolder))
        {
            uploadsFolder = Path.Combine(uploadsFolder, subFolder);
        }
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        // Generate filename - use name if provided, otherwise GUID
        string fileName;
        if (!string.IsNullOrEmpty(name))
        {
            // Sanitize the name to be filename-safe
            var safeName = string.Join("_", name.Split(Path.GetInvalidFileNameChars()));
            safeName = safeName.Replace(" ", "-").ToLowerInvariant();
            fileName = $"{safeName}{extension}";

            // If file already exists, append a number
            var counter = 1;
            var baseName = safeName;
            while (System.IO.File.Exists(Path.Combine(uploadsFolder, fileName)))
            {
                fileName = $"{baseName}-{counter}{extension}";
                counter++;
            }
        }
        else
        {
            fileName = $"{Guid.NewGuid()}{extension}";
        }

        var filePath = Path.Combine(uploadsFolder, fileName);

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Return the URL path
        var urlPath = !string.IsNullOrEmpty(subFolder) ? $"/uploads/{subFolder}/{fileName}" : $"/uploads/{fileName}";
        return Ok(new { url = urlPath, fileName });
    }

    [Authorize]
    [HttpPost("images")]
    public async Task<IActionResult> UploadMultipleImages(List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
            return BadRequest(new { error = "No files uploaded" });

        var results = new List<object>();
        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads");

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        foreach (var file in files)
        {
            if (file.Length > MaxFileSize)
            {
                results.Add(new { error = $"File {file.FileName} exceeds 10MB limit" });
                continue;
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
            {
                results.Add(new { error = $"File {file.FileName} has invalid type" });
                continue;
            }

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            results.Add(new { url = $"/uploads/{fileName}", fileName, originalName = file.FileName });
        }

        return Ok(new { uploads = results });
    }

    [Authorize]
    [HttpDelete("image/{*filePath}")]
    public IActionResult DeleteImage(string filePath)
    {
        // Prevent path traversal attacks
        if (filePath.Contains(".."))
            return BadRequest(new { error = "Invalid file path" });

        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads");
        var fullPath = Path.Combine(uploadsFolder, filePath);

        if (!System.IO.File.Exists(fullPath))
            return NotFound(new { error = "File not found" });

        System.IO.File.Delete(fullPath);
        return Ok(new { message = "File deleted successfully" });
    }

    [HttpGet("list")]
    [Authorize]
    public IActionResult ListImages()
    {
        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads");

        if (!Directory.Exists(uploadsFolder))
            return Ok(new { images = Array.Empty<object>() });

        var files = Directory.GetFiles(uploadsFolder)
            .Select(f => new FileInfo(f))
            .OrderByDescending(f => f.CreationTime)
            .Select(f => new
            {
                fileName = f.Name,
                url = $"/uploads/{f.Name}",
                size = f.Length,
                createdAt = f.CreationTime
            })
            .ToList();

        return Ok(new { images = files });
    }
}
