import { sql } from '@vercel/postgres';
import { requireAuth, handleCors, setCacheHeaders } from '../../middleware.js';
import { generateSlug } from '../../slug.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  setCacheHeaders(req, res);

  const { slug } = req.query;
  const isId = /^\d+$/.test(slug);

  if (req.method === 'GET' && !isId) {
    const result = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} AND is_published = true LIMIT 1`;
    if (result.rows.length === 0) return res.status(404).json({ error: 'Blog post not found' });
    return res.status(200).json(mapBlogPost(result.rows[0]));
  }

  if (req.method === 'PUT' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    const id = parseInt(slug);
    const { title, excerpt, content, imageUrl, author, isPublished } = req.body || {};

    const existing = await sql`SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1`;
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Blog post not found' });

    const b = existing.rows[0];
    const newSlug = title ? generateSlug(title) : b.slug;
    const wasPublished = b.is_published;
    const nowPublished = isPublished ?? b.is_published;
    const publishedAt = (!wasPublished && nowPublished) ? new Date().toISOString() : b.published_at;

    await sql`UPDATE blog_posts SET
      title = ${title ?? b.title},
      slug = ${newSlug},
      excerpt = ${excerpt ?? b.excerpt},
      content = ${content ?? b.content},
      image_url = ${imageUrl ?? b.image_url},
      author = ${author ?? b.author},
      is_published = ${nowPublished},
      published_at = ${publishedAt},
      updated_at = NOW()
      WHERE id = ${id}`;

    const updated = await sql`SELECT * FROM blog_posts WHERE id = ${id}`;
    return res.status(200).json(mapBlogPost(updated.rows[0]));
  }

  if (req.method === 'DELETE' && isId) {
    const user = requireAuth(req, res);
    if (!user) return;
    await sql`DELETE FROM blog_posts WHERE id = ${parseInt(slug)}`;
    return res.status(200).json({ message: 'Blog post deleted' });
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
