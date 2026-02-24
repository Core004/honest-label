import { sql } from '@vercel/postgres';
import { verifyPassword, generateToken, generateRefreshToken } from '../../auth.js';
import { handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const result = await sql`SELECT * FROM admin_users WHERE email = ${email} AND is_active = true LIMIT 1`;
  const user = result.rows[0];

  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  await sql`UPDATE admin_users SET last_login_at = NOW() WHERE id = ${user.id}`;

  const token = generateToken(user);
  const refreshToken = generateRefreshToken();

  return res.status(200).json({
    token,
    refreshToken,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
