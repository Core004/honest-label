import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

async function migrate() {
  console.log('Starting migration...');

  // Create tables
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(50) DEFAULT 'Admin',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      last_login_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      icon VARCHAR(200),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      slug VARCHAR(200) UNIQUE NOT NULL,
      description TEXT,
      short_description TEXT,
      image_url TEXT,
      features TEXT,
      is_active BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP,
      category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      slug VARCHAR(200) UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      image_url TEXT,
      author VARCHAR(200),
      is_published BOOLEAN DEFAULT false,
      published_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200) NOT NULL,
      company VARCHAR(200),
      phone VARCHAR(50),
      label_type VARCHAR(200),
      message TEXT,
      status INT DEFAULT 0,
      admin_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS quote_requests (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      company VARCHAR(100),
      phone VARCHAR(15),
      product_type VARCHAR(100) NOT NULL,
      size VARCHAR(50),
      quantity VARCHAR(50),
      material VARCHAR(50),
      print_type VARCHAR(50),
      additional_details TEXT,
      status INT DEFAULT 0,
      admin_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(100) UNIQUE NOT NULL,
      value TEXT,
      description TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS client_logos (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      image_url TEXT NOT NULL,
      website VARCHAR(500),
      is_active BOOLEAN DEFAULT true,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS industries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      slug VARCHAR(200) UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      icon VARCHAR(200),
      features TEXT,
      is_active BOOLEAN DEFAULT true,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS consumables (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      slug VARCHAR(200) UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      icon VARCHAR(200),
      features TEXT,
      is_active BOOLEAN DEFAULT true,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS faqs (
      id SERIAL PRIMARY KEY,
      question VARCHAR(500) NOT NULL,
      answer TEXT NOT NULL,
      category VARCHAR(200),
      is_active BOOLEAN DEFAULT true,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS team_members (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      position VARCHAR(200) NOT NULL,
      bio TEXT,
      image_url TEXT,
      email VARCHAR(200),
      phone VARCHAR(50),
      linkedin VARCHAR(500),
      is_active BOOLEAN DEFAULT true,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      client_name VARCHAR(200) NOT NULL,
      company VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      rating INT DEFAULT 5,
      is_active BOOLEAN DEFAULT true,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS home_contents (
      id SERIAL PRIMARY KEY,
      section VARCHAR(50) NOT NULL,
      key VARCHAR(100) NOT NULL,
      value TEXT,
      image_url TEXT,
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(section, key)
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS page_settings (
      id SERIAL PRIMARY KEY,
      page_name VARCHAR(100) NOT NULL,
      page_slug VARCHAR(100) UNIQUE NOT NULL,
      page_title VARCHAR(200) NOT NULL,
      is_published BOOLEAN DEFAULT true,
      show_in_navbar BOOLEAN DEFAULT true,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`;

  console.log('Tables created.');

  // Seed admin user
  const adminExists = await sql`SELECT id FROM admin_users WHERE email = 'admin' LIMIT 1`;
  if (adminExists.rows.length === 0) {
    const hash = bcrypt.hashSync('admin', 11);
    await sql`INSERT INTO admin_users (email, password_hash, name, role) VALUES ('admin', ${hash}, 'Admin', 'SuperAdmin')`;
    console.log('Admin user seeded.');
  }

  // Seed categories
  const catExists = await sql`SELECT id FROM categories LIMIT 1`;
  if (catExists.rows.length === 0) {
    await sql`INSERT INTO categories (name, slug, description, icon) VALUES
      ('Specialty Labels', 'specialty-labels', 'Weatherproof polyester labels, cold-storage barcode labels, safety zone labels', 'lucide:shield'),
      ('Security & Compliance', 'security-compliance', 'Tamper-resistant holographic labels, warranty labels, void tamper-proof labels', 'lucide:lock'),
      ('Retail & Branding', 'retail-branding', 'Promotional labels, jewelry tags, custom branding labels', 'lucide:tag'),
      ('Industrial Labels', 'industrial-labels', 'Specialized labels for rigorous industrial demands', 'lucide:factory'),
      ('Eco-Friendly Labels', 'eco-friendly', 'Compostable food-safe labels, recyclable packaging labels', 'lucide:leaf'),
      ('Barcode Labels', 'barcode-labels', 'Custom pre-printed barcode labels, weatherproof variants', 'lucide:barcode')`;
    console.log('Categories seeded.');
  }

  // Seed products
  const prodExists = await sql`SELECT id FROM products LIMIT 1`;
  if (prodExists.rows.length === 0) {
    // Get category IDs
    const cats = await sql`SELECT id, slug FROM categories`;
    const catMap = {};
    cats.rows.forEach(c => catMap[c.slug] = c.id);

    const products = [
      ['Lab Vial Barcodes', 'lab-vial-barcodes', 'High-precision barcodes designed for small circumference vials. Cryogenic and moisture resistant.', 'https://honestlabel.in/wp-content/uploads/2024/03/Barcode-Labels-for-Lab-Vials-3.png', true, 'barcode-labels'],
      ['Retail Garment Tags', 'retail-garment-tags', 'Premium hang tags and adhesive labels for clothing with high-quality print finish.', 'https://honestlabel.in/wp-content/uploads/2024/03/Retail-Garment-Tags-1.png', true, 'retail-branding'],
      ['Floor Marking Stickers', 'floor-marking-stickers', 'Heavy-duty, abrasion-resistant floor graphics for warehouse safety and directional signage.', 'https://honestlabel.in/wp-content/uploads/2025/02/Floor-Marking-Stickers-1.png', true, 'industrial-labels'],
      ['Void Tamper Proof Labels', 'void-tamper-proof', 'Leaves a VOID residue when removed. Essential for warranty seals and asset protection.', 'https://honestlabel.in/wp-content/uploads/2024/03/Void-Tamper-Proof-Labels-1.png', true, 'security-compliance'],
      ['Active RFID Labels', 'active-rfid-labels', 'Smart labels embedded with RFID chips for real-time inventory tracking and logistics.', 'https://honestlabel.in/wp-content/uploads/2025/02/Active-RFID-Labels-for-Tracking-3.png', true, 'specialty-labels'],
      ['Bath & Beauty Labels', 'bath-beauty-labels', 'Waterproof and oil-resistant finishes tailored for shampoos, soaps, and lotions.', 'https://honestlabel.in/wp-content/uploads/2025/02/Bath-and-Beauty-Product-Labels-3.png', true, 'retail-branding'],
      ['Cosmetic & Beauty Labels', 'cosmetic-beauty-labels', 'Premium waterproof and oil-resistant labels designed for cosmetic, skincare, and beauty products.', '/uploads/cosmetic-labels.png', true, 'retail-branding'],
      ['Bottle Neck Labels', 'bottle-neck-labels', 'Specialized seals for bottles and jars to ensure product integrity and freshness.', 'https://honestlabel.in/wp-content/uploads/2024/03/Tamper-Proof-Neck-Labels-3.png', true, 'security-compliance'],
      ['Sterilized Equipment Labels', 'sterilized-equipment-labels', 'Autoclave-safe labels that withstand high heat and sterilization processes.', 'https://honestlabel.in/wp-content/uploads/2024/03/Sterilized-Equipment-Labels-1.png', true, 'specialty-labels'],
    ];

    for (const [name, slug, desc, img, featured, catSlug] of products) {
      await sql`INSERT INTO products (name, slug, short_description, image_url, is_featured, category_id) VALUES (${name}, ${slug}, ${desc}, ${img}, ${featured}, ${catMap[catSlug]})`;
    }
    console.log('Products seeded.');
  }

  // Seed site settings
  const settExists = await sql`SELECT id FROM site_settings LIMIT 1`;
  if (settExists.rows.length === 0) {
    await sql`INSERT INTO site_settings (key, value, description) VALUES
      ('company_name', 'Honest Label', 'Company name'),
      ('company_tagline', 'Labeling Solutions That Work', 'Company tagline'),
      ('phone', '+91 95123 70018', 'Contact phone'),
      ('email', 'hello@honestit.in', 'Contact email'),
      ('address', '170/171, HonestIT - Corporate House, Besides Sanskruti Building, Near Old High-Court, Ashram Rd, Ahmedabad, Gujarat 380009', 'Office address'),
      ('business_hours', 'Monday - Saturday: 9:30 AM - 6:30 PM', 'Business hours'),
      ('facebook_url', '', 'Facebook page URL'),
      ('linkedin_url', '', 'LinkedIn page URL'),
      ('instagram_url', '', 'Instagram page URL')`;
    console.log('Site settings seeded.');
  }

  // Seed page settings
  const pageExists = await sql`SELECT id FROM page_settings LIMIT 1`;
  if (pageExists.rows.length === 0) {
    await sql`INSERT INTO page_settings (page_name, page_slug, page_title, is_published, show_in_navbar, display_order) VALUES
      ('About', 'about', 'About Us', true, true, 1),
      ('Products', 'products', 'Our Products', true, true, 2),
      ('Industries', 'industries', 'Industries We Serve', true, true, 3),
      ('Consumables', 'consumables', 'Consumables', true, true, 4),
      ('Clients', 'clients', 'Our Clients', true, true, 5),
      ('Blog', 'blog', 'Blog', true, true, 6),
      ('Contact', 'contact', 'Contact Us', true, true, 7),
      ('Get Quote', 'get-quote', 'Get a Quote', true, true, 8)`;
    console.log('Page settings seeded.');
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
