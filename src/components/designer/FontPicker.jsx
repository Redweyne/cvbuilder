import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Type, Check } from 'lucide-react';

const popularFonts = [
  { name: 'Inter', category: 'Sans-serif', popular: true },
  { name: 'Roboto', category: 'Sans-serif', popular: true },
  { name: 'Open Sans', category: 'Sans-serif', popular: true },
  { name: 'Lato', category: 'Sans-serif', popular: true },
  { name: 'Montserrat', category: 'Sans-serif', popular: true },
  { name: 'Poppins', category: 'Sans-serif', popular: true },
  { name: 'Source Sans Pro', category: 'Sans-serif', popular: true },
  { name: 'Raleway', category: 'Sans-serif', popular: true },
  { name: 'Nunito', category: 'Sans-serif', popular: true },
  { name: 'Ubuntu', category: 'Sans-serif', popular: true },
  { name: 'Playfair Display', category: 'Serif', popular: true },
  { name: 'Merriweather', category: 'Serif', popular: true },
  { name: 'Lora', category: 'Serif', popular: true },
  { name: 'PT Serif', category: 'Serif', popular: true },
  { name: 'Crimson Text', category: 'Serif', popular: true },
  { name: 'Libre Baskerville', category: 'Serif', popular: true },
  { name: 'Oswald', category: 'Display', popular: true },
  { name: 'Bebas Neue', category: 'Display', popular: true },
  { name: 'Archivo Black', category: 'Display', popular: true },
  { name: 'Anton', category: 'Display', popular: true },
  { name: 'Roboto Mono', category: 'Monospace' },
  { name: 'Source Code Pro', category: 'Monospace' },
  { name: 'Fira Code', category: 'Monospace' },
  { name: 'JetBrains Mono', category: 'Monospace' },
  { name: 'IBM Plex Mono', category: 'Monospace' },
  { name: 'Work Sans', category: 'Sans-serif' },
  { name: 'Rubik', category: 'Sans-serif' },
  { name: 'Mulish', category: 'Sans-serif' },
  { name: 'Quicksand', category: 'Sans-serif' },
  { name: 'Cabin', category: 'Sans-serif' },
  { name: 'Josefin Sans', category: 'Sans-serif' },
  { name: 'DM Sans', category: 'Sans-serif' },
  { name: 'Karla', category: 'Sans-serif' },
  { name: 'Barlow', category: 'Sans-serif' },
  { name: 'Manrope', category: 'Sans-serif' },
  { name: 'Space Grotesk', category: 'Sans-serif' },
  { name: 'Outfit', category: 'Sans-serif' },
  { name: 'Sora', category: 'Sans-serif' },
  { name: 'Plus Jakarta Sans', category: 'Sans-serif' },
  { name: 'Geist', category: 'Sans-serif' },
  { name: 'Noto Sans', category: 'Sans-serif' },
  { name: 'Lexend', category: 'Sans-serif' },
  { name: 'Spectral', category: 'Serif' },
  { name: 'Cormorant Garamond', category: 'Serif' },
  { name: 'EB Garamond', category: 'Serif' },
  { name: 'Bitter', category: 'Serif' },
  { name: 'Zilla Slab', category: 'Serif' },
  { name: 'Georgia', category: 'Serif', system: true },
  { name: 'Times New Roman', category: 'Serif', system: true },
  { name: 'Arial', category: 'Sans-serif', system: true },
  { name: 'Helvetica', category: 'Sans-serif', system: true },
  { name: 'Verdana', category: 'Sans-serif', system: true },
];

const loadedFonts = new Set(['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana']);

export default function FontPicker({ value, onChange, trigger }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loadingFont, setLoadingFont] = useState(null);

  const loadGoogleFont = async (fontName) => {
    if (loadedFonts.has(fontName)) return;
    
    setLoadingFont(fontName);
    try {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      loadedFonts.add(fontName);
    } catch (error) {
      console.error('Failed to load font:', fontName);
    }
    setLoadingFont(null);
  };

  useEffect(() => {
    popularFonts.filter(f => f.popular).forEach(font => {
      if (!font.system) {
        loadGoogleFont(font.name);
      }
    });
  }, []);

  const filteredFonts = popularFonts.filter(font => {
    const matchesSearch = font.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || font.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Sans-serif', 'Serif', 'Display', 'Monospace'];

  const handleSelectFont = async (fontName, isSystem) => {
    if (!isSystem) {
      await loadGoogleFont(fontName);
    }
    onChange(fontName);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 w-full justify-start">
            <Type className="w-4 h-4" />
            <span style={{ fontFamily: value }}>{value || 'Select Font'}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Type className="w-5 h-5 text-indigo-500" />
            Font Library
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search fonts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="capitalize whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {filteredFonts.map((font) => (
            <button
              key={font.name}
              onClick={() => handleSelectFont(font.name, font.system)}
              onMouseEnter={() => !font.system && loadGoogleFont(font.name)}
              className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between group ${
                value === font.name 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex-1">
                <div 
                  className="text-lg"
                  style={{ fontFamily: loadedFonts.has(font.name) ? font.name : 'inherit' }}
                >
                  {font.name}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>{font.category}</span>
                  {font.popular && (
                    <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px]">
                      Popular
                    </span>
                  )}
                  {font.system && (
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                      System
                    </span>
                  )}
                </div>
              </div>
              {value === font.name && (
                <Check className="w-5 h-5 text-indigo-500" />
              )}
              {loadingFont === font.name && (
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          ))}
          
          {filteredFonts.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No fonts found for "{searchTerm}"
            </div>
          )}
        </div>
        
        <div className="text-xs text-slate-400 mt-4 text-center border-t pt-3">
          {filteredFonts.length} fonts available • Fonts are loaded from Google Fonts
        </div>
      </DialogContent>
    </Dialog>
  );
}
