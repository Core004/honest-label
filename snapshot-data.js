/**
 * Snapshots all API data to static JSON files in frontend/public/data/
 * These files are served instantly from the frontend (no DB round-trip).
 * Run: node snapshot-data.js
 */
import fs from 'fs';
import path from 'path';

const API_BASE = process.env.API_URL || 'http://localhost:3002/api';
const OUT_DIR = 'frontend/public/data';

const endpoints = [
  { key: 'products', url: '/products' },
  { key: 'products-featured', url: '/products?featured=true' },
  { key: 'categories', url: '/categories' },
  { key: 'consumables', url: '/consumables' },
  { key: 'industries', url: '/industries' },
  { key: 'clientlogos', url: '/clientlogos' },
  { key: 'testimonials', url: '/testimonials' },
  { key: 'faqs', url: '/faqs' },
  { key: 'pagesettings', url: '/pagesettings' },
  { key: 'settings', url: '/settings' },
  { key: 'teammembers', url: '/teammembers' },
  { key: 'homecontent', url: '/homecontent' },
  { key: 'blogposts', url: '/blog' },
];

async function snapshot() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Fetching data from ${API_BASE}...\n`);

  const results = await Promise.allSettled(
    endpoints.map(async ({ key, url }) => {
      const res = await fetch(`${API_BASE}${url}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      const filePath = path.join(OUT_DIR, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data));
      const size = (Buffer.byteLength(JSON.stringify(data)) / 1024).toFixed(1);
      console.log(`  ${key}.json (${size}KB)`);
      return key;
    })
  );

  const ok = results.filter(r => r.status === 'fulfilled').length;
  const fail = results.filter(r => r.status === 'rejected').length;
  if (fail > 0) {
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`  FAILED ${endpoints[i].key}: ${r.reason.message}`);
    });
  }
  console.log(`\nDone! ${ok}/${endpoints.length} snapshots saved to ${OUT_DIR}/`);
}

snapshot();
