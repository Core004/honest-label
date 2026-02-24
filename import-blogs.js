import { sql } from '@vercel/postgres';
import Database from 'better-sqlite3';

const DB_PATH = './backend/honestlabel.db';

async function importBlogs() {
  const db = new Database(DB_PATH, { readonly: true });
  const blogs = db.prepare('SELECT * FROM BlogPosts').all();

  console.log(`Found ${blogs.length} blog posts`);

  for (const b of blogs) {
    try {
      await sql`INSERT INTO blog_posts (id, title, slug, excerpt, content, image_url, author, is_published, published_at, created_at, updated_at)
        VALUES (${b.Id}, ${b.Title}, ${b.Slug}, ${b.Excerpt}, ${b.Content}, ${b.ImageUrl}, ${b.Author}, ${b.IsPublished ? true : false}, ${b.PublishedAt || null}, ${b.CreatedAt}, ${b.UpdatedAt || null})
        ON CONFLICT (id) DO UPDATE SET title = ${b.Title}, content = ${b.Content}, excerpt = ${b.Excerpt}, image_url = ${b.ImageUrl}`;
      console.log(`  Imported: ${b.Title}`);
    } catch (err) {
      console.error(`  Error: ${b.Title} - ${err.message}`);
    }
  }

  // Fix sequence
  try {
    await sql`SELECT setval('blog_posts_id_seq', (SELECT COALESCE(MAX(id),1) FROM blog_posts))`;
  } catch {}

  // Also import home_contents if any
  const homeContents = db.prepare('SELECT * FROM HomeContents').all();
  if (homeContents.length > 0) {
    console.log(`Found ${homeContents.length} home content entries`);
    for (const h of homeContents) {
      try {
        await sql`INSERT INTO home_contents (id, section, key, value, image_url, updated_at)
          VALUES (${h.Id}, ${h.Section}, ${h.Key}, ${h.Value}, ${h.ImageUrl}, ${h.UpdatedAt})
          ON CONFLICT (id) DO UPDATE SET value = ${h.Value}, image_url = ${h.ImageUrl}`;
        console.log(`  Imported: ${h.Section}/${h.Key}`);
      } catch (err) {
        console.error(`  Error: ${h.Section}/${h.Key} - ${err.message}`);
      }
    }
    try {
      await sql`SELECT setval('home_contents_id_seq', (SELECT COALESCE(MAX(id),1) FROM home_contents))`;
    } catch {}
  }

  db.close();
  console.log('Done!');
}

importBlogs().catch(console.error);
