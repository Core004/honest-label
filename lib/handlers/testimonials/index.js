import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM testimonials WHERE is_active = true ORDER BY display_order, id`;
    return res.status(200).json(result.rows.map(mapTestimonial));
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { clientName, company, content, imageUrl, rating, displayOrder } = req.body || {};
    if (!clientName || !company || !content) {
      return res.status(400).json({ error: 'clientName, company, and content are required' });
    }

    const result = await sql`
      INSERT INTO testimonials (client_name, company, content, image_url, rating, display_order)
      VALUES (${clientName}, ${company}, ${content}, ${imageUrl || null}, ${rating || 5}, ${displayOrder || 0})
      RETURNING *`;

    return res.status(201).json(mapTestimonial(result.rows[0]));
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapTestimonial(r) {
  return {
    id: r.id, clientName: r.client_name, company: r.company, content: r.content,
    imageUrl: r.image_url, rating: r.rating, isActive: r.is_active,
    displayOrder: r.display_order, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
