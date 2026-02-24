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
        `SELECT * FROM quote_requests WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [parseInt(status), limit, offset]
      );
    } else {
      result = await sql.query(
        `SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
    }

    return res.status(200).json(result.rows.map(mapQuoteRequest));
  }

  if (req.method === 'POST') {
    const { name, email, company, phone, productType, size, quantity, material, printType, additionalDetails } = req.body || {};
    if (!name || !email || !productType) {
      return res.status(400).json({ error: 'Name, email, and productType are required' });
    }

    const result = await sql`
      INSERT INTO quote_requests (name, email, company, phone, product_type, size, quantity, material, print_type, additional_details)
      VALUES (${name}, ${email}, ${company || null}, ${phone || null}, ${productType}, ${size || null}, ${quantity || null}, ${material || null}, ${printType || null}, ${additionalDetails || null})
      RETURNING *`;

    try {
      await Promise.all([
        sendInquiryNotification(name, email, `Product: ${productType}, Size: ${size || 'N/A'}, Qty: ${quantity || 'N/A'}`),
        sendInquiryConfirmation(email, name),
      ]);
    } catch (e) {
      console.error('Email error:', e);
    }

    return res.status(201).json(mapQuoteRequest(result.rows[0]));
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
