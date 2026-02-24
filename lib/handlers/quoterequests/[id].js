import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  const id = parseInt(req.query.id);

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM quote_requests WHERE id = ${id} LIMIT 1`;
    if (result.rows.length === 0) return res.status(404).json({ error: 'Quote request not found' });
    return res.status(200).json(mapQuoteRequest(result.rows[0]));
  }

  if (req.method === 'PUT') {
    const existing = await sql`SELECT * FROM quote_requests WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Quote request not found' });

    const { status, adminNotes } = req.body || {};
    const q = existing.rows[0];

    await sql`UPDATE quote_requests SET
      status = ${status ?? q.status},
      admin_notes = ${adminNotes ?? q.admin_notes},
      updated_at = NOW() WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM quote_requests WHERE id = ${id}`;
    return res.status(200).json(mapQuoteRequest(updated.rows[0]));
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM quote_requests WHERE id = ${id}`;
    return res.status(200).json({ message: 'Quote request deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapQuoteRequest(r) {
  return {
    id: r.id, name: r.name, email: r.email, company: r.company,
    phone: r.phone, productType: r.product_type, size: r.size,
    quantity: r.quantity, material: r.material, printType: r.print_type,
    additionalDetails: r.additional_details, status: r.status,
    adminNotes: r.admin_notes, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
