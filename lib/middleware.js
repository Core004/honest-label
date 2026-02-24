import { verifyToken } from './auth.js';

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function getAuthUser(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  return verifyToken(token);
}

export function requireAuth(req, res) {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return user;
}

export function parseBody(req) {
  return req.body || {};
}

export function handleCors(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

/**
 * Set cache headers for public GET endpoints.
 * s-maxage = CDN/Vercel edge cache (60s)
 * stale-while-revalidate = serve stale while refreshing in background (5 min)
 */
export function setCacheHeaders(req, res, maxAge = 60) {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate=300`);
  }
}
