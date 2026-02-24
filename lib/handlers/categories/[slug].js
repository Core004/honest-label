import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';
import { generateSlug } from '../../slug.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  const { slug } = req.query;

  // Check if slug is a number (ID-based operations for PUT/DELETE)
  const isId = /^\d+$/.test(slug);

  if (req.method === 'GET' && !isId) {
    const result = await sql`SELECT * FROM categories WHERE slug = ${slug} AND is_active = true LIMIT 1`;
    if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    return res.status(200).json(mapCategory(result.rows[0]));
  }

  if (req.method === 'PUT' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    const id = parseInt(slug);
    const { name, description, icon, isActive } = req.body || {};

    const existing = await sql`SELECT * FROM categories WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Category not found' });

    const cat = existing.rows[0];
    const newName = name ?? cat.name;
    const newSlug = name ? generateSlug(name) : cat.slug;

    await sql`UPDATE categories SET
      name = ${newName},
      slug = ${newSlug},
      description = ${description ?? cat.description},
      icon = ${icon ?? cat.icon},
      is_active = ${isActive ?? cat.is_active},
      updated_at = NOW()
      WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM categories WHERE id = ${id}`;
    return res.status(200).json(mapCategory(updated.rows[0]));
  }

  if (req.method === 'DELETE' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    const id = parseInt(slug);

    const products = await sql`SELECT COUNT(*) as count FROM products WHERE category_id = ${id}`;
    if (parseInt(products.rows[0].count) > 0) {
      return res.status(400).json({ error: 'Cannot delete category with existing products' });
    }

    await sql`DELETE FROM categories WHERE id = ${id}`;
    return res.status(200).json({ message: 'Category deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapCategory(r) {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    icon: r.icon,
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}
