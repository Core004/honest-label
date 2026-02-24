import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  const id = parseInt(req.query.id);

  if (req.method === 'PUT') {
    const existing = await sql`SELECT * FROM testimonials WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Testimonial not found' });

    const { clientName, company, content, imageUrl, rating, isActive, displayOrder } = req.body || {};
    const t = existing.rows[0];

    await sql`UPDATE testimonials SET
      client_name = ${clientName ?? t.client_name}, company = ${company ?? t.company},
      content = ${content ?? t.content}, image_url = ${imageUrl ?? t.image_url},
      rating = ${rating ?? t.rating}, is_active = ${isActive ?? t.is_active},
      display_order = ${displayOrder ?? t.display_order},
      updated_at = NOW() WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM testimonials WHERE id = ${id}`;
    const r = updated.rows[0];
    return res.status(200).json({
      id: r.id, clientName: r.client_name, company: r.company, content: r.content,
      imageUrl: r.image_url, rating: r.rating, isActive: r.is_active,
      displayOrder: r.display_order, createdAt: r.created_at, updatedAt: r.updated_at,
    });
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM testimonials WHERE id = ${id}`;
    return res.status(200).json({ message: 'Testimonial deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
