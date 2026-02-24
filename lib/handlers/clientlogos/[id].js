import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  const id = parseInt(req.query.id);

  if (req.method === 'PUT') {
    const existing = await sql`SELECT * FROM client_logos WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Client logo not found' });

    const { name, imageUrl, website, isActive, displayOrder } = req.body || {};
    const c = existing.rows[0];

    await sql`UPDATE client_logos SET
      name = ${name ?? c.name}, image_url = ${imageUrl ?? c.image_url},
      website = ${website ?? c.website}, is_active = ${isActive ?? c.is_active},
      display_order = ${displayOrder ?? c.display_order},
      updated_at = NOW() WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM client_logos WHERE id = ${id}`;
    return res.status(200).json({
      id: updated.rows[0].id, name: updated.rows[0].name,
      imageUrl: updated.rows[0].image_url, website: updated.rows[0].website,
      isActive: updated.rows[0].is_active, displayOrder: updated.rows[0].display_order,
      createdAt: updated.rows[0].created_at, updatedAt: updated.rows[0].updated_at,
    });
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM client_logos WHERE id = ${id}`;
    return res.status(200).json({ message: 'Client logo deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
