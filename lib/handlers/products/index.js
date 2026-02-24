import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';
import { generateSlug } from '../../slug.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    const { category, search, featured } = req.query;

    let query = `SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true`;
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND c.slug = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
    }
    if (featured === 'true') {
      query += ` AND p.is_featured = true`;
    }

    query += ` ORDER BY p.display_order, p.name`;

    const result = await sql.query(query, params);
    return res.status(200).json(result.rows.map(mapProduct));
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { name, description, shortDescription, imageUrl, features, isFeatured, categoryId, displayOrder } = req.body || {};
    if (!name || !categoryId) return res.status(400).json({ error: 'Name and categoryId are required' });

    const slug = generateSlug(name);
    const result = await sql`
      INSERT INTO products (name, slug, description, short_description, image_url, features, is_featured, category_id, display_order)
      VALUES (${name}, ${slug}, ${description || null}, ${shortDescription || null}, ${imageUrl || null}, ${features || null}, ${isFeatured || false}, ${categoryId}, ${displayOrder || 0})
      RETURNING *`;

    const full = await sql`SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ${result.rows[0].id}`;
    return res.status(201).json(mapProduct(full.rows[0]));
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapProduct(r) {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    shortDescription: r.short_description,
    imageUrl: r.image_url,
    features: r.features,
    isActive: r.is_active,
    isFeatured: r.is_featured,
    displayOrder: r.display_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    categoryId: r.category_id,
    categoryName: r.category_name,
    categorySlug: r.category_slug,
  };
}
