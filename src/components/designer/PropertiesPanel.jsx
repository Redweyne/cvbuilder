import React from 'react';
import { useDesign } from '@/context/DesignContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Trash2,
  Copy,
  Layers,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import FontPicker from './FontPicker';
import IconPicker from './IconPicker';
import GradientPicker from './GradientPicker';
import { PHOTO_MASK_OPTIONS } from './PhotoPlaceholder';
import { DIVIDER_OPTIONS } from './DecorativeDividers';
import * as LucideIcons from 'lucide-react';

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];
const PRESET_COLORS = [
  '#1e293b', '#475569', '#64748b', '#94a3b8',
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#0ea5e9', '#3b82f6', '#ffffff', '#000000',
];

const SHAPE_TYPES = [
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'roundedRect', label: 'Rounded Rect' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'pentagon', label: 'Pentagon' },
  { value: 'octagon', label: 'Octagon' },
  { value: 'star', label: 'Star' },
  { value: 'heart', label: 'Heart' },
  { value: 'arrowRight', label: 'Arrow Right' },
  { value: 'arrowLeft', label: 'Arrow Left' },
  { value: 'badge', label: 'Badge' },
  { value: 'shield', label: 'Shield' },
  { value: 'bookmark', label: 'Bookmark' },
];

export default function PropertiesPanel() {
  const {
    selectedElementId,
    getSelectedElement,
    updateElement,
    commitElementChange,
    deleteElement,
    duplicateElement,
    bringForward,
    sendBackward,
  } = useDesign();

  const selectedElement = getSelectedElement();

  if (!selectedElement) {
    return (
      <div className="h-full p-4 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
          <Layers className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-xs text-slate-500">
          Select an element to edit its properties
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          Hold Shift + Click to select multiple
        </p>
      </div>
    );
  }

  const handleStyleChange = (property, value) => {
    updateElement(selectedElementId, {
      style: { ...selectedElement.style, [property]: value },
    });
    commitElementChange();
  };

  const handlePropertyChange = (property, value) => {
    updateElement(selectedElementId, { [property]: value });
    commitElementChange();
  };

  const getElementTypeLabel = () => {
    switch (selectedElement.type) {
      case 'text': return 'Text';
      case 'shape': return 'Shape';
      case 'line': return 'Line';
      case 'icon': return 'Icon';
      case 'progressBar': return 'Skill Bar';
      case 'section': return 'Section';
      case 'columns': return 'Columns';
      case 'advancedShape': return 'Shape';
      case 'photoPlaceholder': return 'Photo';
      case 'divider': return 'Divider';
      case 'banner': return 'Banner';
      default: return 'Element';
    }
  };

  const renderIconPreview = () => {
    const IconComponent = LucideIcons[selectedElement.iconName];
    if (!IconComponent) return null;
    return <IconComponent className="w-6 h-6" style={{ color: selectedElement.style?.color }} />;
  };

  return (
    <div className="h-full p-3 overflow-y-auto">
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
            {getElementTypeLabel()}
          </h3>
          
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => duplicateElement && duplicateElement(selectedElementId)}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteElement(selectedElementId)}
              className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>

          <div className="flex gap-1 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => bringForward && bringForward(selectedElementId)}
              className="flex-1"
              title="Bring Forward"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendBackward && sendBackward(selectedElementId)}
              className="flex-1"
              title="Send Backward"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {selectedElement.type === 'text' && (
          <>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Content</Label>
              <textarea
                value={selectedElement.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Font Family</Label>
              <FontPicker
                value={selectedElement.style?.fontFamily || 'Inter'}
                onChange={(font) => handleStyleChange('fontFamily', font)}
              />
            </div>

            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Font Size</Label>
              <select
                value={selectedElement.style?.fontSize || 16}
                onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md"
              >
                {FONT_SIZES.map(size => (
                  <option key={size} value={size}>{size}px</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Font Style</Label>
              <div className="flex gap-1">
                <Button
                  variant={selectedElement.style?.fontWeight === 'bold' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleStyleChange('fontWeight', selectedElement.style?.fontWeight === 'bold' ? 'normal' : 'bold')}
                  className="flex-1"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedElement.style?.fontStyle === 'italic' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleStyleChange('fontStyle', selectedElement.style?.fontStyle === 'italic' ? 'normal' : 'italic')}
                  className="flex-1"
                >
                  <Italic className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Text Align</Label>
              <div className="flex gap-1">
                <Button
                  variant={selectedElement.style?.textAlign === 'left' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleStyleChange('textAlign', 'left')}
                  className="flex-1"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedElement.style?.textAlign === 'center' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleStyleChange('textAlign', 'center')}
                  className="flex-1"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant={selectedElement.style?.textAlign === 'right' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleStyleChange('textAlign', 'right')}
                  className="flex-1"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {selectedElement.type === 'icon' && (
          <>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Current Icon</Label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-2">
                {renderIconPreview()}
                <span className="text-sm text-slate-600">{selectedElement.iconName}</span>
              </div>
              <IconPicker
                onSelectIcon={(iconName) => handlePropertyChange('iconName', iconName)}
                trigger={
                  <Button variant="outline" size="sm" className="w-full">
                    Change Icon
                  </Button>
                }
              />
            </div>
          </>
        )}

        {selectedElement.type === 'progressBar' && (
          <>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Skill Label</Label>
              <Input
                value={selectedElement.label || ''}
                onChange={(e) => handlePropertyChange('label', e.target.value)}
                placeholder="e.g., JavaScript"
                className="h-8"
              />
            </div>

            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Progress: {selectedElement.progress || 75}%</Label>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedElement.progress || 75}
                onChange={(e) => handlePropertyChange('progress', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Progress Color</Label>
              <div className="grid grid-cols-6 gap-1 mb-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => handleStyleChange('progressColor', color)}
                    className={`w-5 h-5 rounded border-2 ${
                      selectedElement.style?.progressColor === color ? 'border-indigo-500' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Background Color</Label>
              <div className="grid grid-cols-6 gap-1 mb-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => handleStyleChange('backgroundColor', color)}
                    className={`w-5 h-5 rounded border-2 ${
                      selectedElement.style?.backgroundColor === color ? 'border-indigo-500' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Border Radius</Label>
              <input
                type="range"
                min="0"
                max="20"
                value={selectedElement.style?.borderRadius || 10}
                onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={selectedElement.style?.showLabel !== false}
                  onChange={(e) => handleStyleChange('showLabel', e.target.checked)}
                />
                Show Label
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={selectedElement.style?.showPercentage !== false}
                  onChange={(e) => handleStyleChange('showPercentage', e.target.checked)}
                />
                Show %
              </label>
            </div>
          </>
        )}

        <div>
          <Label className="text-xs text-slate-600 mb-2 block">
            {selectedElement.type === 'text' ? 'Text Color' : 
             selectedElement.type === 'line' ? 'Line Color' : 
             selectedElement.type === 'icon' ? 'Icon Color' :
             selectedElement.type === 'progressBar' ? 'Label Color' :
             'Background Color'}
          </Label>
          <div className="grid grid-cols-6 gap-1 mb-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                onClick={() => handleStyleChange(
                  selectedElement.type === 'text' || selectedElement.type === 'line' || selectedElement.type === 'icon' 
                    ? 'color' 
                    : selectedElement.type === 'progressBar' 
                      ? 'labelColor' 
                      : 'backgroundColor', 
                  color
                )}
                className={`w-5 h-5 rounded border-2 ${
                  (selectedElement.type === 'text' || selectedElement.type === 'line' || selectedElement.type === 'icon'
                    ? selectedElement.style?.color 
                    : selectedElement.type === 'progressBar'
                      ? selectedElement.style?.labelColor
                      : selectedElement.style?.backgroundColor) === color
                    ? 'border-indigo-500'
                    : 'border-slate-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <Input
            type="color"
            value={(selectedElement.type === 'text' || selectedElement.type === 'line' || selectedElement.type === 'icon'
              ? selectedElement.style?.color 
              : selectedElement.type === 'progressBar'
                ? selectedElement.style?.labelColor
                : selectedElement.style?.backgroundColor) || '#1e293b'}
            onChange={(e) => handleStyleChange(
              selectedElement.type === 'text' || selectedElement.type === 'line' || selectedElement.type === 'icon'
                ? 'color' 
                : selectedElement.type === 'progressBar'
                  ? 'labelColor'
                  : 'backgroundColor', 
              e.target.value
            )}
            className="w-full h-8"
          />
        </div>

        {selectedElement.type === 'text' && (
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">Background Color</Label>
            <div className="grid grid-cols-6 gap-1 mb-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => handleStyleChange('backgroundColor', color)}
                  className={`w-5 h-5 rounded border-2 ${
                    selectedElement.style?.backgroundColor === color
                      ? 'border-indigo-500'
                      : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="color"
                value={selectedElement.style?.backgroundColor === 'transparent' ? '#ffffff' : selectedElement.style?.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="flex-1 h-8"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStyleChange('backgroundColor', 'transparent')}
                className={selectedElement.style?.backgroundColor === 'transparent' ? 'bg-slate-100' : ''}
              >
                None
              </Button>
            </div>
          </div>
        )}

        {selectedElement.type === 'shape' && (
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">Border Radius</Label>
            <input
              type="range"
              min="0"
              max="50"
              value={selectedElement.style?.borderRadius || 0}
              onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-slate-500 text-center mt-1">
              {selectedElement.style?.borderRadius || 0}px
            </div>
          </div>
        )}

        {selectedElement.type === 'section' && (
          <>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Section Title</Label>
              <Input
                value={selectedElement.sectionTitle || ''}
                onChange={(e) => handlePropertyChange('sectionTitle', e.target.value)}
                placeholder="Section Title"
                className="h-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedElement.showTitle !== false}
                onChange={(e) => handlePropertyChange('showTitle', e.target.checked)}
              />
              <Label className="text-xs text-slate-600">Show Title</Label>
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Border Radius</Label>
              <input
                type="range"
                min="0"
                max="24"
                value={selectedElement.style?.borderRadius || 8}
                onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Padding</Label>
              <input
                type="range"
                min="0"
                max="48"
                value={selectedElement.style?.padding || 16}
                onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-500 text-center">{selectedElement.style?.padding || 16}px</div>
            </div>
          </>
        )}

        {selectedElement.type === 'columns' && (
          <>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Number of Columns</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(num => (
                  <Button
                    key={num}
                    variant={selectedElement.columns === num ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handlePropertyChange('columns', num)}
                    className="flex-1"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Column Gap</Label>
              <input
                type="range"
                min="0"
                max="48"
                value={selectedElement.gap || 16}
                onChange={(e) => handlePropertyChange('gap', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-500 text-center">{selectedElement.gap || 16}px</div>
            </div>
          </>
        )}

        {selectedElement.type === 'advancedShape' && (
          <>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Shape Type</Label>
              <select
                value={selectedElement.shapeType || 'rectangle'}
                onChange={(e) => handlePropertyChange('shapeType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md"
              >
                {SHAPE_TYPES.map(shape => (
                  <option key={shape.value} value={shape.value}>{shape.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Fill Color</Label>
              <GradientPicker
                value={selectedElement.style?.backgroundColor || '#6366f1'}
                onChange={(value) => handleStyleChange('backgroundColor', value)}
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Border</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={selectedElement.style?.borderWidth || 0}
                    onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value) || 0)}
                    className="h-7 text-xs"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <Input
                    type="color"
                    value={selectedElement.style?.borderColor || '#000000'}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    className="h-7"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {selectedElement.type === 'photoPlaceholder' && (
          <>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Mask Shape</Label>
              <div className="grid grid-cols-3 gap-1">
                {PHOTO_MASK_OPTIONS.map(mask => (
                  <Button
                    key={mask.value}
                    variant={selectedElement.maskType === mask.value ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handlePropertyChange('maskType', mask.value)}
                    className="text-xs"
                  >
                    {mask.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Border Color</Label>
              <div className="grid grid-cols-6 gap-1 mb-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => handleStyleChange('borderColor', color)}
                    className={`w-5 h-5 rounded border-2 ${
                      selectedElement.style?.borderColor === color ? 'border-indigo-500' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Border Width: {selectedElement.style?.borderWidth || 3}px</Label>
              <input
                type="range"
                min="0"
                max="10"
                value={selectedElement.style?.borderWidth || 3}
                onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedElement.showBorder !== false}
                onChange={(e) => handlePropertyChange('showBorder', e.target.checked)}
              />
              <Label className="text-xs text-slate-600">Show Border</Label>
            </div>
          </>
        )}

        {selectedElement.type === 'divider' && (
          <>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Divider Style</Label>
              <select
                value={selectedElement.dividerType || 'solid'}
                onChange={(e) => handlePropertyChange('dividerType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md"
              >
                {DIVIDER_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Color</Label>
              <div className="grid grid-cols-6 gap-1 mb-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => handleStyleChange('color', color)}
                    className={`w-5 h-5 rounded border-2 ${
                      selectedElement.style?.color === color ? 'border-indigo-500' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Thickness: {selectedElement.style?.thickness || 2}px</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={selectedElement.style?.thickness || 2}
                onChange={(e) => handleStyleChange('thickness', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}

        {selectedElement.type === 'banner' && (
          <>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Banner Text</Label>
              <Input
                value={selectedElement.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                placeholder="Banner text"
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Banner Style</Label>
              <div className="flex gap-1">
                <Button
                  variant={selectedElement.bannerType === 'ribbon' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handlePropertyChange('bannerType', 'ribbon')}
                  className="flex-1"
                >
                  Ribbon
                </Button>
                <Button
                  variant={selectedElement.bannerType === 'tag' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handlePropertyChange('bannerType', 'tag')}
                  className="flex-1"
                >
                  Tag
                </Button>
                <Button
                  variant={!selectedElement.bannerType || selectedElement.bannerType === 'flat' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handlePropertyChange('bannerType', 'flat')}
                  className="flex-1"
                >
                  Flat
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Background</Label>
              <GradientPicker
                value={selectedElement.style?.backgroundColor || '#6366f1'}
                onChange={(value) => handleStyleChange('backgroundColor', value)}
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600 mb-2 block">Text Color</Label>
              <div className="grid grid-cols-6 gap-1">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => handleStyleChange('color', color)}
                    className={`w-5 h-5 rounded border-2 ${
                      selectedElement.style?.color === color ? 'border-indigo-500' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">Width</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.width)}
              onChange={(e) => handlePropertyChange('width', parseInt(e.target.value) || 100)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">Height</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.height)}
              onChange={(e) => handlePropertyChange('height', parseInt(e.target.value) || 50)}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">X Position</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => handlePropertyChange('x', parseInt(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">Y Position</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => handlePropertyChange('y', parseInt(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
        </div>

        {(selectedElement.type === 'text' || selectedElement.type === 'section' || selectedElement.type === 'shape') && (
          <div className="pt-4 border-t border-slate-200">
            <Label className="text-xs text-slate-600 mb-3 block font-medium">Spacing</Label>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Padding</Label>
                <div className="grid grid-cols-4 gap-1">
                  <div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElement.style?.paddingTop ?? selectedElement.style?.padding ?? 8}
                      onChange={(e) => handleStyleChange('paddingTop', parseInt(e.target.value) || 0)}
                      className="h-7 text-xs text-center"
                      title="Top"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">T</span>
                  </div>
                  <div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElement.style?.paddingRight ?? selectedElement.style?.padding ?? 8}
                      onChange={(e) => handleStyleChange('paddingRight', parseInt(e.target.value) || 0)}
                      className="h-7 text-xs text-center"
                      title="Right"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">R</span>
                  </div>
                  <div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElement.style?.paddingBottom ?? selectedElement.style?.padding ?? 8}
                      onChange={(e) => handleStyleChange('paddingBottom', parseInt(e.target.value) || 0)}
                      className="h-7 text-xs text-center"
                      title="Bottom"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">B</span>
                  </div>
                  <div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElement.style?.paddingLeft ?? selectedElement.style?.padding ?? 8}
                      onChange={(e) => handleStyleChange('paddingLeft', parseInt(e.target.value) || 0)}
                      className="h-7 text-xs text-center"
                      title="Left"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">L</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Margin</Label>
                <div className="grid grid-cols-4 gap-1">
                  <div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElement.style?.marginTop ?? 0}
                      onChange={(e) => handleStyleChange('marginTop', parseInt(e.target.value) || 0)}
                      className="h-7 text-xs text-center"
                      title="Top"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">T</span>
                  </div>
                  <div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElement.style?.marginRight ?? 0}
                      onChange={(e) => handleStyleChange('marginRight', parseInt(e.target.value) || 0)}
                      className="h-7 text-xs text-center"
                      title="Right"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">R</span>
                  </div>
                  <div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElement.style?.marginBottom ?? 0}
                      onChange={(e) => handleStyleChange('marginBottom', parseInt(e.target.value) || 0)}
                      className="h-7 text-xs text-center"
                      title="Bottom"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">B</span>
                  </div>
                  <div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedElement.style?.marginLeft ?? 0}
                      onChange={(e) => handleStyleChange('marginLeft', parseInt(e.target.value) || 0)}
                      className="h-7 text-xs text-center"
                      title="Left"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
