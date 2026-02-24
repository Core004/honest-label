import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  const id = parseInt(req.query.id);

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM inquiries WHERE id = ${id} LIMIT 1`;
    if (result.rows.length === 0) return res.status(404).json({ error: 'Inquiry not found' });
    return res.status(200).json(mapInquiry(result.rows[0]));
  }

  if (req.method === 'PUT') {
    const existing = await sql`SELECT * FROM inquiries WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Inquiry not found' });

    const { status, adminNotes } = req.body || {};
    const i = existing.rows[0];

    await sql`UPDATE inquiries SET
      status = ${status ?? i.status},
      admin_notes = ${adminNotes ?? i.admin_notes},
      updated_at = NOW() WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM inquiries WHERE id = ${id}`;
    return res.status(200).json(mapInquiry(updated.rows[0]));
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM inquiries WHERE id = ${id}`;
    return res.status(200).json({ message: 'Inquiry deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapInquiry(r) {
  return {
    id: r.id, name: r.name, email: r.email, company: r.company,
    phone: r.phone, labelType: r.label_type, message: r.message,
    status: r.status, adminNotes: r.admin_notes,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
