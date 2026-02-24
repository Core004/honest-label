import { sql } from '@vercel/postgres';
import { readFileSync } from 'fs';

async function importData() {
  console.log('Clearing existing data...');

  // Clear tables in correct order (respect foreign keys)
  await sql`DELETE FROM products`;
  await sql`DELETE FROM categories`;
  await sql`DELETE FROM blog_posts`;
  await sql`DELETE FROM inquiries`;
  await sql`DELETE FROM quote_requests`;
  await sql`DELETE FROM site_settings`;
  await sql`DELETE FROM client_logos`;
  await sql`DELETE FROM industries`;
  await sql`DELETE FROM consumables`;
  await sql`DELETE FROM faqs`;
  await sql`DELETE FROM team_members`;
  await sql`DELETE FROM testimonials`;
  await sql`DELETE FROM home_contents`;
  await sql`DELETE FROM page_settings`;
  await sql`DELETE FROM admin_users`;

  console.log('Tables cleared. Importing data...');

  const sqlFile = readFileSync('./import.sql', 'utf8');
  const statements = sqlFile
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('--'))
    .map(line => line.trim());

  let count = 0;
  let errors = 0;
  for (const stmt of statements) {
    try {
      await sql.query(stmt);
      count++;
    } catch (err) {
      errors++;
      console.error(`Error on: ${stmt.substring(0, 80)}...`);
      console.error(`  ${err.message}`);
    }
  }

  console.log(`Import complete: ${count} statements executed, ${errors} errors`);
}

importData().catch(console.error);
