using System.ComponentModel.DataAnnotations;
using HonestLabel.API.Models;

namespace HonestLabel.API.DTOs;

public class QuoteRequestDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? Phone { get; set; }
    public string ProductType { get; set; } = string.Empty;
    public string? Size { get; set; }
    public string? Quantity { get; set; }
    public string? Material { get; set; }
    public string? PrintType { get; set; }
    public string? AdditionalDetails { get; set; }
    public QuoteRequestStatus Status { get; set; }
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateQuoteRequestDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
    public required string Name { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address")]
    public required string Email { get; set; }

    [StringLength(100, ErrorMessage = "Company name cannot exceed 100 characters")]
    public string? Company { get; set; }

    [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits")]
    public string? Phone { get; set; }

    [Required(ErrorMessage = "Product type is required")]
    [StringLength(100, ErrorMessage = "Product type cannot exceed 100 characters")]
    public required string ProductType { get; set; }

    [StringLength(50, ErrorMessage = "Size cannot exceed 50 characters")]
    public string? Size { get; set; }

    [StringLength(50, ErrorMessage = "Quantity cannot exceed 50 characters")]
    public string? Quantity { get; set; }

    [StringLength(50, ErrorMessage = "Material cannot exceed 50 characters")]
    public string? Material { get; set; }

    [StringLength(50, ErrorMessage = "Print type cannot exceed 50 characters")]
    public string? PrintType { get; set; }

    [StringLength(1000, ErrorMessage = "Additional details cannot exceed 1000 characters")]
    public string? AdditionalDetails { get; set; }
}

public class UpdateQuoteRequestDto
{
    public QuoteRequestStatus? Status { get; set; }
    public string? AdminNotes { get; set; }
}
