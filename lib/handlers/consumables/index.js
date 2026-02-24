import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';
import { generateSlug } from '../../slug.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM consumables WHERE is_active = true ORDER BY display_order, name`;
    return res.status(200).json(result.rows.map(mapConsumable));
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { name, description, imageUrl, icon, features } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const slug = generateSlug(name);
    const result = await sql`
      INSERT INTO consumables (name, slug, description, image_url, icon, features)
      VALUES (${name}, ${slug}, ${description || null}, ${imageUrl || null}, ${icon || null}, ${features || null})
      RETURNING *`;

    return res.status(201).json(mapConsumable(result.rows[0]));
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
