import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';
import { generateSlug } from '../../slug.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  if (req.method === 'GET') {
    const page = parseInt(req.query.page || '1');
    const pageSize = parseInt(req.query.pageSize || '10');
    const offset = (page - 1) * pageSize;

    const result = await sql.query(
      `SELECT * FROM blog_posts WHERE is_published = true ORDER BY published_at DESC LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    );
    return res.status(200).json(result.rows.map(mapBlogPost));
  }

  if (req.method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;

    const { title, excerpt, content, imageUrl, author, isPublished } = req.body || {};
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const slug = generateSlug(title);
    const publishedAt = isPublished ? new Date().toISOString() : null;

    const result = await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, image_url, author, is_published, published_at)
      VALUES (${title}, ${slug}, ${excerpt || null}, ${content || null}, ${imageUrl || null}, ${author || null}, ${isPublished || false}, ${publishedAt})
      RETURNING *`;

    return res.status(201).json(mapBlogPost(result.rows[0]));
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function mapBlogPost(r) {
  return {
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
  };
}
