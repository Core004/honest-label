import { handleCors, requireAuth } from '../../middleware.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method === 'DELETE') {
    const user = requireAuth(req, res);
    if (!user) return;
    // On Vercel with static files in public/, deletion isn't supported at runtime
    // Images are served from the built frontend
    return res.status(200).json({ message: 'File deletion noted. Redeploy to remove static files.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = requireAuth(req, res);
  if (!user) return;

  // On Vercel, file uploads to the filesystem aren't persistent.
  // For production, use Vercel Blob or an external storage service.
  // For now, return the URL pattern that the admin can use with pre-uploaded images.
  return res.status(200).json({
    message: 'File upload is not supported in serverless mode. Please upload images to /frontend/public/uploads/ and redeploy, or integrate Vercel Blob storage.',
    tip: 'You can use external image URLs directly in the admin panel.',
  });
}
