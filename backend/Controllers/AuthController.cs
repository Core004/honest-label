using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Data;
using HonestLabel.API.DTOs;
using HonestLabel.API.Services;

namespace HonestLabel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuthService _authService;

    public AuthController(AppDbContext context, IAuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginDto dto)
    {
        var user = await _context.AdminUsers
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);

        if (user == null)
            return Unauthorized(new { message = "Invalid credentials" });

        if (!_authService.VerifyPassword(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid credentials" });

        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var token = _authService.GenerateJwtToken(user);
        var refreshToken = _authService.GenerateRefreshToken();

        return Ok(new LoginResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            User = new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role
            }
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<AdminUserDto>> GetCurrentUser()
    {
        var userId = User.FindFirst("id")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _context.AdminUsers.FindAsync(int.Parse(userId));
        if (user == null)
            return NotFound();

        return Ok(new AdminUserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role
        });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
    {
        var userId = User.FindFirst("id")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _context.AdminUsers.FindAsync(int.Parse(userId));
        if (user == null)
            return NotFound();

        if (!_authService.VerifyPassword(dto.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Current password is incorrect" });

        user.PasswordHash = _authService.HashPassword(dto.NewPassword);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password changed successfully" });
    }
}
