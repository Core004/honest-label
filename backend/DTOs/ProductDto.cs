namespace HonestLabel.API.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public string? ImageUrl { get; set; }
    public string? Features { get; set; }
    public bool IsFeatured { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? CategorySlug { get; set; }
}

public class ProductListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsFeatured { get; set; }
    public string? CategoryName { get; set; }
    public string? CategorySlug { get; set; }
}

public class CreateProductDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public string? ImageUrl { get; set; }
    public string? Features { get; set; }
    public bool IsFeatured { get; set; }
    public required int CategoryId { get; set; }
}

public class UpdateProductDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public string? ImageUrl { get; set; }
    public string? Features { get; set; }
    public bool? IsFeatured { get; set; }
    public bool? IsActive { get; set; }
    public int? CategoryId { get; set; }
    public int? DisplayOrder { get; set; }
}
