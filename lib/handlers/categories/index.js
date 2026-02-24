import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';
import { generateSlug } from '../../slug.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM categories WHERE is_active = true ORDER BY name`;
    return res.status(200).json(result.rows.map(mapCategory));
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { name, description, icon } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const slug = generateSlug(name);
    const result = await sql`
      INSERT INTO categories (name, slug, description, icon)
      VALUES (${name}, ${slug}, ${description || null}, ${icon || null})
      RETURNING *`;

    return res.status(201).json(mapCategory(result.rows[0]));
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
