import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  const id = parseInt(req.query.id);

  if (req.method === 'PUT') {
    const existing = await sql`SELECT * FROM home_contents WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Home content not found' });

    const { section, key, value, imageUrl } = req.body || {};
    const h = existing.rows[0];

    await sql`UPDATE home_contents SET
      section = ${section ?? h.section}, key = ${key ?? h.key},
      value = ${value ?? h.value}, image_url = ${imageUrl ?? h.image_url},
      updated_at = NOW() WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM home_contents WHERE id = ${id}`;
    const r = updated.rows[0];
    return res.status(200).json({
      id: r.id, section: r.section, key: r.key,
      value: r.value, imageUrl: r.image_url, updatedAt: r.updated_at,
    });
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM home_contents WHERE id = ${id}`;
    return res.status(200).json({ message: 'Home content deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
