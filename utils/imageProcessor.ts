import imageCompression from 'browser-image-compression';
import { ProcessedImage, ResizeSettings } from '@/types/image';

export async function processImages(
  files: File[],
  settings: ResizeSettings,
  onProgress?: (progress: number, fileName: string) => void
): Promise<ProcessedImage[]> {
  const processedImages: ProcessedImage[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = ((i + 1) / files.length) * 100;
    
    onProgress?.(progress, file.name);
    
    try {
      const processedImage = await processImage(file, settings);
      processedImages.push(processedImage);
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      // Continue with other images even if one fails
    }
  }
  
  return processedImages;
}

async function processImage(
  file: File,
  settings: ResizeSettings
): Promise<ProcessedImage> {
  // Get original dimensions
  const originalDimensions = await getImageDimensions(file);
  
  let { width, height } = settings;
  
  // Calculate dimensions based on aspect ratio settings
  if (settings.maintainAspectRatio) {
    const aspectRatio = originalDimensions.width / originalDimensions.height;
    
    if (width / height > aspectRatio) {
      width = Math.round(height * aspectRatio);
    } else {
      height = Math.round(width / aspectRatio);
    }
  }
  
  // Determine output format
  let outputFormat = file.type;
  if (settings.format !== 'original') {
    outputFormat = `image/${settings.format}`;
  }
  
  // Compression options
  const options: Parameters<typeof imageCompression>[1] = {
    maxWidthOrHeight: Math.max(width, height),
    useWebWorker: true,
    maxSizeMB: 1024 * (settings.quality / 100), // Convert quality percentage to MB
    fileType: outputFormat.split('/')[1], // Extract format without 'image/'
  };
  
  // If we need specific dimensions, use canvas resizing
  if (width !== originalDimensions.width || height !== originalDimensions.height) {
    const canvas = await resizeImageWithCanvas(file, width, height);
    const blob = await canvasToBlob(canvas, outputFormat, settings.quality / 100);
    const processedFile = new File([blob], getProcessedFileName(file, settings), {
      type: outputFormat,
    });
    
    return {
      name: processedFile.name,
      file: processedFile,
      size: processedFile.size,
      dimensions: { width, height },
      originalSize: file.size,
    };
  } else {
    // Just compress without resizing
    const compressedFile = await imageCompression(file, options);
    const renamedFile = new File([compressedFile], getProcessedFileName(file, settings), {
      type: outputFormat,
    });
    
    return {
      name: renamedFile.name,
      file: renamedFile,
      size: renamedFile.size,
      dimensions: originalDimensions,
      originalSize: file.size,
    };
  }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function resizeImageWithCanvas(
  file: File,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Use high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(img.src);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      type,
      quality
    );
  });
}

function getProcessedFileName(file: File, settings: ResizeSettings): string {
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
  let extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  
  // Update extension based on format setting
  if (settings.format !== 'original') {
    switch (settings.format) {
      case 'jpeg':
        extension = 'jpg';
        break;
      case 'png':
        extension = 'png';
        break;
      case 'webp':
        extension = 'webp';
        break;
    }
  }
  
  return `${nameWithoutExt}_${settings.width}x${settings.height}_q${settings.quality}.${extension}`;
}