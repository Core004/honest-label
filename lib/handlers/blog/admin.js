import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req, res);
  if (!user) return;

  const result = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`;
  return res.status(200).json(result.rows.map(r => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content,
    imageUrl: r.image_url,
    author: r.author,
    isPublished: r.is_published,
    publishedAt: r.published_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  })));
}
