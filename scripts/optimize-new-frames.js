import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('public/new-raw-pngs');
const outputDir = path.resolve('public/frames-optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.startsWith('ezgif-frame-') && f.endsWith('.png')).sort();

console.log(`Iniciando otimização dos novos ${files.length} frames 1080p...`);

async function processFrames() {
  let totalSavedBytes = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(inputDir, file);
    const frameIndex = String(i + 1).padStart(3, '0');
    const outputPath = path.join(outputDir, `frame-${frameIndex}.webp`);

    const originalSize = fs.statSync(inputPath).size;

    await sharp(inputPath)
      .resize({ width: 1920, fit: 'inside', withoutEnlargement: true }) // Mantém 1080p Full HD
      .sharpen({ sigma: 1.0, m1: 1.0, m2: 2.0 })                        // Realce sutil de nitidez
      .webp({ quality: 92, effort: 6, smartSubsample: true })           // WebP de altíssima qualidade
      .toFile(outputPath);

    const newSize = fs.statSync(outputPath).size;
    totalSavedBytes += (originalSize - newSize);

    console.log(`[${i + 1}/${files.length}] ${file} -> frame-${frameIndex}.webp (${(newSize / 1024).toFixed(1)} KB)`);
  }

  console.log(`\nOtimização dos 79 frames 1080p concluída com sucesso!`);
  console.log(`Economia total de espaço: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`);
}

processFrames().catch(console.error);
