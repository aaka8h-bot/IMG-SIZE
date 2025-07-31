'use client';

import { Clock, Zap } from 'lucide-react';

interface ProgressTrackerProps {
  progress: number;
  currentFile: string;
  totalFiles: number;
}

export default function ProgressTracker({ 
  progress, 
  currentFile, 
  totalFiles 
}: ProgressTrackerProps) {
  const completedFiles = Math.floor((progress / 100) * totalFiles);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Processing Images</h3>
        </div>
        <div className="text-sm text-slate-600">
          {completedFiles} of {totalFiles} completed
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="space-y-4">
        <div className="relative">
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between text-sm text-slate-600 mt-2">
            <span>0%</span>
            <span className="font-medium text-blue-600">{progress.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Current File */}
        {currentFile && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-800">
                Currently processing: <span className="font-medium">{currentFile}</span>
              </span>
            </div>
          </div>
        )}

        {/* Processing Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{completedFiles}</div>
            <div className="text-xs text-slate-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{totalFiles - completedFiles}</div>
            <div className="text-xs text-slate-600">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">{totalFiles}</div>
            <div className="text-xs text-slate-600">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}