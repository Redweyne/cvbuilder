import React from 'react';
import { useDesign } from '@/context/DesignContext';
import { Eye, EyeOff, Lock, Unlock, Trash2, ChevronUp, ChevronDown, Type, Square, Minus, Image, BarChart3, Layers, Shapes, Divide } from 'lucide-react';

const getElementIcon = (type) => {
  switch (type) {
    case 'text': return Type;
    case 'shape': return Square;
    case 'line': return Minus;
    case 'icon': return Image;
    case 'progressBar': return BarChart3;
    case 'advancedShape': return Shapes;
    case 'photoPlaceholder': return Image;
    case 'divider': return Divide;
    case 'section': return Layers;
    case 'columns': return Layers;
    default: return Square;
  }
};

const getElementLabel = (element) => {
  if (element.type === 'text') {
    const text = element.content || 'Text';
    return text.length > 20 ? text.substring(0, 20) + '...' : text;
  }
  if (element.label) return element.label;
  if (element.sectionTitle) return element.sectionTitle;
  return element.type.charAt(0).toUpperCase() + element.type.slice(1);
};

export default function LayersPanel() {
  const {
    elements,
    selectedElementId,
    selectedElementIds,
    selectElement,
    updateElement,
    deleteElement,
  } = useDesign();

  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const moveUp = (element) => {
    const currentIndex = sortedElements.findIndex(el => el.id === element.id);
    if (currentIndex > 0) {
      const above = sortedElements[currentIndex - 1];
      updateElement(element.id, { zIndex: (above.zIndex || 0) + 1 }, true);
    }
  };

  const moveDown = (element) => {
    const currentIndex = sortedElements.findIndex(el => el.id === element.id);
    if (currentIndex < sortedElements.length - 1) {
      const below = sortedElements[currentIndex + 1];
      updateElement(element.id, { zIndex: Math.max(0, (below.zIndex || 0) - 1) }, true);
    }
  };

  if (elements.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-slate-400">
        No elements yet
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {sortedElements.map((element, index) => {
          const Icon = getElementIcon(element.type);
          const isSelected = selectedElementIds.includes(element.id);
          
          return (
            <div
              key={element.id}
              onClick={() => selectElement(element.id, false)}
              className={`group flex items-center gap-2 px-3 py-2 cursor-pointer border-b border-slate-100 transition-colors ${
                isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
              
              <span className={`flex-1 text-xs truncate ${isSelected ? 'text-indigo-900 font-medium' : 'text-slate-600'}`}>
                {getElementLabel(element)}
              </span>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); moveUp(element); }}
                  disabled={index === 0}
                  className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveDown(element); }}
                  disabled={index === sortedElements.length - 1}
                  className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteElement(element.id); }}
                  className="p-1 hover:bg-red-100 text-red-500 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              
              <span className="text-[10px] text-slate-300 w-6 text-right">
                {element.zIndex || 0}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
