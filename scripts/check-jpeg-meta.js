import sharp from 'sharp';
import path from 'path';

async function checkMetadata() {
  const samplePath = path.resolve('novo-projeto/raw-jpegs/ezgif-frame-001.jpg');
  const metadata = await sharp(samplePath).metadata();
  console.log('Metadata Frame 001:', metadata);
}

checkMetadata().catch(console.error);
