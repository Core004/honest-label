import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const DIRS = [
  'frontend/public/uploads',
  'frontend/public/uploads/clients',
  'frontend/public/labels',
];

const MAX_WIDTH = 800;
const QUALITY_WEBP = 80;
const QUALITY_JPG = 80;

let totalSaved = 0;
let processed = 0;

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  const originalSize = fs.statSync(filePath).size;
  const originalBuf = fs.readFileSync(filePath);

  try {
    const metadata = await sharp(originalBuf).metadata();
    const needsResize = metadata.width && metadata.width > MAX_WIDTH;

    let pipeline = sharp(originalBuf);

    if (needsResize) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    let outputBuf;
    const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    // Always create WebP version
    const webpBuf = await pipeline.clone().webp({ quality: QUALITY_WEBP }).toBuffer();
    fs.writeFileSync(webpPath, webpBuf);

    // Also optimize the original format in-place
    if (ext === '.png') {
      outputBuf = await pipeline.png({ quality: 80, compressionLevel: 9, palette: true }).toBuffer();
    } else {
      outputBuf = await pipeline.jpeg({ quality: QUALITY_JPG, mozjpeg: true }).toBuffer();
    }

    // Only overwrite if smaller
    if (outputBuf.length < originalSize) {
      fs.writeFileSync(filePath, outputBuf);
      const saved = originalSize - outputBuf.length;
      totalSaved += saved;
      processed++;
      const pct = ((saved / originalSize) * 100).toFixed(0);
      console.log(`  ${path.basename(filePath)}: ${(originalSize/1024).toFixed(0)}KB -> ${(outputBuf.length/1024).toFixed(0)}KB (-${pct}%) | WebP: ${(webpBuf.length/1024).toFixed(0)}KB`);
    } else {
      processed++;
      console.log(`  ${path.basename(filePath)}: already optimal (${(originalSize/1024).toFixed(0)}KB) | WebP: ${(webpBuf.length/1024).toFixed(0)}KB`);
    }
  } catch (err) {
    console.error(`  ERROR ${path.basename(filePath)}: ${err.message}`);
  }
}

async function processDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Skipping ${dir} (not found)`);
    return;
  }

  const files = fs.readdirSync(dir);
  console.log(`\nProcessing ${dir} (${files.length} files)...`);

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isFile()) {
      await optimizeImage(filePath);
    }
  }
}

console.log('Image Optimization');
console.log(`Max width: ${MAX_WIDTH}px | WebP quality: ${QUALITY_WEBP} | JPG quality: ${QUALITY_JPG}`);

for (const dir of DIRS) {
  await processDir(dir);
}

console.log(`\nDone! Processed ${processed} images. Total saved: ${(totalSaved / 1024 / 1024).toFixed(1)}MB`);
