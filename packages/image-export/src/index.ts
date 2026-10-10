export { exportImage } from './image-export.js';
export type { 
  ExportInput,
  ExportOutput,
  ExportOptions,
  ExportFit,
} from './types.js';

export function getVersion (): string {
  return '0.1.0';
}
