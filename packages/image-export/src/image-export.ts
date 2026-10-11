import sharp from 'sharp';
import type { ExportInput, ExportOutput } from './types.js';

export async function exportImage(input: ExportInput): Promise<ExportOutput> {
  const image = sharp(
    input.data,
    {
      autoOrient: input.options.autoOrientation,
    },
  );

  image.resize(
    input.options.width,
    input.options.height,
    {
      fit: input.options.fit ?? "contain",
      withoutEnlargement: !(input.options.upscaling ?? false),
      background: input.options.backgroundColor ?? "#ffffff",
    },
  );
  image.jpeg({ quality: input.options.compressionQuality ?? 85 });

  const { data, info } = await image.toBuffer({ resolveWithObject: true });
  return {
    data: data,
    width: info.width,
    height: info.height,
  };
}