import { handleCors, requireAuth } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = requireAuth(req, res);
  if (!user) return;

  return res.status(200).json({
    message: 'Multiple file upload is not supported in serverless mode. Please use external image URLs or integrate Vercel Blob storage.',
  });
}
