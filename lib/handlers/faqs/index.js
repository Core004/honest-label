import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM faqs WHERE is_active = true ORDER BY display_order, id`;
    return res.status(200).json(result.rows.map(mapFaq));
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { question, answer, category, displayOrder } = req.body || {};
    if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required' });

    const result = await sql`
      INSERT INTO faqs (question, answer, category, display_order)
      VALUES (${question}, ${answer}, ${category || null}, ${displayOrder || 0})
      RETURNING *`;

    return res.status(201).json(mapFaq(result.rows[0]));
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapFaq(r) {
  return {
    id: r.id, question: r.question, answer: r.answer, category: r.category,
    isActive: r.is_active, displayOrder: r.display_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
