import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req, res);
  if (!user) return;

  const id = parseInt(req.query.id);
  const existing = await sql`SELECT * FROM page_settings WHERE id = ${id} LIMIT 1`;
  if (existing.rows.length === 0) return res.status(404).json({ error: 'Page setting not found' });

  const newPublished = !existing.rows[0].is_published;
  await sql`UPDATE page_settings SET is_published = ${newPublished}, updated_at = NOW() WHERE id = ${id}`;

  const updated = await sql`SELECT * FROM page_settings WHERE id = ${id}`;
  const r = updated.rows[0];
  return res.status(200).json({
    id: r.id, pageName: r.page_name, pageSlug: r.page_slug,
    pageTitle: r.page_title, isPublished: r.is_published,
    showInNavbar: r.show_in_navbar, displayOrder: r.display_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  });
}
