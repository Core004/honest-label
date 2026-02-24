import { handleCors, requireAuth } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req, res);
  if (!user) return;

  // On Vercel, we can't list filesystem files at runtime.
  // Return empty list - images are served statically from /uploads/
  return res.status(200).json({ images: [] });
}
