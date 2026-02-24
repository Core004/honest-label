import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM home_contents ORDER BY section, key`;
    return res.status(200).json(result.rows.map(mapContent));
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { section, key, value, imageUrl } = req.body || {};
    if (!section || !key) return res.status(400).json({ error: 'Section and key are required' });

    const result = await sql`
      INSERT INTO home_contents (section, key, value, image_url)
      VALUES (${section}, ${key}, ${value || null}, ${imageUrl || null})
      RETURNING *`;

    return res.status(201).json(mapContent(result.rows[0]));
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapContent(r) {
  return {
    id: r.id, section: r.section, key: r.key,
    value: r.value, imageUrl: r.image_url, updatedAt: r.updated_at,
  };
}
