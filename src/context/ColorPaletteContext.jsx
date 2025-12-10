import React, { createContext, useContext, useState, useCallback } from 'react';

const ColorPaletteContext = createContext(null);

const DEFAULT_PALETTES = [
  {
    id: 'professional',
    name: 'Professional',
    colors: {
      primary: '#1e293b',
      secondary: '#475569',
      accent: '#6366f1',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    colors: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#f1f5f9',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#cbd5e1',
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    colors: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
      accent: '#ec4899',
      background: '#faf5ff',
      surface: '#f3e8ff',
      text: '#581c87',
      textMuted: '#9333ea',
      border: '#e9d5ff',
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#0ea5e9',
      background: '#ffffff',
      surface: '#eff6ff',
      text: '#1e3a8a',
      textMuted: '#3b82f6',
      border: '#bfdbfe',
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    colors: {
      primary: '#292524',
      secondary: '#57534e',
      accent: '#d97706',
      background: '#fafaf9',
      surface: '#f5f5f4',
      text: '#292524',
      textMuted: '#78716c',
      border: '#d6d3d1',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      primary: '#18181b',
      secondary: '#3f3f46',
      accent: '#71717a',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#18181b',
      textMuted: '#71717a',
      border: '#e4e4e7',
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    colors: {
      primary: '#166534',
      secondary: '#22c55e',
      accent: '#84cc16',
      background: '#f0fdf4',
      surface: '#dcfce7',
      text: '#14532d',
      textMuted: '#16a34a',
      border: '#bbf7d0',
    },
  },
  {
    id: 'warm',
    name: 'Warm',
    colors: {
      primary: '#9a3412',
      secondary: '#ea580c',
      accent: '#f97316',
      background: '#fff7ed',
      surface: '#ffedd5',
      text: '#7c2d12',
      textMuted: '#c2410c',
      border: '#fed7aa',
    },
  },
];

const GRADIENT_PRESETS = [
  { id: 'purple-blue', name: 'Purple Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'blue-cyan', name: 'Blue Cyan', value: 'linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)' },
  { id: 'pink-orange', name: 'Pink Orange', value: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)' },
  { id: 'green-teal', name: 'Green Teal', value: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)' },
  { id: 'dark-blue', name: 'Dark Blue', value: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
  { id: 'purple-pink', name: 'Purple Pink', value: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
  { id: 'gold-amber', name: 'Gold Amber', value: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)' },
  { id: 'slate-dark', name: 'Slate Dark', value: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)' },
  { id: 'sunset', name: 'Sunset', value: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)' },
  { id: 'ocean', name: 'Ocean', value: 'linear-gradient(135deg, #0369a1 0%, #0891b2 50%, #06b6d4 100%)' },
];

export function ColorPaletteProvider({ children }) {
  const [activePalette, setActivePalette] = useState(DEFAULT_PALETTES[0]);
  const [customPalettes, setCustomPalettes] = useState([]);

  const getAllPalettes = useCallback(() => {
    return [...DEFAULT_PALETTES, ...customPalettes];
  }, [customPalettes]);

  const selectPalette = useCallback((paletteId) => {
    const allPalettes = [...DEFAULT_PALETTES, ...customPalettes];
    const palette = allPalettes.find(p => p.id === paletteId);
    if (palette) {
      setActivePalette(palette);
    }
  }, [customPalettes]);

  const createCustomPalette = useCallback((name, colors) => {
    const newPalette = {
      id: `custom-${Date.now()}`,
      name,
      colors,
      isCustom: true,
    };
    setCustomPalettes(prev => [...prev, newPalette]);
    return newPalette;
  }, []);

  const updateCustomPalette = useCallback((paletteId, updates) => {
    setCustomPalettes(prev => prev.map(p =>
      p.id === paletteId ? { ...p, ...updates } : p
    ));
    if (activePalette.id === paletteId) {
      setActivePalette(prev => ({ ...prev, ...updates }));
    }
  }, [activePalette.id]);

  const deleteCustomPalette = useCallback((paletteId) => {
    setCustomPalettes(prev => prev.filter(p => p.id !== paletteId));
    if (activePalette.id === paletteId) {
      setActivePalette(DEFAULT_PALETTES[0]);
    }
  }, [activePalette.id]);

  const getColor = useCallback((colorKey) => {
    return activePalette.colors[colorKey] || '#000000';
  }, [activePalette]);

  const value = {
    activePalette,
    palettes: getAllPalettes(),
    defaultPalettes: DEFAULT_PALETTES,
    customPalettes,
    gradientPresets: GRADIENT_PRESETS,
    selectPalette,
    createCustomPalette,
    updateCustomPalette,
    deleteCustomPalette,
    getColor,
  };

  return (
    <ColorPaletteContext.Provider value={value}>
      {children}
    </ColorPaletteContext.Provider>
  );
}

export function useColorPalette() {
  const context = useContext(ColorPaletteContext);
  if (!context) {
    throw new Error('useColorPalette must be used within a ColorPaletteProvider');
  }
  return context;
}
