import React, { useRef } from 'react';
import { useDesign } from '@/context/DesignContext';
import * as LucideIcons from 'lucide-react';
import { AdvancedShapeElement } from './AdvancedShapeElement';
import { PhotoPlaceholderElement } from './PhotoPlaceholder';
import { DividerElement } from './DecorativeDividers';
import { Button } from '@/components/ui/button';
import { X, Printer, Download, ZoomIn, ZoomOut } from 'lucide-react';

export default function PrintPreview({ onClose, onExport }) {
  const { elements, documentName, A4_WIDTH_PX, A4_HEIGHT_PX, pages, currentPage } = useDesign();
  const [previewZoom, setPreviewZoom] = React.useState(1);
  const [currentPreviewPage, setCurrentPreviewPage] = React.useState(0);
  const containerRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => {
    setPreviewZoom(prev => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setPreviewZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const pageElements = pages && pages.length > 0 
    ? pages[currentPreviewPage]?.elements || elements 
    : elements;

  const totalPages = pages && pages.length > 0 ? pages.length : 1;

  const renderElement = (element) => {
    const baseStyle = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      zIndex: element.zIndex || 0,
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              fontFamily: element.fontFamily || 'Inter',
              fontSize: element.fontSize || 16,
              fontWeight: element.fontWeight || 'normal',
              fontStyle: element.fontStyle || 'normal',
              textDecoration: element.textDecoration || 'none',
              color: element.color || '#000000',
              textAlign: element.textAlign || 'left',
              lineHeight: element.lineHeight || 1.5,
              letterSpacing: element.letterSpacing || 0,
              padding: element.padding || 8,
              backgroundColor: element.backgroundColor || 'transparent',
              borderRadius: element.borderRadius || 0,
              display: 'flex',
              alignItems: element.verticalAlign === 'middle' ? 'center' : 
                         element.verticalAlign === 'bottom' ? 'flex-end' : 'flex-start',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            <div style={{ width: '100%' }}>{element.content}</div>
          </div>
        );

      case 'shape':
        if (element.shapeType && ['star', 'heart', 'triangle', 'diamond', 'hexagon', 'pentagon', 
            'octagon', 'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right', 'chevron', 
            'badge', 'shield', 'bookmark', 'flag', 'burst'].includes(element.shapeType)) {
          return (
            <div key={element.id} style={baseStyle}>
              <AdvancedShapeElement element={element} />
            </div>
          );
        }
        
        const getShapeStyles = () => {
          const base = {
            width: '100%',
            height: '100%',
            backgroundColor: element.gradient ? undefined : (element.fill || element.backgroundColor || '#4F46E5'),
            background: element.gradient || undefined,
            border: element.borderWidth ? `${element.borderWidth}px ${element.borderStyle || 'solid'} ${element.borderColor || '#000'}` : undefined,
          };
          
          switch (element.shapeType) {
            case 'circle':
              return { ...base, borderRadius: '50%' };
            case 'pill':
              return { ...base, borderRadius: '9999px' };
            case 'rounded':
              return { ...base, borderRadius: element.borderRadius || 12 };
            default:
              return { ...base, borderRadius: element.borderRadius || 0 };
          }
        };
        
        return (
          <div key={element.id} style={baseStyle}>
            <div style={getShapeStyles()} />
          </div>
        );

      case 'icon':
        const IconComponent = LucideIcons[element.icon] || LucideIcons.HelpCircle;
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent
              size={Math.min(element.width, element.height) * 0.8}
              color={element.color || '#000000'}
              strokeWidth={element.strokeWidth || 2}
            />
          </div>
        );

      case 'image':
        return (
          <div key={element.id} style={baseStyle}>
            <img
              src={element.src}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: element.objectFit || 'cover',
                borderRadius: element.borderRadius || 0,
              }}
            />
          </div>
        );

      case 'photo':
        return (
          <div key={element.id} style={baseStyle}>
            <PhotoPlaceholderElement element={element} />
          </div>
        );

      case 'divider':
        return (
          <div key={element.id} style={baseStyle}>
            <DividerElement element={element} />
          </div>
        );

      case 'progress':
        const progressPercent = element.progress || 50;
        return (
          <div key={element.id} style={baseStyle}>
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {element.showLabel && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: element.labelSize || 12,
                  color: element.labelColor || '#374151'
                }}>
                  <span>{element.label || 'Skill'}</span>
                  {element.showPercentage && <span>{progressPercent}%</span>}
                </div>
              )}
              <div style={{ 
                flex: 1, 
                backgroundColor: element.trackColor || '#E5E7EB',
                borderRadius: element.barRadius || 4,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  backgroundColor: element.progressColor || '#4F46E5',
                  borderRadius: element.barRadius || 4,
                }} />
              </div>
            </div>
          </div>
        );

      case 'section':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              backgroundColor: element.backgroundColor || '#f8fafc',
              border: element.borderWidth ? `${element.borderWidth}px solid ${element.borderColor || '#e2e8f0'}` : undefined,
              borderRadius: element.borderRadius || 8,
              padding: element.padding || 16,
            }}
          >
            {element.showTitle && element.title && (
              <div style={{
                fontWeight: 600,
                fontSize: element.titleSize || 14,
                color: element.titleColor || '#1e293b',
                marginBottom: 8,
              }}>
                {element.title}
              </div>
            )}
          </div>
        );

      case 'columns':
        const columnCount = element.columns || 2;
        const gap = element.gap || 16;
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              display: 'grid',
              gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
              gap: gap,
            }}
          >
            {Array.from({ length: columnCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: 4,
                  minHeight: 50,
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col print:bg-white">
      <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-9 w-9 text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">Print Preview</span>
            <span className="text-slate-400">-</span>
            <span className="text-slate-300">{documentName || 'Untitled'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="h-8 w-8 text-white hover:bg-slate-600"
              disabled={previewZoom <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-white text-sm w-16 text-center">
              {Math.round(previewZoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="h-8 w-8 text-white hover:bg-slate-600"
              disabled={previewZoom >= 2}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>

          <Button
            size="sm"
            onClick={onExport}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </header>

      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex items-start justify-center p-8 print:p-0 print:overflow-visible"
      >
        <div className="flex flex-col items-center gap-4">
          {totalPages > 1 && (
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2 print:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPreviewPage(prev => Math.max(0, prev - 1))}
                disabled={currentPreviewPage === 0}
                className="text-white hover:bg-slate-700"
              >
                Previous
              </Button>
              <span className="text-white text-sm">
                Page {currentPreviewPage + 1} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPreviewPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPreviewPage === totalPages - 1}
                className="text-white hover:bg-slate-700"
              >
                Next
              </Button>
            </div>
          )}

          <div
            style={{
              width: A4_WIDTH_PX * previewZoom,
              height: A4_HEIGHT_PX * previewZoom,
              backgroundColor: 'white',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="print:shadow-none print:w-full print:h-auto"
          >
            <div
              style={{
                width: A4_WIDTH_PX,
                height: A4_HEIGHT_PX,
                transform: `scale(${previewZoom})`,
                transformOrigin: 'top left',
                position: 'relative',
              }}
              className="print:transform-none"
            >
              {pageElements.map(element => renderElement(element))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-preview-page, .print-preview-page * {
            visibility: visible;
          }
          .print-preview-page {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
          }
        }
      `}</style>
    </div>
  );
}
