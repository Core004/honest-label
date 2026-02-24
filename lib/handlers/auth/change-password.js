import { sql } from '@vercel/postgres';
import { verifyPassword, hashPassword } from '../../auth.js';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = requireAuth(req, res);
  if (!user) return;

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  const result = await sql`SELECT * FROM admin_users WHERE id = ${user.id} LIMIT 1`;
  const dbUser = result.rows[0];

  if (!dbUser || !verifyPassword(currentPassword, dbUser.password_hash)) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  const newHash = hashPassword(newPassword);
  await sql`UPDATE admin_users SET password_hash = ${newHash} WHERE id = ${user.id}`;

  return res.status(200).json({ message: 'Password changed successfully' });
}
