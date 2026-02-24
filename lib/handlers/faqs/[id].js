import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  const id = parseInt(req.query.id);

  if (req.method === 'PUT') {
    const existing = await sql`SELECT * FROM faqs WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'FAQ not found' });

    const { question, answer, category, isActive, displayOrder } = req.body || {};
    const f = existing.rows[0];

    await sql`UPDATE faqs SET
      question = ${question ?? f.question}, answer = ${answer ?? f.answer},
      category = ${category ?? f.category}, is_active = ${isActive ?? f.is_active},
      display_order = ${displayOrder ?? f.display_order},
      updated_at = NOW() WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM faqs WHERE id = ${id}`;
    return res.status(200).json(mapFaq(updated.rows[0]));
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM faqs WHERE id = ${id}`;
    return res.status(200).json({ message: 'FAQ deleted' });
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
