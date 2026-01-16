using System.ComponentModel.DataAnnotations;
using HonestLabel.API.Models;

namespace HonestLabel.API.DTOs;

public class InquiryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? Phone { get; set; }
    public string? LabelType { get; set; }
    public string? Message { get; set; }
    public InquiryStatus Status { get; set; }
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateInquiryDto
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

    [StringLength(50, ErrorMessage = "Label type cannot exceed 50 characters")]
    public string? LabelType { get; set; }

    [StringLength(500, MinimumLength = 10, ErrorMessage = "Message must be between 10 and 500 characters")]
    public string? Message { get; set; }
}

public class UpdateInquiryDto
{
    public InquiryStatus? Status { get; set; }
    public string? AdminNotes { get; set; }
}
