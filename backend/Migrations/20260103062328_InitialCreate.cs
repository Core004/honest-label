using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HonestLabel.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BlogPosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Slug = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Excerpt = table.Column<string>(type: "TEXT", nullable: true),
                    Content = table.Column<string>(type: "TEXT", nullable: true),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Author = table.Column<string>(type: "TEXT", nullable: true),
                    IsPublished = table.Column<bool>(type: "INTEGER", nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogPosts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Icon = table.Column<string>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Inquiries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Company = table.Column<string>(type: "TEXT", nullable: true),
                    Phone = table.Column<string>(type: "TEXT", nullable: true),
                    LabelType = table.Column<string>(type: "TEXT", nullable: true),
                    Message = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    AdminNotes = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inquiries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Key = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Slug = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    ShortDescription = table.Column<string>(type: "TEXT", nullable: true),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Features = table.Column<string>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsFeatured = table.Column<bool>(type: "INTEGER", nullable: false),
                    DisplayOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "AdminUsers",
                columns: new[] { "Id", "CreatedAt", "Email", "IsActive", "LastLoginAt", "Name", "PasswordHash", "Role" },
                values: new object[] { 1, new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(5448), "admin@honestlabel.in", true, null, "Admin", "$2a$11$K5VxmhKPcQVf8Y9q8qzqQeJ8zU0a3wFzNwKz5YhF.kpZzF5DQwXWa", "SuperAdmin" });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Description", "Icon", "IsActive", "Name", "Slug", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 3, 6, 23, 28, 445, DateTimeKind.Utc).AddTicks(6436), "Weatherproof polyester labels, cold-storage barcode labels, safety zone labels", "lucide:shield", true, "Specialty Labels", "specialty-labels", null },
                    { 2, new DateTime(2026, 1, 3, 6, 23, 28, 445, DateTimeKind.Utc).AddTicks(7226), "Tamper-resistant holographic labels, warranty labels, void tamper-proof labels", "lucide:lock", true, "Security & Compliance", "security-compliance", null },
                    { 3, new DateTime(2026, 1, 3, 6, 23, 28, 445, DateTimeKind.Utc).AddTicks(7229), "Promotional labels, jewelry tags, custom branding labels", "lucide:tag", true, "Retail & Branding", "retail-branding", null },
                    { 4, new DateTime(2026, 1, 3, 6, 23, 28, 445, DateTimeKind.Utc).AddTicks(7231), "Specialized labels for rigorous industrial demands", "lucide:factory", true, "Industrial Labels", "industrial-labels", null },
                    { 5, new DateTime(2026, 1, 3, 6, 23, 28, 445, DateTimeKind.Utc).AddTicks(7232), "Compostable food-safe labels, recyclable packaging labels", "lucide:leaf", true, "Eco-Friendly Labels", "eco-friendly", null },
                    { 6, new DateTime(2026, 1, 3, 6, 23, 28, 445, DateTimeKind.Utc).AddTicks(7233), "Custom pre-printed barcode labels, weatherproof variants", "lucide:barcode", true, "Barcode Labels", "barcode-labels", null }
                });

            migrationBuilder.InsertData(
                table: "SiteSettings",
                columns: new[] { "Id", "Description", "Key", "UpdatedAt", "Value" },
                values: new object[,]
                {
                    { 1, "Company name", "company_name", new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(4470), "Honest Label" },
                    { 2, "Company tagline", "company_tagline", new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(4989), "Labeling Solutions That Work" },
                    { 3, "Contact phone", "phone", new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(4990), "+91 95123 70018" },
                    { 4, "Contact email", "email", new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(4991), "hello@honestit.in" },
                    { 5, "Office address", "address", new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(4992), "170/171, HonestIT - Corporate House, Besides Sanskruti Building, Near Old High-Court, Ashram Rd, Ahmedabad, Gujarat 380009" },
                    { 6, "Business hours", "business_hours", new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(4993), "Monday - Saturday: 9:30 AM - 6:30 PM" },
                    { 7, "Facebook page URL", "facebook_url", new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(4993), "" },
                    { 8, "LinkedIn page URL", "linkedin_url", new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(4994), "" },
                    { 9, "Instagram page URL", "instagram_url", new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(4995), "" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryId", "CreatedAt", "Description", "DisplayOrder", "Features", "ImageUrl", "IsActive", "IsFeatured", "Name", "ShortDescription", "Slug", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 6, new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(2445), null, 0, null, "https://honestlabel.in/wp-content/uploads/2024/03/Barcode-Labels-for-Lab-Vials-3.png", true, true, "Lab Vial Barcodes", "High-precision barcodes designed for small circumference vials. Cryogenic and moisture resistant.", "lab-vial-barcodes", null },
                    { 2, 3, new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(3676), null, 0, null, "https://honestlabel.in/wp-content/uploads/2024/03/Retail-Garment-Tags-1.png", true, true, "Retail Garment Tags", "Premium hang tags and adhesive labels for clothing with high-quality print finish.", "retail-garment-tags", null },
                    { 3, 4, new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(3677), null, 0, null, "https://honestlabel.in/wp-content/uploads/2025/02/Floor-Marking-Stickers-1.png", true, true, "Floor Marking Stickers", "Heavy-duty, abrasion-resistant floor graphics for warehouse safety and directional signage.", "floor-marking-stickers", null },
                    { 4, 2, new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(3679), null, 0, null, "https://honestlabel.in/wp-content/uploads/2024/03/Void-Tamper-Proof-Labels-1.png", true, true, "Void Tamper Proof Labels", "Leaves a 'VOID' residue when removed. Essential for warranty seals and asset protection.", "void-tamper-proof", null },
                    { 5, 1, new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(3680), null, 0, null, "https://honestlabel.in/wp-content/uploads/2025/02/Active-RFID-Labels-for-Tracking-3.png", true, true, "Active RFID Labels", "Smart labels embedded with RFID chips for real-time inventory tracking and logistics.", "active-rfid-labels", null },
                    { 6, 3, new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(3681), null, 0, null, "https://honestlabel.in/wp-content/uploads/2025/02/Bath-and-Beauty-Product-Labels-3.png", true, true, "Bath & Beauty Labels", "Waterproof and oil-resistant finishes tailored for shampoos, soaps, and lotions.", "bath-beauty-labels", null },
                    { 7, 5, new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(3682), null, 0, null, "https://honestlabel.in/wp-content/uploads/2025/02/Biodegradable-Labels-for-Disposable-Items-3.png", true, true, "Biodegradable Labels", "Sustainable labeling solutions for disposable items, fully compostable materials.", "biodegradable-labels", null },
                    { 8, 2, new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(3683), null, 0, null, "https://honestlabel.in/wp-content/uploads/2024/03/Tamper-Proof-Neck-Labels-3.png", true, true, "Bottle Neck Labels", "Specialized seals for bottles and jars to ensure product integrity and freshness.", "bottle-neck-labels", null },
                    { 9, 1, new DateTime(2026, 1, 3, 6, 23, 28, 446, DateTimeKind.Utc).AddTicks(3684), null, 0, null, "https://honestlabel.in/wp-content/uploads/2024/03/Sterilized-Equipment-Labels-1.png", true, true, "Sterilized Equipment Labels", "Autoclave-safe labels that withstand high heat and sterilization processes.", "sterilized-equipment-labels", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdminUsers_Email",
                table: "AdminUsers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_Slug",
                table: "BlogPosts",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Slug",
                table: "Categories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Slug",
                table: "Products",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SiteSettings_Key",
                table: "SiteSettings",
                column: "Key",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminUsers");

            migrationBuilder.DropTable(
                name: "BlogPosts");

            migrationBuilder.DropTable(
                name: "Inquiries");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "SiteSettings");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
