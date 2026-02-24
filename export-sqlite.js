/**
 * SQLite to Postgres Export Script
 *
 * Usage:
 *   1. Install better-sqlite3: npm install better-sqlite3
 *   2. Run: node export-sqlite.js > import.sql
 *   3. Run the generated SQL against your Vercel Postgres database
 *
 * Or pipe directly:
 *   node export-sqlite.js | psql $POSTGRES_URL
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';

const DB_PATH = './backend/honestlabel.db';

function escapeStr(val) {
  if (val === null || val === undefined) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function boolVal(val) {
  if (val === null || val === undefined) return 'NULL';
  return val ? 'true' : 'false';
}

function tsVal(val) {
  if (!val) return 'NULL';
  return escapeStr(val);
}

function intVal(val) {
  if (val === null || val === undefined) return 'NULL';
  return String(parseInt(val));
}

try {
  const db = new Database(DB_PATH, { readonly: true });

  console.log('-- Honest Label SQLite -> Postgres Export');
  console.log('-- Generated: ' + new Date().toISOString());
  console.log('');

  // Export Categories
  const categories = db.prepare('SELECT * FROM Categories').all();
  console.log('-- Categories');
  for (const c of categories) {
    console.log(`INSERT INTO categories (id, name, slug, description, icon, is_active, created_at, updated_at) VALUES (${c.Id}, ${escapeStr(c.Name)}, ${escapeStr(c.Slug)}, ${escapeStr(c.Description)}, ${escapeStr(c.Icon)}, ${boolVal(c.IsActive)}, ${tsVal(c.CreatedAt)}, ${tsVal(c.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id),0) FROM categories));`);
  console.log('');

  // Export Products
  const products = db.prepare('SELECT * FROM Products').all();
  console.log('-- Products');
  for (const p of products) {
    console.log(`INSERT INTO products (id, name, slug, description, short_description, image_url, features, is_active, is_featured, display_order, created_at, updated_at, category_id) VALUES (${p.Id}, ${escapeStr(p.Name)}, ${escapeStr(p.Slug)}, ${escapeStr(p.Description)}, ${escapeStr(p.ShortDescription)}, ${escapeStr(p.ImageUrl)}, ${escapeStr(p.Features)}, ${boolVal(p.IsActive)}, ${boolVal(p.IsFeatured)}, ${intVal(p.DisplayOrder)}, ${tsVal(p.CreatedAt)}, ${tsVal(p.UpdatedAt)}, ${p.CategoryId}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id),0) FROM products));`);
  console.log('');

  // Export BlogPosts
  const blogs = db.prepare('SELECT * FROM BlogPosts').all();
  console.log('-- Blog Posts');
  for (const b of blogs) {
    console.log(`INSERT INTO blog_posts (id, title, slug, excerpt, content, image_url, author, is_published, published_at, created_at, updated_at) VALUES (${b.Id}, ${escapeStr(b.Title)}, ${escapeStr(b.Slug)}, ${escapeStr(b.Excerpt)}, ${escapeStr(b.Content)}, ${escapeStr(b.ImageUrl)}, ${escapeStr(b.Author)}, ${boolVal(b.IsPublished)}, ${tsVal(b.PublishedAt)}, ${tsVal(b.CreatedAt)}, ${tsVal(b.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('blog_posts_id_seq', (SELECT COALESCE(MAX(id),0) FROM blog_posts));`);
  console.log('');

  // Export AdminUsers
  const admins = db.prepare('SELECT * FROM AdminUsers').all();
  console.log('-- Admin Users');
  for (const a of admins) {
    console.log(`INSERT INTO admin_users (id, email, password_hash, name, role, is_active, created_at, last_login_at) VALUES (${a.Id}, ${escapeStr(a.Email)}, ${escapeStr(a.PasswordHash)}, ${escapeStr(a.Name)}, ${escapeStr(a.Role)}, ${boolVal(a.IsActive)}, ${tsVal(a.CreatedAt)}, ${tsVal(a.LastLoginAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('admin_users_id_seq', (SELECT COALESCE(MAX(id),0) FROM admin_users));`);
  console.log('');

  // Export Inquiries
  const inquiries = db.prepare('SELECT * FROM Inquiries').all();
  console.log('-- Inquiries');
  for (const i of inquiries) {
    console.log(`INSERT INTO inquiries (id, name, email, company, phone, label_type, message, status, admin_notes, created_at, updated_at) VALUES (${i.Id}, ${escapeStr(i.Name)}, ${escapeStr(i.Email)}, ${escapeStr(i.Company)}, ${escapeStr(i.Phone)}, ${escapeStr(i.LabelType)}, ${escapeStr(i.Message)}, ${intVal(i.Status)}, ${escapeStr(i.AdminNotes)}, ${tsVal(i.CreatedAt)}, ${tsVal(i.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('inquiries_id_seq', (SELECT COALESCE(MAX(id),0) FROM inquiries));`);
  console.log('');

  // Export QuoteRequests
  const quotes = db.prepare('SELECT * FROM QuoteRequests').all();
  console.log('-- Quote Requests');
  for (const q of quotes) {
    console.log(`INSERT INTO quote_requests (id, name, email, company, phone, product_type, size, quantity, material, print_type, additional_details, status, admin_notes, created_at, updated_at) VALUES (${q.Id}, ${escapeStr(q.Name)}, ${escapeStr(q.Email)}, ${escapeStr(q.Company)}, ${escapeStr(q.Phone)}, ${escapeStr(q.ProductType)}, ${escapeStr(q.Size)}, ${escapeStr(q.Quantity)}, ${escapeStr(q.Material)}, ${escapeStr(q.PrintType)}, ${escapeStr(q.AdditionalDetails)}, ${intVal(q.Status)}, ${escapeStr(q.AdminNotes)}, ${tsVal(q.CreatedAt)}, ${tsVal(q.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('quote_requests_id_seq', (SELECT COALESCE(MAX(id),0) FROM quote_requests));`);
  console.log('');

  // Export SiteSettings
  const settings = db.prepare('SELECT * FROM SiteSettings').all();
  console.log('-- Site Settings');
  for (const s of settings) {
    console.log(`INSERT INTO site_settings (id, key, value, description, updated_at) VALUES (${s.Id}, ${escapeStr(s.Key)}, ${escapeStr(s.Value)}, ${escapeStr(s.Description)}, ${tsVal(s.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('site_settings_id_seq', (SELECT COALESCE(MAX(id),0) FROM site_settings));`);
  console.log('');

  // Export ClientLogos
  const logos = db.prepare('SELECT * FROM ClientLogos').all();
  console.log('-- Client Logos');
  for (const l of logos) {
    console.log(`INSERT INTO client_logos (id, name, image_url, website, is_active, display_order, created_at, updated_at) VALUES (${l.Id}, ${escapeStr(l.Name)}, ${escapeStr(l.ImageUrl)}, ${escapeStr(l.Website)}, ${boolVal(l.IsActive)}, ${intVal(l.DisplayOrder)}, ${tsVal(l.CreatedAt)}, ${tsVal(l.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('client_logos_id_seq', (SELECT COALESCE(MAX(id),0) FROM client_logos));`);
  console.log('');

  // Export Industries
  const industries = db.prepare('SELECT * FROM Industries').all();
  console.log('-- Industries');
  for (const i of industries) {
    console.log(`INSERT INTO industries (id, name, slug, description, image_url, icon, features, is_active, display_order, created_at, updated_at) VALUES (${i.Id}, ${escapeStr(i.Name)}, ${escapeStr(i.Slug)}, ${escapeStr(i.Description)}, ${escapeStr(i.ImageUrl)}, ${escapeStr(i.Icon)}, ${escapeStr(i.Features)}, ${boolVal(i.IsActive)}, ${intVal(i.DisplayOrder)}, ${tsVal(i.CreatedAt)}, ${tsVal(i.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('industries_id_seq', (SELECT COALESCE(MAX(id),0) FROM industries));`);
  console.log('');

  // Export Consumables
  const consumables = db.prepare('SELECT * FROM Consumables').all();
  console.log('-- Consumables');
  for (const c of consumables) {
    console.log(`INSERT INTO consumables (id, name, slug, description, image_url, icon, features, is_active, display_order, created_at, updated_at) VALUES (${c.Id}, ${escapeStr(c.Name)}, ${escapeStr(c.Slug)}, ${escapeStr(c.Description)}, ${escapeStr(c.ImageUrl)}, ${escapeStr(c.Icon)}, ${escapeStr(c.Features)}, ${boolVal(c.IsActive)}, ${intVal(c.DisplayOrder)}, ${tsVal(c.CreatedAt)}, ${tsVal(c.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('consumables_id_seq', (SELECT COALESCE(MAX(id),0) FROM consumables));`);
  console.log('');

  // Export FAQs
  const faqs = db.prepare('SELECT * FROM FAQs').all();
  console.log('-- FAQs');
  for (const f of faqs) {
    console.log(`INSERT INTO faqs (id, question, answer, category, is_active, display_order, created_at, updated_at) VALUES (${f.Id}, ${escapeStr(f.Question)}, ${escapeStr(f.Answer)}, ${escapeStr(f.Category)}, ${boolVal(f.IsActive)}, ${intVal(f.DisplayOrder)}, ${tsVal(f.CreatedAt)}, ${tsVal(f.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('faqs_id_seq', (SELECT COALESCE(MAX(id),0) FROM faqs));`);
  console.log('');

  // Export TeamMembers
  const members = db.prepare('SELECT * FROM TeamMembers').all();
  console.log('-- Team Members');
  for (const t of members) {
    console.log(`INSERT INTO team_members (id, name, position, bio, image_url, email, phone, linkedin, is_active, display_order, created_at, updated_at) VALUES (${t.Id}, ${escapeStr(t.Name)}, ${escapeStr(t.Position)}, ${escapeStr(t.Bio)}, ${escapeStr(t.ImageUrl)}, ${escapeStr(t.Email)}, ${escapeStr(t.Phone)}, ${escapeStr(t.LinkedIn)}, ${boolVal(t.IsActive)}, ${intVal(t.DisplayOrder)}, ${tsVal(t.CreatedAt)}, ${tsVal(t.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('team_members_id_seq', (SELECT COALESCE(MAX(id),0) FROM team_members));`);
  console.log('');

  // Export Testimonials
  const testimonials = db.prepare('SELECT * FROM Testimonials').all();
  console.log('-- Testimonials');
  for (const t of testimonials) {
    console.log(`INSERT INTO testimonials (id, client_name, company, content, image_url, rating, is_active, display_order, created_at, updated_at) VALUES (${t.Id}, ${escapeStr(t.ClientName)}, ${escapeStr(t.Company)}, ${escapeStr(t.Content)}, ${escapeStr(t.ImageUrl)}, ${intVal(t.Rating)}, ${boolVal(t.IsActive)}, ${intVal(t.DisplayOrder)}, ${tsVal(t.CreatedAt)}, ${tsVal(t.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('testimonials_id_seq', (SELECT COALESCE(MAX(id),0) FROM testimonials));`);
  console.log('');

  // Export HomeContents
  const homeContents = db.prepare('SELECT * FROM HomeContents').all();
  console.log('-- Home Contents');
  for (const h of homeContents) {
    console.log(`INSERT INTO home_contents (id, section, key, value, image_url, updated_at) VALUES (${h.Id}, ${escapeStr(h.Section)}, ${escapeStr(h.Key)}, ${escapeStr(h.Value)}, ${escapeStr(h.ImageUrl)}, ${tsVal(h.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('home_contents_id_seq', (SELECT COALESCE(MAX(id),0) FROM home_contents));`);
  console.log('');

  // Export PageSettings
  const pages = db.prepare('SELECT * FROM PageSettings').all();
  console.log('-- Page Settings');
  for (const p of pages) {
    console.log(`INSERT INTO page_settings (id, page_name, page_slug, page_title, is_published, show_in_navbar, display_order, created_at, updated_at) VALUES (${p.Id}, ${escapeStr(p.PageName)}, ${escapeStr(p.PageSlug)}, ${escapeStr(p.PageTitle)}, ${boolVal(p.IsPublished)}, ${boolVal(p.ShowInNavbar)}, ${intVal(p.DisplayOrder)}, ${tsVal(p.CreatedAt)}, ${tsVal(p.UpdatedAt)}) ON CONFLICT (id) DO NOTHING;`);
  }
  console.log(`SELECT setval('page_settings_id_seq', (SELECT COALESCE(MAX(id),0) FROM page_settings));`);
  console.log('');

  console.log('-- Export complete!');
  db.close();
} catch (err) {
  console.error('Error:', err.message);
  console.error('Make sure better-sqlite3 is installed: npm install better-sqlite3');
  process.exit(1);
}
