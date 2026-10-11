export type ExportFit = 'contain' | 'cover' | 'fill' | 'inside' | 'outside';

export interface ExportOptions {
  width: number;
  height: number;
  fit?: ExportFit;
  compressionQuality?: number;
  backgroundColor?: string;
  upscaling?: boolean;
  autoOrientation?: boolean; 
}

export interface ExportInput {
  data: Uint8Array;
  options: ExportOptions;
}

export interface ExportOutput {
  data: Uint8Array;
  width: number;
  height: number;
}