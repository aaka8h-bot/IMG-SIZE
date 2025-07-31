'use client';

import { useState } from 'react';
import { X, Eye, Download, RotateCw } from 'lucide-react';
import { ProcessedImage } from '@/types/image';
import { formatFileSize } from '@/utils/formatters';
import { downloadSingleImage } from '@/utils/download';

interface ImagePreviewProps {
  originalImages: File[];
  processedImages: ProcessedImage[];
  onRemoveImage: (index: number) => void;
}

export default function ImagePreview({ 
  originalImages, 
  processedImages, 
  onRemoveImage 
}: ImagePreviewProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getImageUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  const getProcessedImageUrl = (processedImage: ProcessedImage) => {
    return URL.createObjectURL(processedImage.file);
  };

  const handleDownloadSingle = async (processedImage: ProcessedImage) => {
    await downloadSingleImage(processedImage);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {originalImages.map((file, index) => {
          const processedImage = processedImages[index];
          const originalUrl = getImageUrl(file);
          
          return (
            <div 
              key={`${file.name}-${index}`}
              className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden group hover:shadow-md transition-all duration-300 animate-fade-in"
            >
              {/* Image Thumbnail */}
              <div className="relative aspect-video bg-slate-100">
                <img
                  src={originalUrl}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewImage(originalUrl)}
                      className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
                    >
                      <Eye className="w-4 h-4 text-slate-700" />
                    </button>
                    
                    {processedImage && (
                      <button
                        onClick={() => handleDownloadSingle(processedImage)}
                        className="p-2 bg-blue-600 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Processing Status */}
                {!processedImage && processedImages.length > 0 && (
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-2">
                      <RotateCw className="w-6 h-6 text-blue-600 animate-spin" />
                      <span className="text-xs text-slate-600">Processing...</span>
                    </div>
                  </div>
                )}

                {processedImage && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Processed
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-slate-900 truncate text-sm">
                  {file.name}
                </h3>
                
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>Original: {formatFileSize(file.size)}</span>
                  {processedImage && (
                    <span className="text-green-600">
                      New: {formatFileSize(processedImage.size)}
                    </span>
                  )}
                </div>

                {processedImage && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">
                      {processedImage.dimensions.width}×{processedImage.dimensions.height}
                    </span>
                    <span className={
                      processedImage.size < file.size ? 'text-green-600' : 'text-blue-600'
                    }>
                      {processedImage.size < file.size ? '↓' : '↑'} 
                      {Math.abs(((processedImage.size - file.size) / file.size) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}