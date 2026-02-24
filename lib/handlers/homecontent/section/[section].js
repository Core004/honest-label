import { sql } from '@vercel/postgres';
import { handleCors, setCacheHeaders } from '../../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { section } = req.query;
  const result = await sql`SELECT * FROM home_contents WHERE section = ${section} ORDER BY key`;

  return res.status(200).json(result.rows.map(r => ({
    id: r.id, section: r.section, key: r.key,
    value: r.value, imageUrl: r.image_url, updatedAt: r.updated_at,
  })));
}
