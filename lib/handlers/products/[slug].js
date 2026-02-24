import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';
import { generateSlug } from '../../slug.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  const { slug } = req.query;
  const isId = /^\d+$/.test(slug);

  if (req.method === 'GET' && !isId) {
    const result = await sql`SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ${slug} AND p.is_active = true LIMIT 1`;
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json(mapProduct(result.rows[0]));
  }

  if (req.method === 'PUT' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    const id = parseInt(slug);
    const { name, description, shortDescription, imageUrl, features, isFeatured, isActive, categoryId, displayOrder } = req.body || {};

    const existing = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const p = existing.rows[0];
    const newSlug = name ? generateSlug(name) : p.slug;

    await sql`UPDATE products SET
      name = ${name ?? p.name},
      slug = ${newSlug},
      description = ${description ?? p.description},
      short_description = ${shortDescription ?? p.short_description},
      image_url = ${imageUrl ?? p.image_url},
      features = ${features ?? p.features},
      is_featured = ${isFeatured ?? p.is_featured},
      is_active = ${isActive ?? p.is_active},
      category_id = ${categoryId ?? p.category_id},
      display_order = ${displayOrder ?? p.display_order},
      updated_at = NOW()
      WHERE id = ${id}`;

    const updated = await sql`SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ${id}`;
    return res.status(200).json(mapProduct(updated.rows[0]));
  }

  if (req.method === 'DELETE' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    await sql`DELETE FROM products WHERE id = ${parseInt(slug)}`;
    return res.status(200).json({ message: 'Product deleted' });
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
