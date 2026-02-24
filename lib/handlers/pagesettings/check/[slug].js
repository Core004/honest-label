import { sql } from '@vercel/postgres';
import { handleCors, setCacheHeaders } from '../../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.query;
  const result = await sql`SELECT is_published FROM page_settings WHERE page_slug = ${slug} LIMIT 1`;

  if (result.rows.length === 0) return res.status(200).json(false);
  return res.status(200).json(result.rows[0].is_published);
}
