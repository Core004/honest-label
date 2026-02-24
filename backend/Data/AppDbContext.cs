using Microsoft.EntityFrameworkCore;
using HonestLabel.API.Models;

namespace HonestLabel.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<Inquiry> Inquiries => Set<Inquiry>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<ClientLogo> ClientLogos => Set<ClientLogo>();
    public DbSet<Industry> Industries => Set<Industry>();
    public DbSet<Consumable> Consumables => Set<Consumable>();
    public DbSet<FAQ> FAQs => Set<FAQ>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<HomeContent> HomeContents => Set<HomeContent>();
    public DbSet<QuoteRequest> QuoteRequests => Set<QuoteRequest>();
    public DbSet<PageSetting> PageSettings => Set<PageSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => c.Slug).IsUnique();
            entity.Property(c => c.Name).HasMaxLength(100);
            entity.Property(c => c.Slug).HasMaxLength(100);
        });

        // Product
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasIndex(p => p.Slug).IsUnique();
            entity.Property(p => p.Name).HasMaxLength(200);
            entity.Property(p => p.Slug).HasMaxLength(200);
            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // BlogPost
        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasIndex(b => b.Slug).IsUnique();
            entity.Property(b => b.Title).HasMaxLength(200);
            entity.Property(b => b.Slug).HasMaxLength(200);
        });

        // AdminUser
        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.HasIndex(a => a.Email).IsUnique();
            entity.Property(a => a.Email).HasMaxLength(100);
            entity.Property(a => a.Name).HasMaxLength(100);
        });

        // SiteSetting
        modelBuilder.Entity<SiteSetting>(entity =>
        {
            entity.HasIndex(s => s.Key).IsUnique();
            entity.Property(s => s.Key).HasMaxLength(100);
        });

        // ClientLogo
        modelBuilder.Entity<ClientLogo>(entity =>
        {
            entity.Property(c => c.Name).HasMaxLength(200);
        });

        // Industry
        modelBuilder.Entity<Industry>(entity =>
        {
            entity.HasIndex(i => i.Slug).IsUnique();
            entity.Property(i => i.Name).HasMaxLength(200);
            entity.Property(i => i.Slug).HasMaxLength(200);
        });

        // Consumable
        modelBuilder.Entity<Consumable>(entity =>
        {
            entity.HasIndex(c => c.Slug).IsUnique();
            entity.Property(c => c.Name).HasMaxLength(200);
            entity.Property(c => c.Slug).HasMaxLength(200);
        });

        // FAQ
        modelBuilder.Entity<FAQ>(entity =>
        {
            entity.Property(f => f.Question).HasMaxLength(500);
        });

        // TeamMember
        modelBuilder.Entity<TeamMember>(entity =>
        {
            entity.Property(t => t.Name).HasMaxLength(200);
            entity.Property(t => t.Position).HasMaxLength(200);
        });

        // Testimonial
        modelBuilder.Entity<Testimonial>(entity =>
        {
            entity.Property(t => t.ClientName).HasMaxLength(200);
            entity.Property(t => t.Company).HasMaxLength(200);
        });

        // HomeContent
        modelBuilder.Entity<HomeContent>(entity =>
        {
            entity.HasIndex(h => new { h.Section, h.Key }).IsUnique();
            entity.Property(h => h.Section).HasMaxLength(50);
            entity.Property(h => h.Key).HasMaxLength(100);
        });

        // QuoteRequest
        modelBuilder.Entity<QuoteRequest>(entity =>
        {
            entity.Property(q => q.Name).HasMaxLength(100);
            entity.Property(q => q.Email).HasMaxLength(100);
            entity.Property(q => q.Company).HasMaxLength(100);
            entity.Property(q => q.Phone).HasMaxLength(15);
            entity.Property(q => q.ProductType).HasMaxLength(100);
            entity.Property(q => q.Size).HasMaxLength(50);
            entity.Property(q => q.Quantity).HasMaxLength(50);
            entity.Property(q => q.Material).HasMaxLength(50);
            entity.Property(q => q.PrintType).HasMaxLength(50);
        });

        // PageSetting
        modelBuilder.Entity<PageSetting>(entity =>
        {
            entity.HasIndex(p => p.PageSlug).IsUnique();
            entity.Property(p => p.PageName).HasMaxLength(100);
            entity.Property(p => p.PageSlug).HasMaxLength(100);
            entity.Property(p => p.PageTitle).HasMaxLength(200);
        });

        // Seed initial data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Specialty Labels", Slug = "specialty-labels", Description = "Weatherproof polyester labels, cold-storage barcode labels, safety zone labels", Icon = "lucide:shield" },
            new Category { Id = 2, Name = "Security & Compliance", Slug = "security-compliance", Description = "Tamper-resistant holographic labels, warranty labels, void tamper-proof labels", Icon = "lucide:lock" },
            new Category { Id = 3, Name = "Retail & Branding", Slug = "retail-branding", Description = "Promotional labels, jewelry tags, custom branding labels", Icon = "lucide:tag" },
            new Category { Id = 4, Name = "Industrial Labels", Slug = "industrial-labels", Description = "Specialized labels for rigorous industrial demands", Icon = "lucide:factory" },
            new Category { Id = 5, Name = "Eco-Friendly Labels", Slug = "eco-friendly", Description = "Compostable food-safe labels, recyclable packaging labels", Icon = "lucide:leaf" },
            new Category { Id = 6, Name = "Barcode Labels", Slug = "barcode-labels", Description = "Custom pre-printed barcode labels, weatherproof variants", Icon = "lucide:barcode" }
        );

        // Seed Products
        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Lab Vial Barcodes", Slug = "lab-vial-barcodes", ShortDescription = "High-precision barcodes designed for small circumference vials. Cryogenic and moisture resistant.", CategoryId = 6, ImageUrl = "https://honestlabel.in/wp-content/uploads/2024/03/Barcode-Labels-for-Lab-Vials-3.png", IsFeatured = true },
            new Product { Id = 2, Name = "Retail Garment Tags", Slug = "retail-garment-tags", ShortDescription = "Premium hang tags and adhesive labels for clothing with high-quality print finish.", CategoryId = 3, ImageUrl = "https://honestlabel.in/wp-content/uploads/2024/03/Retail-Garment-Tags-1.png", IsFeatured = true },
            new Product { Id = 3, Name = "Floor Marking Stickers", Slug = "floor-marking-stickers", ShortDescription = "Heavy-duty, abrasion-resistant floor graphics for warehouse safety and directional signage.", CategoryId = 4, ImageUrl = "https://honestlabel.in/wp-content/uploads/2025/02/Floor-Marking-Stickers-1.png", IsFeatured = true },
            new Product { Id = 4, Name = "Void Tamper Proof Labels", Slug = "void-tamper-proof", ShortDescription = "Leaves a 'VOID' residue when removed. Essential for warranty seals and asset protection.", CategoryId = 2, ImageUrl = "https://honestlabel.in/wp-content/uploads/2024/03/Void-Tamper-Proof-Labels-1.png", IsFeatured = true },
            new Product { Id = 5, Name = "Active RFID Labels", Slug = "active-rfid-labels", ShortDescription = "Smart labels embedded with RFID chips for real-time inventory tracking and logistics.", CategoryId = 1, ImageUrl = "https://honestlabel.in/wp-content/uploads/2025/02/Active-RFID-Labels-for-Tracking-3.png", IsFeatured = true },
            new Product { Id = 6, Name = "Bath & Beauty Labels", Slug = "bath-beauty-labels", ShortDescription = "Waterproof and oil-resistant finishes tailored for shampoos, soaps, and lotions.", CategoryId = 3, ImageUrl = "https://honestlabel.in/wp-content/uploads/2025/02/Bath-and-Beauty-Product-Labels-3.png", IsFeatured = true },
            new Product { Id = 7, Name = "Cosmetic & Beauty Labels", Slug = "cosmetic-beauty-labels", ShortDescription = "Premium waterproof and oil-resistant labels designed for cosmetic, skincare, and beauty products.", CategoryId = 3, ImageUrl = "/uploads/cosmetic-labels.png", IsFeatured = true },
            new Product { Id = 8, Name = "Bottle Neck Labels", Slug = "bottle-neck-labels", ShortDescription = "Specialized seals for bottles and jars to ensure product integrity and freshness.", CategoryId = 2, ImageUrl = "https://honestlabel.in/wp-content/uploads/2024/03/Tamper-Proof-Neck-Labels-3.png", IsFeatured = true },
            new Product { Id = 9, Name = "Sterilized Equipment Labels", Slug = "sterilized-equipment-labels", ShortDescription = "Autoclave-safe labels that withstand high heat and sterilization processes.", CategoryId = 1, ImageUrl = "https://honestlabel.in/wp-content/uploads/2024/03/Sterilized-Equipment-Labels-1.png", IsFeatured = true }
        );

        // Seed Site Settings
        modelBuilder.Entity<SiteSetting>().HasData(
            new SiteSetting { Id = 1, Key = "company_name", Value = "Honest Label", Description = "Company name" },
            new SiteSetting { Id = 2, Key = "company_tagline", Value = "Labeling Solutions That Work", Description = "Company tagline" },
            new SiteSetting { Id = 3, Key = "phone", Value = "+91 95123 70018", Description = "Contact phone" },
            new SiteSetting { Id = 4, Key = "email", Value = "hello@honestit.in", Description = "Contact email" },
            new SiteSetting { Id = 5, Key = "address", Value = "170/171, HonestIT - Corporate House, Besides Sanskruti Building, Near Old High-Court, Ashram Rd, Ahmedabad, Gujarat 380009", Description = "Office address" },
            new SiteSetting { Id = 6, Key = "business_hours", Value = "Monday - Saturday: 9:30 AM - 6:30 PM", Description = "Business hours" },
            new SiteSetting { Id = 7, Key = "facebook_url", Value = "", Description = "Facebook page URL" },
            new SiteSetting { Id = 8, Key = "linkedin_url", Value = "", Description = "LinkedIn page URL" },
            new SiteSetting { Id = 9, Key = "instagram_url", Value = "", Description = "Instagram page URL" }
        );

        // Admin user is seeded in Program.cs to properly hash the password

        // Seed Page Settings
        modelBuilder.Entity<PageSetting>().HasData(
            new PageSetting { Id = 1, PageName = "About", PageSlug = "about", PageTitle = "About Us", IsPublished = true, ShowInNavbar = true, DisplayOrder = 1 },
            new PageSetting { Id = 2, PageName = "Products", PageSlug = "products", PageTitle = "Our Products", IsPublished = true, ShowInNavbar = true, DisplayOrder = 2 },
            new PageSetting { Id = 3, PageName = "Industries", PageSlug = "industries", PageTitle = "Industries We Serve", IsPublished = true, ShowInNavbar = true, DisplayOrder = 3 },
            new PageSetting { Id = 4, PageName = "Consumables", PageSlug = "consumables", PageTitle = "Consumables", IsPublished = true, ShowInNavbar = true, DisplayOrder = 4 },
            new PageSetting { Id = 5, PageName = "Clients", PageSlug = "clients", PageTitle = "Our Clients", IsPublished = true, ShowInNavbar = true, DisplayOrder = 5 },
            new PageSetting { Id = 6, PageName = "Blog", PageSlug = "blog", PageTitle = "Blog", IsPublished = true, ShowInNavbar = true, DisplayOrder = 6 },
            new PageSetting { Id = 7, PageName = "Contact", PageSlug = "contact", PageTitle = "Contact Us", IsPublished = true, ShowInNavbar = true, DisplayOrder = 7 },
            new PageSetting { Id = 8, PageName = "Get Quote", PageSlug = "get-quote", PageTitle = "Get a Quote", IsPublished = true, ShowInNavbar = true, DisplayOrder = 8 }
        );
    }
}
