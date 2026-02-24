import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';
import { generateSlug } from '../../slug.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  const { slug } = req.query;
  const isId = /^\d+$/.test(slug);

  if (req.method === 'GET' && !isId) {
    const result = await sql`SELECT * FROM industries WHERE slug = ${slug} AND is_active = true LIMIT 1`;
    if (result.rows.length === 0) return res.status(404).json({ error: 'Industry not found' });
    return res.status(200).json(mapIndustry(result.rows[0]));
  }

  if (req.method === 'PUT' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    const id = parseInt(slug);
    const { name, description, imageUrl, icon, features, isActive, displayOrder } = req.body || {};

    const existing = await sql`SELECT * FROM industries WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Industry not found' });

    const i = existing.rows[0];
    const newSlug = name ? generateSlug(name) : i.slug;

    await sql`UPDATE industries SET
      name = ${name ?? i.name}, slug = ${newSlug},
      description = ${description ?? i.description},
      image_url = ${imageUrl ?? i.image_url},
      icon = ${icon ?? i.icon}, features = ${features ?? i.features},
      is_active = ${isActive ?? i.is_active},
      display_order = ${displayOrder ?? i.display_order},
      updated_at = NOW() WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM industries WHERE id = ${id}`;
    return res.status(200).json(mapIndustry(updated.rows[0]));
  }

  if (req.method === 'DELETE' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    await sql`DELETE FROM industries WHERE id = ${parseInt(slug)}`;
    return res.status(200).json({ message: 'Industry deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapIndustry(r) {
  return {
    id: r.id, name: r.name, slug: r.slug, description: r.description,
    imageUrl: r.image_url, icon: r.icon, features: r.features,
    isActive: r.is_active, displayOrder: r.display_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
