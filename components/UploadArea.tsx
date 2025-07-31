'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, FileX } from 'lucide-react';

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

const ACCEPTED_FORMATS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file

export default function UploadArea({ onFilesSelected }: UploadAreaProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
    onFilesSelected(validFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxSize: MAX_FILE_SIZE,
    multiple: true
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`
            p-3 rounded-full transition-all duration-300
            ${isDragActive ? 'bg-blue-100' : 'bg-slate-100'}
          `}>
            <Upload className={`
              w-8 h-8 transition-colors duration-300
              ${isDragActive ? 'text-blue-600' : 'text-slate-500'}
            `} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-slate-700 mb-2">
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-sm text-slate-500">
              or <span className="text-blue-600 font-medium">browse files</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <ImageIcon className="w-4 h-4" />
              <span>JPG, PNG, WebP</span>
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Max 50MB per file</span>
          </div>
        </div>

        {/* Animated border on drag */}
        {isDragActive && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-xl animate-pulse" />
        )}
      </div>

      {/* File rejection errors */}
      {fileRejections.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileX className="w-4 h-4 text-red-500" />
            <h4 className="text-sm font-medium text-red-800">Some files were rejected:</h4>
          </div>
          <ul className="text-xs text-red-700 space-y-1">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                <strong>{file.name}</strong>: {errors.map(e => e.message).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Supported formats info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Supported Features:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Multiple file selection and batch processing</li>
          <li>• Drag and drop support with visual feedback</li>
          <li>• Real-time preview and size comparison</li>
          <li>• Client-side processing for privacy protection</li>
        </ul>
      </div>
    </div>
  );
}