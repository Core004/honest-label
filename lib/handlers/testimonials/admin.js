import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req, res);
  if (!user) return;

  const result = await sql`SELECT * FROM testimonials ORDER BY display_order, id`;
  return res.status(200).json(result.rows.map(r => ({
    id: r.id, clientName: r.client_name, company: r.company, content: r.content,
    imageUrl: r.image_url, rating: r.rating, isActive: r.is_active,
    displayOrder: r.display_order, createdAt: r.created_at, updatedAt: r.updated_at,
  })));
}
