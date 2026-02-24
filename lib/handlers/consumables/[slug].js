import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';
import { generateSlug } from '../../slug.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  const { slug } = req.query;
  const isId = /^\d+$/.test(slug);

  if (req.method === 'GET' && !isId) {
    const result = await sql`SELECT * FROM consumables WHERE slug = ${slug} AND is_active = true LIMIT 1`;
    if (result.rows.length === 0) return res.status(404).json({ error: 'Consumable not found' });
    return res.status(200).json(mapConsumable(result.rows[0]));
  }

  if (req.method === 'PUT' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    const id = parseInt(slug);
    const { name, description, imageUrl, icon, features, isActive, displayOrder } = req.body || {};

    const existing = await sql`SELECT * FROM consumables WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Consumable not found' });

    const c = existing.rows[0];
    const newSlug = name ? generateSlug(name) : c.slug;

    await sql`UPDATE consumables SET
      name = ${name ?? c.name}, slug = ${newSlug},
      description = ${description ?? c.description},
      image_url = ${imageUrl ?? c.image_url},
      icon = ${icon ?? c.icon}, features = ${features ?? c.features},
      is_active = ${isActive ?? c.is_active},
      display_order = ${displayOrder ?? c.display_order},
      updated_at = NOW() WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM consumables WHERE id = ${id}`;
    return res.status(200).json(mapConsumable(updated.rows[0]));
  }

  if (req.method === 'DELETE' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    await sql`DELETE FROM consumables WHERE id = ${parseInt(slug)}`;
    return res.status(200).json({ message: 'Consumable deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapConsumable(r) {
  return {
    id: r.id, name: r.name, slug: r.slug, description: r.description,
    imageUrl: r.image_url, icon: r.icon, features: r.features,
    isActive: r.is_active, displayOrder: r.display_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
