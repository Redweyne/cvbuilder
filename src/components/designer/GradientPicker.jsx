import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useColorPalette } from '@/context/ColorPaletteContext';

const GRADIENT_DIRECTIONS = [
  { value: '0deg', label: 'Top' },
  { value: '45deg', label: 'Top Right' },
  { value: '90deg', label: 'Right' },
  { value: '135deg', label: 'Bottom Right' },
  { value: '180deg', label: 'Bottom' },
  { value: '225deg', label: 'Bottom Left' },
  { value: '270deg', label: 'Left' },
  { value: '315deg', label: 'Top Left' },
];

export default function GradientPicker({ value, onChange }) {
  const { gradientPresets, activePalette } = useColorPalette();
  
  const parseGradient = (gradientString) => {
    if (!gradientString) {
      return { type: 'solid', color1: '#6366f1', color2: '#8b5cf6', direction: '135deg' };
    }
    
    if (!gradientString.includes('gradient')) {
      return { type: 'solid', color1: gradientString, color2: '#8b5cf6', direction: '135deg' };
    }
    
    const dirMatch = gradientString.match(/(\d+deg)/);
    const colorMatches = gradientString.match(/#[a-fA-F0-9]{6}/g) || [];
    
    return {
      type: 'gradient',
      direction: dirMatch ? dirMatch[1] : '135deg',
      color1: colorMatches[0] || '#6366f1',
      color2: colorMatches[1] || '#8b5cf6',
    };
  };

  const [gradient, setGradient] = useState(parseGradient(value));

  useEffect(() => {
    setGradient(parseGradient(value));
  }, [value]);

  const updateGradient = (updates) => {
    const newGradient = { ...gradient, ...updates };
    setGradient(newGradient);
    
    if (newGradient.type === 'solid') {
      onChange(newGradient.color1);
    } else {
      onChange(`linear-gradient(${newGradient.direction}, ${newGradient.color1} 0%, ${newGradient.color2} 100%)`);
    }
  };

  const applyPreset = (presetValue) => {
    onChange(presetValue);
    setGradient(parseGradient(presetValue));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => updateGradient({ type: 'solid' })}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            gradient.type === 'solid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Solid
        </button>
        <button
          onClick={() => updateGradient({ type: 'gradient' })}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            gradient.type === 'gradient' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Gradient
        </button>
      </div>

      {gradient.type === 'solid' ? (
        <div>
          <Label className="text-xs text-slate-600 mb-2 block">Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={gradient.color1}
              onChange={(e) => updateGradient({ color1: e.target.value })}
              className="w-12 h-8 p-1"
            />
            <Input
              type="text"
              value={gradient.color1}
              onChange={(e) => updateGradient({ color1: e.target.value })}
              className="flex-1 h-8 text-xs font-mono"
            />
          </div>
        </div>
      ) : (
        <>
          <div
            className="h-16 rounded-lg border border-slate-200"
            style={{ background: `linear-gradient(${gradient.direction}, ${gradient.color1} 0%, ${gradient.color2} 100%)` }}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">Start Color</Label>
              <div className="flex gap-1">
                <Input
                  type="color"
                  value={gradient.color1}
                  onChange={(e) => updateGradient({ color1: e.target.value })}
                  className="w-10 h-8 p-1"
                />
                <Input
                  type="text"
                  value={gradient.color1}
                  onChange={(e) => updateGradient({ color1: e.target.value })}
                  className="flex-1 h-8 text-[10px] font-mono"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-1 block">End Color</Label>
              <div className="flex gap-1">
                <Input
                  type="color"
                  value={gradient.color2}
                  onChange={(e) => updateGradient({ color2: e.target.value })}
                  className="w-10 h-8 p-1"
                />
                <Input
                  type="text"
                  value={gradient.color2}
                  onChange={(e) => updateGradient({ color2: e.target.value })}
                  className="flex-1 h-8 text-[10px] font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs text-slate-600 mb-2 block">Direction</Label>
            <div className="grid grid-cols-4 gap-1">
              {GRADIENT_DIRECTIONS.map((dir) => (
                <button
                  key={dir.value}
                  onClick={() => updateGradient({ direction: dir.value })}
                  className={`p-2 rounded border text-xs ${
                    gradient.direction === dir.value
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title={dir.label}
                >
                  <div
                    className="w-4 h-4 mx-auto rounded-sm"
                    style={{
                      background: `linear-gradient(${dir.value}, ${gradient.color1}, ${gradient.color2})`,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs text-slate-600 mb-2 block">Presets</Label>
            <div className="grid grid-cols-5 gap-1">
              {gradientPresets.slice(0, 10).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.value)}
                  className="h-6 rounded border border-slate-200 hover:border-indigo-300 transition-colors"
                  style={{ background: preset.value }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
