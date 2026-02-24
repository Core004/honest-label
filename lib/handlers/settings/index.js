import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM site_settings`;
    const settings = {};
    result.rows.forEach(r => { settings[r.key] = r.value; });
    return res.status(200).json(settings);
  }

  if (req.method === 'PUT') {
    const user = requireAuth(req, res);
    if (!user) return;

    const body = req.body || {};
    for (const [key, value] of Object.entries(body)) {
      const existing = await sql`SELECT id FROM site_settings WHERE key = ${key} LIMIT 1`;
      if (existing.rows.length > 0) {
        await sql`UPDATE site_settings SET value = ${value}, updated_at = NOW() WHERE key = ${key}`;
      } else {
        await sql`INSERT INTO site_settings (key, value) VALUES (${key}, ${value})`;
      }
    }

    const result = await sql`SELECT * FROM site_settings`;
    const settings = {};
    result.rows.forEach(r => { settings[r.key] = r.value; });
    return res.status(200).json(settings);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
