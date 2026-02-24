import { sql } from '@vercel/postgres';
import { requireAuth, handleCors } from '../../middleware.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = requireAuth(req, res);
  if (!user) return;

  const result = await sql`SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.display_order, p.name`;
  return res.status(200).json(result.rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    shortDescription: r.short_description,
    imageUrl: r.image_url,
    features: r.features,
    isActive: r.is_active,
    isFeatured: r.is_featured,
    displayOrder: r.display_order,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    categoryId: r.category_id,
    categoryName: r.category_name,
    categorySlug: r.category_slug,
  })));
}
