'use client';

import { useState } from 'react';
import { Download, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { ProcessedImage } from '@/types/image';
import { formatFileSize } from '@/utils/formatters';
import { downloadAllAsZip, downloadSingleImage } from '@/utils/download';

interface DownloadSectionProps {
  processedImages: ProcessedImage[];
  originalSize: number;
  processedSize: number;
}

export default function DownloadSection({ 
  processedImages, 
  originalSize, 
  processedSize 
}: DownloadSectionProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const sizeDifference = processedSize - originalSize;
  const sizeChangePercent = ((sizeDifference / originalSize) * 100);
  const isReduced = sizeDifference < 0;

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      await downloadAllAsZip(processedImages);
    } catch (error) {
      console.error('Error downloading files:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSingle = async (image: ProcessedImage) => {
    await downloadSingleImage(image);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">{processedImages.length}</div>
          <div className="text-sm text-slate-600">Images Processed</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{formatFileSize(originalSize)}</div>
          <div className="text-sm text-slate-600">Original Size</div>
        </div>
        
        <div className={`rounded-lg p-4 text-center ${
          isReduced ? 'bg-green-50' : 'bg-amber-50'
        }`}>
          <div className={`text-2xl font-bold flex items-center justify-center space-x-1 ${
            isReduced ? 'text-green-600' : 'text-amber-600'
          }`}>
            {isReduced ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
            <span>{formatFileSize(processedSize)}</span>
          </div>
          <div className="text-sm text-slate-600">
            {isReduced ? 'Reduced by' : 'Increased by'} {Math.abs(sizeChangePercent).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Download All Button */}
      <div className="text-center">
        <button
          onClick={handleDownloadAll}
          disabled={isDownloading}
          className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
        >
          <Package className="w-5 h-5" />
          <span>{isDownloading ? 'Creating ZIP...' : 'Download All as ZIP'}</span>
        </button>
      </div>

      {/* Individual Downloads */}
      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-3">Individual Downloads:</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {processedImages.map((image, index) => (
            <div 
              key={`${image.name}-${index}`}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 truncate text-sm">
                  {image.name}
                </div>
                <div className="text-xs text-slate-600">
                  {formatFileSize(image.size)} • {image.dimensions.width}×{image.dimensions.height}
                </div>
              </div>
              
              <button
                onClick={() => handleDownloadSingle(image)}
                className="ml-3 flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-900 mb-2">Processing Complete!</h4>
        <div className="text-sm text-slate-600 space-y-1">
          <p>✅ All {processedImages.length} images have been successfully processed</p>
          <p>
            📊 Total size change: {isReduced ? 'Reduced' : 'Increased'} by {formatFileSize(Math.abs(sizeDifference))} 
            ({Math.abs(sizeChangePercent).toFixed(1)}%)
          </p>
          <p>🔒 All processing was done locally in your browser for maximum privacy</p>
        </div>
      </div>
    </div>
  );
}