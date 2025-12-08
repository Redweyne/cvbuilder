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

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];
const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Helvetica',
  'Courier New',
];
const PRESET_COLORS = [
  '#1e293b', '#475569', '#64748b', '#94a3b8',
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#0ea5e9', '#3b82f6', '#ffffff', '#000000',
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
      <div className="w-64 bg-white border-l border-slate-200 p-4 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">
          Select an element to edit its properties
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

  return (
    <div className="w-64 bg-white border-l border-slate-200 p-4 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            {selectedElement.type === 'text' ? 'Text' : selectedElement.type === 'shape' ? 'Shape' : 'Line'} Properties
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
              <select
                value={selectedElement.style?.fontFamily || 'Inter'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md"
              >
                {FONT_FAMILIES.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
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

        <div>
          <Label className="text-xs text-slate-600 mb-2 block">
            {selectedElement.type === 'text' ? 'Text Color' : selectedElement.type === 'line' ? 'Line Color' : 'Background Color'}
          </Label>
          <div className="grid grid-cols-8 gap-1 mb-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                onClick={() => handleStyleChange(selectedElement.type === 'text' ? 'color' : selectedElement.type === 'line' ? 'color' : 'backgroundColor', color)}
                className={`w-6 h-6 rounded border-2 ${
                  (selectedElement.type === 'text' ? selectedElement.style?.color : selectedElement.type === 'line' ? selectedElement.style?.color : selectedElement.style?.backgroundColor) === color
                    ? 'border-indigo-500'
                    : 'border-slate-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <Input
            type="color"
            value={(selectedElement.type === 'text' ? selectedElement.style?.color : selectedElement.type === 'line' ? selectedElement.style?.color : selectedElement.style?.backgroundColor) || '#1e293b'}
            onChange={(e) => handleStyleChange(selectedElement.type === 'text' ? 'color' : selectedElement.type === 'line' ? 'color' : 'backgroundColor', e.target.value)}
            className="w-full h-8"
          />
        </div>

        {selectedElement.type === 'text' && (
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">Background Color</Label>
            <div className="grid grid-cols-8 gap-1 mb-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => handleStyleChange('backgroundColor', color)}
                  className={`w-6 h-6 rounded border-2 ${
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
      </div>
    </div>
  );
}
