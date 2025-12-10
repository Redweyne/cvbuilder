import React from 'react';
import { useDesign } from '@/context/DesignContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Hexagon,
  Pentagon,
  Octagon,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Award,
  Shield,
  Bookmark,
  Flag,
  Zap,
  Diamond,
} from 'lucide-react';

const BASIC_SHAPES = [
  { type: 'rectangle', icon: Square, label: 'Rectangle' },
  { type: 'circle', icon: Circle, label: 'Circle' },
  { type: 'roundedRect', icon: Square, label: 'Rounded', borderRadius: 16 },
  { type: 'pill', icon: Square, label: 'Pill', borderRadius: 999 },
];

const ADVANCED_SHAPES = [
  { type: 'triangle', icon: Triangle, label: 'Triangle' },
  { type: 'diamond', icon: Diamond, label: 'Diamond' },
  { type: 'hexagon', icon: Hexagon, label: 'Hexagon' },
  { type: 'pentagon', icon: Pentagon, label: 'Pentagon' },
  { type: 'octagon', icon: Octagon, label: 'Octagon' },
  { type: 'star', icon: Star, label: 'Star' },
  { type: 'heart', icon: Heart, label: 'Heart' },
];

const ARROWS = [
  { type: 'arrowRight', icon: ArrowRight, label: 'Right Arrow' },
  { type: 'arrowLeft', icon: ArrowLeft, label: 'Left Arrow' },
  { type: 'arrowUp', icon: ArrowUp, label: 'Up Arrow' },
  { type: 'arrowDown', icon: ArrowDown, label: 'Down Arrow' },
  { type: 'chevronRight', icon: ChevronRight, label: 'Chevron' },
];

const BADGES = [
  { type: 'badge', icon: Award, label: 'Badge' },
  { type: 'shield', icon: Shield, label: 'Shield' },
  { type: 'bookmark', icon: Bookmark, label: 'Bookmark' },
  { type: 'flag', icon: Flag, label: 'Flag' },
  { type: 'burst', icon: Zap, label: 'Burst' },
];

export default function ShapesPanel() {
  const { addElement } = useDesign();

  const handleAddShape = (shapeConfig) => {
    const baseStyle = {
      backgroundColor: '#6366f1',
      borderRadius: shapeConfig.borderRadius || 0,
      borderWidth: 0,
      borderColor: 'transparent',
    };

    if (shapeConfig.type === 'circle') {
      addElement({
        type: 'advancedShape',
        shapeType: 'circle',
        width: 100,
        height: 100,
        style: { ...baseStyle, borderRadius: 999 },
      });
    } else if (shapeConfig.type === 'pill') {
      addElement({
        type: 'advancedShape',
        shapeType: 'pill',
        width: 150,
        height: 50,
        style: { ...baseStyle, borderRadius: 999 },
      });
    } else if (shapeConfig.type === 'roundedRect') {
      addElement({
        type: 'advancedShape',
        shapeType: 'roundedRect',
        width: 120,
        height: 80,
        style: { ...baseStyle, borderRadius: 16 },
      });
    } else if (shapeConfig.type === 'rectangle') {
      addElement({
        type: 'advancedShape',
        shapeType: 'rectangle',
        width: 120,
        height: 80,
        style: baseStyle,
      });
    } else {
      addElement({
        type: 'advancedShape',
        shapeType: shapeConfig.type,
        width: 80,
        height: 80,
        style: baseStyle,
      });
    }
  };

  const handleAddBanner = (bannerType) => {
    addElement({
      type: 'banner',
      bannerType,
      width: 200,
      height: 40,
      content: 'Banner Text',
      style: {
        backgroundColor: '#6366f1',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
      },
    });
  };

  const ShapeButton = ({ shape, onClick }) => {
    const Icon = shape.icon;
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onClick(shape)}
        className="flex flex-col items-center gap-1 h-16 w-full"
        title={shape.label}
      >
        <Icon className="w-5 h-5" />
        <span className="text-[10px]">{shape.label}</span>
      </Button>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label className="text-xs text-slate-600 mb-2 block font-medium">Basic Shapes</Label>
        <div className="grid grid-cols-4 gap-2">
          {BASIC_SHAPES.map((shape) => (
            <ShapeButton key={shape.type} shape={shape} onClick={handleAddShape} />
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs text-slate-600 mb-2 block font-medium">Advanced Shapes</Label>
        <div className="grid grid-cols-4 gap-2">
          {ADVANCED_SHAPES.map((shape) => (
            <ShapeButton key={shape.type} shape={shape} onClick={handleAddShape} />
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs text-slate-600 mb-2 block font-medium">Arrows</Label>
        <div className="grid grid-cols-5 gap-2">
          {ARROWS.map((shape) => (
            <ShapeButton key={shape.type} shape={shape} onClick={handleAddShape} />
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs text-slate-600 mb-2 block font-medium">Badges & Banners</Label>
        <div className="grid grid-cols-5 gap-2">
          {BADGES.map((shape) => (
            <ShapeButton key={shape.type} shape={shape} onClick={handleAddShape} />
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs text-slate-600 mb-2 block font-medium">Banner Styles</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddBanner('ribbon')}
            className="h-10"
          >
            Ribbon Banner
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddBanner('tag')}
            className="h-10"
          >
            Tag Banner
          </Button>
        </div>
      </div>
    </div>
  );
}
