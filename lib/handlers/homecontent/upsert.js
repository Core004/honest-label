import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req, res);
  if (!user) return;

  const { section, key, value, imageUrl } = req.body || {};
  if (!section || !key) return res.status(400).json({ error: 'Section and key are required' });

  const existing = await sql`SELECT * FROM home_contents WHERE section = ${section} AND key = ${key} LIMIT 1`;

  if (existing.rows.length > 0) {
    await sql`UPDATE home_contents SET
      value = ${value ?? existing.rows[0].value},
      image_url = ${imageUrl ?? existing.rows[0].image_url},
      updated_at = NOW()
      WHERE section = ${section} AND key = ${key}`;
  } else {
    await sql`INSERT INTO home_contents (section, key, value, image_url) VALUES (${section}, ${key}, ${value || null}, ${imageUrl || null})`;
  }

  const result = await sql`SELECT * FROM home_contents WHERE section = ${section} AND key = ${key}`;
  const r = result.rows[0];
  return res.status(200).json({
    id: r.id, section: r.section, key: r.key,
    value: r.value, imageUrl: r.image_url, updatedAt: r.updated_at,
  });
}
