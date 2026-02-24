import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const { slug } = req.query;
  const isId = /^\d+$/.test(slug);

  if (req.method === 'GET' && !isId) {
    const result = await sql`SELECT * FROM page_settings WHERE page_slug = ${slug} LIMIT 1`;
    if (result.rows.length === 0) return res.status(404).json({ error: 'Page not found' });
    return res.status(200).json(mapPage(result.rows[0]));
  }

  if (req.method === 'PUT' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    const id = parseInt(slug);

    const existing = await sql`SELECT * FROM page_settings WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Page setting not found' });

    const { pageName, pageSlug, pageTitle, isPublished, showInNavbar, displayOrder } = req.body || {};
    const p = existing.rows[0];

    await sql`UPDATE page_settings SET
      page_name = ${pageName ?? p.page_name},
      page_slug = ${pageSlug ?? p.page_slug},
      page_title = ${pageTitle ?? p.page_title},
      is_published = ${isPublished ?? p.is_published},
      show_in_navbar = ${showInNavbar ?? p.show_in_navbar},
      display_order = ${displayOrder ?? p.display_order},
      updated_at = NOW() WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM page_settings WHERE id = ${id}`;
    return res.status(200).json(mapPage(updated.rows[0]));
  }

  if (req.method === 'DELETE' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    await sql`DELETE FROM page_settings WHERE id = ${parseInt(slug)}`;
    return res.status(200).json({ message: 'Page setting deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapPage(r) {
  return {
    id: r.id, pageName: r.page_name, pageSlug: r.page_slug,
    pageTitle: r.page_title, isPublished: r.is_published,
    showInNavbar: r.show_in_navbar, displayOrder: r.display_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
