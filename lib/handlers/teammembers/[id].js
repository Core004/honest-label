import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  const id = parseInt(req.query.id);

  if (req.method === 'PUT') {
    const existing = await sql`SELECT * FROM team_members WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Team member not found' });

    const { name, position, bio, imageUrl, email, phone, linkedin, isActive, displayOrder } = req.body || {};
    const t = existing.rows[0];

    await sql`UPDATE team_members SET
      name = ${name ?? t.name}, position = ${position ?? t.position},
      bio = ${bio ?? t.bio}, image_url = ${imageUrl ?? t.image_url},
      email = ${email ?? t.email}, phone = ${phone ?? t.phone},
      linkedin = ${linkedin ?? t.linkedin}, is_active = ${isActive ?? t.is_active},
      display_order = ${displayOrder ?? t.display_order},
      updated_at = NOW() WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM team_members WHERE id = ${id}`;
    const r = updated.rows[0];
    return res.status(200).json({
      id: r.id, name: r.name, position: r.position, bio: r.bio,
      imageUrl: r.image_url, email: r.email, phone: r.phone, linkedin: r.linkedin,
      isActive: r.is_active, displayOrder: r.display_order,
      createdAt: r.created_at, updatedAt: r.updated_at,
    });
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM team_members WHERE id = ${id}`;
    return res.status(200).json({ message: 'Team member deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
