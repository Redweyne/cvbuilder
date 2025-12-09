import React from 'react';
import { CV_TEMPLATES, getTemplateById } from '@/data/cvTemplates';
import { A4_WIDTH_PX, A4_HEIGHT_PX } from '@/context/DesignContext';

export default function TemplatePreview({ 
  templateId, 
  scale = 0.25, 
  className = '',
  showShadow = true 
}) {
  const template = getTemplateById(templateId);
  
  if (!template) {
    return (
      <div 
        className={`bg-slate-100 flex items-center justify-center ${className}`}
        style={{
          width: A4_WIDTH_PX * scale,
          height: A4_HEIGHT_PX * scale,
        }}
      >
        <span className="text-slate-400 text-xs">No preview</span>
      </div>
    );
  }

  const renderElement = (element, index) => {
    const scaledStyle = {
      position: 'absolute',
      left: element.x * scale,
      top: element.y * scale,
      width: element.width * scale,
      height: element.height * scale,
    };

    if (element.type === 'text') {
      return (
        <div
          key={index}
          style={{
            ...scaledStyle,
            fontSize: (element.style?.fontSize || 16) * scale,
            fontFamily: element.style?.fontFamily || 'Inter',
            fontWeight: element.style?.fontWeight || 'normal',
            fontStyle: element.style?.fontStyle || 'normal',
            color: element.style?.color || '#1e293b',
            textAlign: element.style?.textAlign || 'left',
            backgroundColor: element.style?.backgroundColor || 'transparent',
            padding: (element.style?.padding || 0) * scale,
            borderRadius: (element.style?.borderRadius || 0) * scale,
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.2,
            letterSpacing: element.style?.letterSpacing,
          }}
        >
          {element.content}
        </div>
      );
    }

    if (element.type === 'shape') {
      return (
        <div
          key={index}
          style={{
            ...scaledStyle,
            backgroundColor: element.style?.backgroundColor || '#e2e8f0',
            borderRadius: (element.style?.borderRadius || 0) * scale,
          }}
        />
      );
    }

    if (element.type === 'line') {
      return (
        <div
          key={index}
          style={{
            ...scaledStyle,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: Math.max(1, (element.height || 2) * scale),
              backgroundColor: element.style?.color || '#1e293b',
            }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`relative bg-white overflow-hidden ${showShadow ? 'shadow-lg' : ''} ${className}`}
      style={{
        width: A4_WIDTH_PX * scale,
        height: A4_HEIGHT_PX * scale,
      }}
    >
      {template.elements.map((element, index) => renderElement(element, index))}
    </div>
  );
}

export function TemplatePreviewList({ templates, scale = 0.2 }) {
  return (
    <div className="flex flex-wrap gap-4">
      {templates.map((template) => (
        <div key={template.id} className="flex flex-col items-center gap-2">
          <TemplatePreview templateId={template.id} scale={scale} />
          <span className="text-xs text-slate-600">{template.name}</span>
        </div>
      ))}
    </div>
  );
}
