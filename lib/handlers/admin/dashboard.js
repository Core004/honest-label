import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = requireAuth(req, res);
  if (!user) return;

  const [products, categories, blogPosts, inquiries, newInquiries, recentInquiries] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM products`,
    sql`SELECT COUNT(*) as count FROM categories`,
    sql`SELECT COUNT(*) as count FROM blog_posts`,
    sql`SELECT COUNT(*) as count FROM inquiries`,
    sql`SELECT COUNT(*) as count FROM inquiries WHERE status = 0`,
    sql`SELECT id, name, email, label_type, status, created_at FROM inquiries ORDER BY created_at DESC LIMIT 5`,
  ]);

  return res.status(200).json({
    totalProducts: parseInt(products.rows[0].count),
    totalCategories: parseInt(categories.rows[0].count),
    totalBlogPosts: parseInt(blogPosts.rows[0].count),
    totalInquiries: parseInt(inquiries.rows[0].count),
    newInquiries: parseInt(newInquiries.rows[0].count),
    recentInquiries: recentInquiries.rows.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      labelType: r.label_type,
      status: r.status,
      createdAt: r.created_at,
    })),
  });
}
