import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('novo-projeto/raw-jpegs');
const outputDir = path.resolve('public/projeto2-frames');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.startsWith('ezgif-frame-') && f.endsWith('.jpg')).sort();

console.log(`Iniciando otimização de ${files.length} frames JPEG para Projeto 2...`);

async function processFrames() {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(inputDir, file);
    const frameIndex = String(i + 1).padStart(3, '0');
    const outputPath = path.join(outputDir, `frame-${frameIndex}.webp`);

    await sharp(inputPath)
      .resize({ width: 1920, fit: 'inside', withoutEnlargement: true })
      .sharpen({ sigma: 1.0, m1: 1.0, m2: 2.0 })
      .webp({ quality: 92, effort: 6, smartSubsample: true })
      .toFile(outputPath);

    const newSize = fs.statSync(outputPath).size;
    console.log(`[${i + 1}/${files.length}] ${file} -> frame-${frameIndex}.webp (${(newSize / 1024).toFixed(1)} KB)`);
  }

  console.log(`\nOtimização dos ${files.length} frames concluída com sucesso em public/projeto2-frames!`);
}

processFrames().catch(console.error);
