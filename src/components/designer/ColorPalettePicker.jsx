import React, { useState } from 'react';
import { useColorPalette } from '@/context/ColorPaletteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Check, Plus, Trash2, Edit2 } from 'lucide-react';

export default function ColorPalettePicker({ onSelectColor, currentColor }) {
  const {
    activePalette,
    palettes,
    gradientPresets,
    selectPalette,
    createCustomPalette,
    deleteCustomPalette,
  } = useColorPalette();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [activeTab, setActiveTab] = useState('palette');

  const handleCreatePalette = () => {
    if (newPaletteName.trim()) {
      createCustomPalette(newPaletteName, { ...activePalette.colors });
      setNewPaletteName('');
      setShowCreateForm(false);
    }
  };

  const colorKeys = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'background', label: 'Background' },
    { key: 'surface', label: 'Surface' },
    { key: 'text', label: 'Text' },
    { key: 'textMuted', label: 'Muted' },
    { key: 'border', label: 'Border' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setActiveTab('palette')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'palette' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Palette
        </button>
        <button
          onClick={() => setActiveTab('gradient')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'gradient' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Gradients
        </button>
      </div>

      {activeTab === 'palette' && (
        <>
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">Active Palette: {activePalette.name}</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorKeys.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => onSelectColor && onSelectColor(activePalette.colors[key])}
                  className={`group relative aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                    currentColor === activePalette.colors[key] ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: activePalette.colors[key] }}
                  title={`${label}: ${activePalette.colors[key]}`}
                >
                  {currentColor === activePalette.colors[key] && (
                    <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-md" />
                  )}
                  <span className="absolute -bottom-5 left-0 right-0 text-[9px] text-slate-500 text-center truncate">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Label className="text-xs text-slate-600 mb-2 block">Switch Palette</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {palettes.map((palette) => (
                <div
                  key={palette.id}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    activePalette.id === palette.id ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                  onClick={() => selectPalette(palette.id)}
                >
                  <div className="flex gap-0.5">
                    {Object.values(palette.colors).slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-700 flex-1">{palette.name}</span>
                  {palette.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomPalette(palette.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {showCreateForm ? (
            <div className="pt-2 space-y-2">
              <Input
                value={newPaletteName}
                onChange={(e) => setNewPaletteName(e.target.value)}
                placeholder="Palette name"
                className="h-8 text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreatePalette} className="flex-1">
                  Create
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateForm(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Custom Palette
            </Button>
          )}
        </>
      )}

      {activeTab === 'gradient' && (
        <div>
          <Label className="text-xs text-slate-600 mb-2 block">Gradient Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            {gradientPresets.map((gradient) => (
              <button
                key={gradient.id}
                onClick={() => onSelectColor && onSelectColor(gradient.value)}
                className={`h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                  currentColor === gradient.value ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'
                }`}
                style={{ background: gradient.value }}
                title={gradient.name}
              >
                {currentColor === gradient.value && (
                  <Check className="w-4 h-4 text-white drop-shadow-md mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
