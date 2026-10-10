import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { exportImage } from '../src/index.js';
import assert from 'node:assert';

async function main(): Promise<void> {
  const data = await sharp({
    create: {
      width: 1600,
      height: 1200,
      channels: 3,
      background: '#ff8844',
    },
  })
    .png()
    .toBuffer();

  const width = 1080;
  const height = 1350;
  const result = await exportImage({
    data,
    options: {
      width: width,
      height: height,
      fit: 'contain',
      backgroundColor: '#ffffff',
      compressionQuality: 85,
      upscaling: false,
    },
  });

  assert(result.width === width, `Expected width ${width}, got ${result.width}`);
  assert(result.height === height, `Expected height ${height}, got ${result.height}`);

  await mkdir('./dist', { recursive: true });
  await writeFile('./dist/photosweet-export.jpg', result.data);
  console.log('Export completed:', {
    width: result.width,
    height: result.height,
    bytes: result.data.length,
  });
}

await main();