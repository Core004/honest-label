import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req, res);
  if (!user) return;

  const result = await sql`SELECT * FROM page_settings ORDER BY display_order`;
  return res.status(200).json(result.rows.map(r => ({
    id: r.id, pageName: r.page_name, pageSlug: r.page_slug,
    pageTitle: r.page_title, isPublished: r.is_published,
    showInNavbar: r.show_in_navbar, displayOrder: r.display_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  })));
}
