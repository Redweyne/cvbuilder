import React from 'react';
import { useDesign } from '@/context/DesignContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings2, RulerIcon } from 'lucide-react';

const MARGIN_PRESETS = [
  { name: 'None', values: { top: 0, right: 0, bottom: 0, left: 0 } },
  { name: 'Narrow', values: { top: 20, right: 20, bottom: 20, left: 20 } },
  { name: 'Normal', values: { top: 40, right: 40, bottom: 40, left: 40 } },
  { name: 'Wide', values: { top: 60, right: 60, bottom: 60, left: 60 } },
  { name: 'Custom', values: null },
];

export default function PageSettings({ trigger }) {
  const {
    pageMargins,
    setPageMargins,
    showMarginGuides,
    toggleMarginGuides,
  } = useDesign();

  const handleMarginChange = (side, value) => {
    const numValue = parseInt(value) || 0;
    setPageMargins({ [side]: Math.max(0, Math.min(200, numValue)) });
  };

  const handlePresetSelect = (preset) => {
    if (preset.values) {
      setPageMargins(preset.values);
    }
  };

  const getCurrentPreset = () => {
    for (const preset of MARGIN_PRESETS) {
      if (preset.values &&
          preset.values.top === pageMargins.top &&
          preset.values.right === pageMargins.right &&
          preset.values.bottom === pageMargins.bottom &&
          preset.values.left === pageMargins.left) {
        return preset.name;
      }
    }
    return 'Custom';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings2 className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RulerIcon className="w-5 h-5" />
            Page Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Margin Presets</Label>
            <div className="grid grid-cols-5 gap-2">
              {MARGIN_PRESETS.filter(p => p.values).map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    getCurrentPreset() === preset.name
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                      : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Custom Margins (px)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Top</Label>
                <Input
                  type="number"
                  min="0"
                  max="200"
                  value={pageMargins.top}
                  onChange={(e) => handleMarginChange('top', e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Bottom</Label>
                <Input
                  type="number"
                  min="0"
                  max="200"
                  value={pageMargins.bottom}
                  onChange={(e) => handleMarginChange('bottom', e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Left</Label>
                <Input
                  type="number"
                  min="0"
                  max="200"
                  value={pageMargins.left}
                  onChange={(e) => handleMarginChange('left', e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Right</Label>
                <Input
                  type="number"
                  min="0"
                  max="200"
                  value={pageMargins.right}
                  onChange={(e) => handleMarginChange('right', e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Show Margin Guides</Label>
              <p className="text-xs text-slate-500">Display visual margin indicators</p>
            </div>
            <Switch
              checked={showMarginGuides}
              onCheckedChange={toggleMarginGuides}
            />
          </div>

          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-2 text-indigo-700">
              <RulerIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Safe Area</span>
            </div>
            <p className="text-xs text-indigo-600 mt-1">
              Content area: {794 - pageMargins.left - pageMargins.right}px x {1123 - pageMargins.top - pageMargins.bottom}px
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
