export interface ProcessedImage {
  name: string;
  file: File;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
  originalSize: number;
}

export interface ResizeSettings {
  width: number;
  height: number;
  quality: number;
  maintainAspectRatio: boolean;
  format: 'original' | 'jpeg' | 'png' | 'webp';
}

export interface ImageProcessingProgress {
  current: number;
  total: number;
  currentFileName: string;
  percentage: number;
}