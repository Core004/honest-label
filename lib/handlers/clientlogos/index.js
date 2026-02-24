import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM client_logos WHERE is_active = true ORDER BY display_order, name`;
    return res.status(200).json(result.rows.map(mapLogo));
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { name, imageUrl, website, displayOrder } = req.body || {};
    if (!name || !imageUrl) return res.status(400).json({ error: 'Name and imageUrl are required' });

    const result = await sql`
      INSERT INTO client_logos (name, image_url, website, display_order)
      VALUES (${name}, ${imageUrl}, ${website || null}, ${displayOrder || 0})
      RETURNING *`;

    return res.status(201).json(mapLogo(result.rows[0]));
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapLogo(r) {
  return {
    id: r.id, name: r.name, imageUrl: r.image_url, website: r.website,
    isActive: r.is_active, displayOrder: r.display_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
