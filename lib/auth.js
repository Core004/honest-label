import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_KEY = process.env.JWT_KEY || 'HonestLabelSecretKey123456789012345678901234567890';
const JWT_ISSUER = 'HonestLabel';
const JWT_AUDIENCE = 'HonestLabelApp';
const JWT_EXPIRY_MINUTES = parseInt(process.env.JWT_EXPIRY_MINUTES || '60');

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_KEY,
    {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      expiresIn: `${JWT_EXPIRY_MINUTES}m`,
    }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_KEY, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch {
    return null;
  }
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 11);
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function generateRefreshToken() {
  const bytes = new Uint8Array(64);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64');
}
