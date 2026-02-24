import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    // Public: return published pages for navbar
    const result = await sql`SELECT * FROM page_settings WHERE is_published = true AND show_in_navbar = true ORDER BY display_order`;
    return res.status(200).json(result.rows.map(mapPage));
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { pageName, pageSlug, pageTitle, isPublished, showInNavbar, displayOrder } = req.body || {};
    if (!pageName || !pageSlug || !pageTitle) {
      return res.status(400).json({ error: 'pageName, pageSlug, and pageTitle are required' });
    }

    const result = await sql`
      INSERT INTO page_settings (page_name, page_slug, page_title, is_published, show_in_navbar, display_order)
      VALUES (${pageName}, ${pageSlug}, ${pageTitle}, ${isPublished ?? true}, ${showInNavbar ?? true}, ${displayOrder || 0})
      RETURNING *`;

    return res.status(201).json(mapPage(result.rows[0]));
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
