import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProcessedImage } from '@/types/image';

export async function downloadAllAsZip(images: ProcessedImage[]): Promise<void> {
  const zip = new JSZip();
  
  // Add each image to the zip
  for (const image of images) {
    const arrayBuffer = await image.file.arrayBuffer();
    zip.file(image.name, arrayBuffer);
  }
  
  // Generate and download the zip
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  saveAs(zipBlob, `resized-images-${timestamp}.zip`);
}

export async function downloadSingleImage(image: ProcessedImage): Promise<void> {
  saveAs(image.file, image.name);
}