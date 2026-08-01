import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('public');
const outputDir = path.resolve('public/frames-optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.startsWith('ezgif-frame-') && f.endsWith('.png')).sort();

console.log(`Iniciando re-otimização com Nitidez (Sharpening) e Qualidade 95 em ${files.length} frames...`);

async function processFrames() {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(inputDir, file);
    const frameIndex = String(i + 1).padStart(3, '0');
    const outputPath = path.join(outputDir, `frame-${frameIndex}.webp`);

    await sharp(inputPath)
      .resize({ width: 1920, fit: 'inside', withoutEnlargement: true })
      .sharpen({ sigma: 1.2, m1: 1.0, m2: 2.0 }) // Filtro de nitidez profissional para recuperar contornos
      .webp({ quality: 95, effort: 6, smartSubsample: true }) // Qualidade máxima WebP
      .toFile(outputPath);

    const newSize = fs.statSync(outputPath).size;
    console.log(`[${i + 1}/${files.length}] ${file} -> frame-${frameIndex}.webp (Sharpened Q95, ${(newSize / 1024).toFixed(1)} KB)`);
  }

  console.log(`\nRe-otimização com alta nitidez concluída!`);
}

processFrames().catch(console.error);
