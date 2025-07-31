'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, Settings, Image as ImageIcon, Zap, CheckCircle } from 'lucide-react';
import UploadArea from '@/components/UploadArea';
import ImagePreview from '@/components/ImagePreview';
import ResizeControls from '@/components/ResizeControls';
import ProgressTracker from '@/components/ProgressTracker';
import DownloadSection from '@/components/DownloadSection';
import { ProcessedImage, ResizeSettings } from '@/types/image';
import { processImages } from '@/utils/imageProcessor';

export default function Home() {
  const [originalImages, setOriginalImages] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentlyProcessing, setCurrentlyProcessing] = useState<string>('');
  
  const [resizeSettings, setResizeSettings] = useState<ResizeSettings>({
    width: 1920,
    height: 1080,
    quality: 80,
    maintainAspectRatio: true,
    format: 'original'
  });

  const handleFilesSelected = useCallback((files: File[]) => {
    setOriginalImages(files);
    setProcessedImages([]);
    setProcessingProgress(0);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setOriginalImages(prev => prev.filter((_, i) => i !== index));
    setProcessedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleProcessImages = useCallback(async () => {
    if (originalImages.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessedImages([]);

    try {
      const processed = await processImages(
        originalImages,
        resizeSettings,
        (progress, fileName) => {
          setProcessingProgress(progress);
          setCurrentlyProcessing(fileName);
        }
      );
      
      setProcessedImages(processed);
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsProcessing(false);
      setCurrentlyProcessing('');
    }
  }, [originalImages, resizeSettings]);

  const totalOriginalSize = originalImages.reduce((sum, file) => sum + file.size, 0);
  const totalProcessedSize = processedImages.reduce((sum, img) => sum + img.size, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Bulk Image Resizer</h1>
                <p className="text-slate-600">Professional image processing made simple</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Client-side Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Area */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Upload Images</h2>
              </div>
              <UploadArea onFilesSelected={handleFilesSelected} />
              {originalImages.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    {originalImages.length} image{originalImages.length !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Total size: {(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {/* Resize Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Resize Settings</h2>
              </div>
              <ResizeControls
                settings={resizeSettings}
                onSettingsChange={setResizeSettings}
              />
            </div>

            {/* Process Button */}
            {originalImages.length > 0 && (
              <button
                onClick={handleProcessImages}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                {isProcessing ? 'Processing...' : 'Process Images'}
              </button>
            )}
          </div>

          {/* Right Column - Preview & Download */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Tracker */}
            {isProcessing && (
              <ProgressTracker
                progress={processingProgress}
                currentFile={currentlyProcessing}
                totalFiles={originalImages.length}
              />
            )}

            {/* Image Preview */}
            {originalImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Image Preview</h2>
                <ImagePreview
                  originalImages={originalImages}
                  processedImages={processedImages}
                  onRemoveImage={handleRemoveImage}
                />
              </div>
            )}

            {/* Download Section */}
            {processedImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Download className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Download Results</h2>
                </div>
                <DownloadSection
                  processedImages={processedImages}
                  originalSize={totalOriginalSize}
                  processedSize={totalProcessedSize}
                />
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Professional Image Processing Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-600 text-sm">
                Client-side processing ensures maximum speed and privacy protection
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Batch Processing</h3>
              <p className="text-slate-600 text-sm">
                Process hundreds of images simultaneously with progress tracking
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Settings className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Advanced Controls</h3>
              <p className="text-slate-600 text-sm">
                Fine-tune quality, dimensions, and format with professional options
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">
            Built with Aakash • Client-side processing for maximum privacy
          </p>
        </div>
      </footer>
    </div>
  );
}