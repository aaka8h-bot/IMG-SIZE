'use client';

import { useState } from 'react';
import { Lock, Unlock, RotateCcw } from 'lucide-react';
import { ResizeSettings } from '@/types/image';

interface ResizeControlsProps {
  settings: ResizeSettings;
  onSettingsChange: (settings: ResizeSettings) => void;
}

const PRESET_SIZES = [
  { name: 'HD', width: 1920, height: 1080 },
  { name: '720p', width: 1280, height: 720 },
  { name: 'Instagram Square', width: 1080, height: 1080 },
  { name: 'Facebook Cover', width: 1200, height: 630 },
  { name: 'Twitter Header', width: 1500, height: 500 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
];

export default function ResizeControls({ settings, onSettingsChange }: ResizeControlsProps) {
  const [aspectRatio, setAspectRatio] = useState(settings.width / settings.height);

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (settings.maintainAspectRatio) {
      if (dimension === 'width') {
        const newHeight = Math.round(value / aspectRatio);
        onSettingsChange({ ...settings, width: value, height: newHeight });
      } else {
        const newWidth = Math.round(value * aspectRatio);
        onSettingsChange({ ...settings, width: newWidth, height: value });
      }
    } else {
      onSettingsChange({ ...settings, [dimension]: value });
    }
  };

  const handleAspectRatioToggle = () => {
    const newMaintainAspectRatio = !settings.maintainAspectRatio;
    if (newMaintainAspectRatio) {
      setAspectRatio(settings.width / settings.height);
    }
    onSettingsChange({ ...settings, maintainAspectRatio: newMaintainAspectRatio });
  };

  const handlePresetSelect = (preset: typeof PRESET_SIZES[0]) => {
    setAspectRatio(preset.width / preset.height);
    onSettingsChange({
      ...settings,
      width: preset.width,
      height: preset.height,
    });
  };

  const handleReset = () => {
    const defaultSettings: ResizeSettings = {
      width: 1920,
      height: 1080,
      quality: 80,
      maintainAspectRatio: true,
      format: 'original'
    };
    setAspectRatio(defaultSettings.width / defaultSettings.height);
    onSettingsChange(defaultSettings);
  };

  return (
    <div className="space-y-6">
      {/* Preset Sizes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Quick Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_SIZES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className="text-xs p-2 border border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 text-left"
            >
              <div className="font-medium text-slate-900">{preset.name}</div>
              <div className="text-slate-500">{preset.width}×{preset.height}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Dimensions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Custom Dimensions
          </label>
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Width (px)
            </label>
            <input
              type="number"
              value={settings.width}
              onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              min="1"
              max="8000"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Height (px)
            </label>
            <input
              type="number"
              value={settings.height}
              onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              min="1"
              max="8000"
            />
          </div>
        </div>

        {/* Aspect Ratio Toggle */}
        <div className="mt-3">
          <button
            onClick={handleAspectRatioToggle}
            className={`
              flex items-center space-x-2 text-sm px-3 py-2 rounded-lg transition-all duration-200
              ${settings.maintainAspectRatio 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
              }
            `}
          >
            {settings.maintainAspectRatio ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
            <span>
              {settings.maintainAspectRatio ? 'Maintain aspect ratio' : 'Free dimensions'}
            </span>
          </button>
        </div>
      </div>

      {/* Quality Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Quality
          </label>
          <span className="text-sm font-medium text-blue-600">
            {settings.quality}%
          </span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={settings.quality}
            onChange={(e) => onSettingsChange({ ...settings, quality: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>10%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-slate-600">
          {settings.quality >= 80 && "High quality (larger file size)"}
          {settings.quality >= 50 && settings.quality < 80 && "Balanced quality"}
          {settings.quality < 50 && "Compressed (smaller file size)"}
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Output Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['original', 'jpeg', 'png', 'webp'].map((format) => (
            <button
              key={format}
              onClick={() => onSettingsChange({ ...settings, format: format as any })}
              className={`
                text-xs p-2 border rounded-lg transition-all duration-200 capitalize
                ${settings.format === format
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-300 hover:border-slate-400 text-slate-600'
                }
              `}
            >
              {format === 'original' ? 'Keep Original' : format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}