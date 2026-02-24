import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = requireAuth(req, res);
  if (!user) return;

  const result = await sql`SELECT id, email, name, role, is_active, created_at, last_login_at FROM admin_users WHERE id = ${user.id} LIMIT 1`;
  const dbUser = result.rows[0];

  if (!dbUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    isActive: dbUser.is_active,
    createdAt: dbUser.created_at,
    lastLoginAt: dbUser.last_login_at,
  });
}
