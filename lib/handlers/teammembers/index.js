import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM team_members WHERE is_active = true ORDER BY display_order, name`;
    return res.status(200).json(result.rows.map(mapMember));
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { name, position, bio, imageUrl, email, phone, linkedin, displayOrder } = req.body || {};
    if (!name || !position) return res.status(400).json({ error: 'Name and position are required' });

    const result = await sql`
      INSERT INTO team_members (name, position, bio, image_url, email, phone, linkedin, display_order)
      VALUES (${name}, ${position}, ${bio || null}, ${imageUrl || null}, ${email || null}, ${phone || null}, ${linkedin || null}, ${displayOrder || 0})
      RETURNING *`;

    return res.status(201).json(mapMember(result.rows[0]));
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapMember(r) {
  return {
    id: r.id, name: r.name, position: r.position, bio: r.bio,
    imageUrl: r.image_url, email: r.email, phone: r.phone, linkedin: r.linkedin,
    isActive: r.is_active, displayOrder: r.display_order,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
