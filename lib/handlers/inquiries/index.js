import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';
import { sendInquiryNotification, sendInquiryConfirmation } from '../../email.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { status, page = '1', pageSize = '20' } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    let result;
    if (status !== undefined && status !== '') {
      result = await sql.query(
        `SELECT * FROM inquiries WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [parseInt(status), limit, offset]
      );
    } else {
      result = await sql.query(
        `SELECT * FROM inquiries ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
    }

    return res.status(200).json(result.rows.map(mapInquiry));
  }

  if (req.method === 'POST') {
    const { name, email, company, phone, labelType, message } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    const result = await sql`
      INSERT INTO inquiries (name, email, company, phone, label_type, message)
      VALUES (${name}, ${email}, ${company || null}, ${phone || null}, ${labelType || null}, ${message || null})
      RETURNING *`;

    // Send emails (non-blocking)
    try {
      await Promise.all([
        sendInquiryNotification(name, email, message || ''),
        sendInquiryConfirmation(email, name),
      ]);
    } catch (e) {
      console.error('Email error:', e);
    }

    return res.status(201).json(mapInquiry(result.rows[0]));
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
