using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using HonestLabel.API.Data;
using HonestLabel.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Configure SQLite Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=honestlabel.db")
    .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning)));

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "HonestLabelSecretKey123456789012345678901234567890";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "HonestLabel",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "HonestLabelApp",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
            "http://localhost:5177",
            "http://localhost:3000",
            "http://172.31.69.101:5173",
            "https://honestlabel.in"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ISlugService, SlugService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Apply CORS before other middleware
app.UseCors("AllowFrontend");

// Serve static files (for uploaded images)
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Create database and seed data on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    // Seed admin user if not exists
    if (!db.AdminUsers.Any())
    {
        var adminUser = new HonestLabel.API.Models.AdminUser
        {
            Email = "admin",
            Name = "Admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin", 11),
            Role = "SuperAdmin",
            CreatedAt = DateTime.UtcNow
        };
        db.AdminUsers.Add(adminUser);
        db.SaveChanges();
    }

    // Update existing admin email to 'admin'
    var existingAdmin = db.AdminUsers.FirstOrDefault(u => u.Email == "admin@honestlabel.in");
    if (existingAdmin != null)
    {
        existingAdmin.Email = "admin";
        db.SaveChanges();
    }

    // Add Features column to Industries if not exists
    try
    {
        db.Database.ExecuteSqlRaw("ALTER TABLE Industries ADD COLUMN Features TEXT");
    }
    catch { /* Column already exists */ }

    // Create PageSettings table if not exists and seed data
    try
    {
        // Try to query PageSettings - if table doesn't exist, create it
        var tableExists = db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS PageSettings (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                PageName TEXT NOT NULL,
                PageSlug TEXT NOT NULL UNIQUE,
                PageTitle TEXT NOT NULL,
                IsPublished INTEGER NOT NULL DEFAULT 1,
                ShowInNavbar INTEGER NOT NULL DEFAULT 1,
                DisplayOrder INTEGER NOT NULL DEFAULT 0,
                CreatedAt TEXT NOT NULL,
                UpdatedAt TEXT NOT NULL
            )
        ");

        if (!db.PageSettings.Any())
        {
            var pages = new List<HonestLabel.API.Models.PageSetting>
            {
                new() { PageName = "About", PageSlug = "about", PageTitle = "About Us", IsPublished = true, ShowInNavbar = true, DisplayOrder = 1 },
                new() { PageName = "Products", PageSlug = "products", PageTitle = "Our Products", IsPublished = true, ShowInNavbar = true, DisplayOrder = 2 },
                new() { PageName = "Industries", PageSlug = "industries", PageTitle = "Industries We Serve", IsPublished = true, ShowInNavbar = true, DisplayOrder = 3 },
                new() { PageName = "Consumables", PageSlug = "consumables", PageTitle = "Consumables", IsPublished = true, ShowInNavbar = true, DisplayOrder = 4 },
                new() { PageName = "Clients", PageSlug = "clients", PageTitle = "Our Clients", IsPublished = true, ShowInNavbar = true, DisplayOrder = 5 },
                new() { PageName = "Blog", PageSlug = "blog", PageTitle = "Blog", IsPublished = true, ShowInNavbar = true, DisplayOrder = 6 },
                new() { PageName = "Contact", PageSlug = "contact", PageTitle = "Contact Us", IsPublished = true, ShowInNavbar = true, DisplayOrder = 7 },
                new() { PageName = "Get Quote", PageSlug = "get-quote", PageTitle = "Get a Quote", IsPublished = true, ShowInNavbar = true, DisplayOrder = 8 }
            };
            db.PageSettings.AddRange(pages);
            db.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"PageSettings setup: {ex.Message}");
    }
}

app.Run();
