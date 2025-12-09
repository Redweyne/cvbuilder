import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDesign } from '@/context/DesignContext';
import { motion } from 'framer-motion';
import { calculateSnapGuides, getGuideColor } from '@/utils/smartGuides';
import * as LucideIcons from 'lucide-react';

export default function Canvas() {
  const {
    elements,
    zoom,
    showGrid,
    gridSize,
    smartSnapping,
    selectedElementId,
    selectedElementIds,
    selectElement,
    clearSelection,
    updateElement,
    commitElementChange,
    A4_WIDTH_PX,
    A4_HEIGHT_PX,
  } = useDesign();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [draggedElement, setDraggedElement] = useState(null);
  const [editingElementId, setEditingElementId] = useState(null);
  const [editText, setEditText] = useState('');
  const [hasMoved, setHasMoved] = useState(false);
  const [activeGuides, setActiveGuides] = useState({ vertical: [], horizontal: [] });
  const [isMultiDragging, setIsMultiDragging] = useState(false);
  const [multiDragStartPositions, setMultiDragStartPositions] = useState({});

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      clearSelection();
      if (editingElementId) {
        finishEditing();
      }
    }
  };

  const handleElementMouseDown = (e, element) => {
    if (editingElementId === element.id) return;
    e.stopPropagation();

    const isShiftHeld = e.shiftKey;
    const isAlreadySelected = selectedElementIds.includes(element.id);

    if (isShiftHeld) {
      selectElement(element.id, true);
    } else if (!isAlreadySelected) {
      selectElement(element.id, false);
    }

    if (selectedElementIds.length > 1 && isAlreadySelected) {
      setIsMultiDragging(true);
      const positions = {};
      elements.filter(el => selectedElementIds.includes(el.id)).forEach(el => {
        positions[el.id] = { x: el.x, y: el.y };
      });
      setMultiDragStartPositions(positions);
    }

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: element.x, y: element.y, width: element.width, height: element.height });
    setDraggedElement(element);
  };

  const handleResizeMouseDown = (e, element, handle) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: element.x, y: element.y, width: element.width, height: element.height });
    setDraggedElement(element);
  };

  const handleDoubleClick = (e, element) => {
    if (element.type === 'text') {
      e.stopPropagation();
      setEditingElementId(element.id);
      setEditText(element.content || '');
    }
  };

  const finishEditing = useCallback(() => {
    if (editingElementId && editText !== undefined) {
      updateElement(editingElementId, { content: editText }, true);
    }
    setEditingElementId(null);
    setEditText('');
  }, [editingElementId, editText, updateElement]);

  const handleTextChange = (e) => {
    setEditText(e.target.value);
  };

  const handleTextKeyDown = (e) => {
    if (e.key === 'Escape') {
      setEditingElementId(null);
      setEditText('');
    }
  };

  const handleTextBlur = () => {
    finishEditing();
  };

  const handleMouseMove = useCallback((e) => {
    if (!draggedElement) return;

    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;

    if (isDragging && !isResizing) {
      if (isMultiDragging && selectedElementIds.length > 1) {
        selectedElementIds.forEach(id => {
          const startPos = multiDragStartPositions[id];
          if (startPos) {
            let newX = startPos.x + dx;
            let newY = startPos.y + dy;
            const el = elements.find(e => e.id === id);
            if (el) {
              newX = Math.max(0, Math.min(A4_WIDTH_PX - el.width, newX));
              newY = Math.max(0, Math.min(A4_HEIGHT_PX - el.height, newY));
              updateElement(id, { x: newX, y: newY });
            }
          }
        });
        setHasMoved(true);
        return;
      }

      let newX = elementStart.x + dx;
      let newY = elementStart.y + dy;

      const elementWidth = draggedElement.width || 100;
      const elementHeight = draggedElement.height || 50;

      if (smartSnapping && !e.altKey) {
        const movingElement = {
          x: newX,
          y: newY,
          width: elementWidth,
          height: elementHeight,
        };

        const { guides, snapPositions } = calculateSnapGuides(
          movingElement,
          elements,
          A4_WIDTH_PX,
          A4_HEIGHT_PX,
          selectedElementId
        );

        setActiveGuides(guides);

        if (snapPositions.x !== null) {
          newX = snapPositions.x;
        }
        if (snapPositions.y !== null) {
          newY = snapPositions.y;
        }
      } else if (showGrid) {
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
        setActiveGuides({ vertical: [], horizontal: [] });
      } else {
        setActiveGuides({ vertical: [], horizontal: [] });
      }

      newX = Math.max(0, Math.min(A4_WIDTH_PX - elementWidth, newX));
      newY = Math.max(0, Math.min(A4_HEIGHT_PX - elementHeight, newY));

      updateElement(selectedElementId, { x: newX, y: newY });
      setHasMoved(true);
    }

    if (isResizing && resizeHandle) {
      const MIN_WIDTH = 30;
      const MIN_HEIGHT = 20;
      let newX = elementStart.x;
      let newY = elementStart.y;
      let newWidth = elementStart.width;
      let newHeight = elementStart.height;

      if (resizeHandle.includes('e')) {
        newWidth = Math.max(MIN_WIDTH, elementStart.width + dx);
      }
      if (resizeHandle.includes('w')) {
        const potentialWidth = elementStart.width - dx;
        if (potentialWidth >= MIN_WIDTH) {
          newX = elementStart.x + dx;
          newWidth = potentialWidth;
        } else {
          newWidth = MIN_WIDTH;
          newX = elementStart.x + elementStart.width - MIN_WIDTH;
        }
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(MIN_HEIGHT, elementStart.height + dy);
      }
      if (resizeHandle.includes('n')) {
        const potentialHeight = elementStart.height - dy;
        if (potentialHeight >= MIN_HEIGHT) {
          newY = elementStart.y + dy;
          newHeight = potentialHeight;
        } else {
          newHeight = MIN_HEIGHT;
          newY = elementStart.y + elementStart.height - MIN_HEIGHT;
        }
      }

      if (smartSnapping && !e.altKey) {
        const movingElement = {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        };

        const { guides, snapPositions } = calculateSnapGuides(
          movingElement,
          elements,
          A4_WIDTH_PX,
          A4_HEIGHT_PX,
          selectedElementId
        );

        setActiveGuides(guides);

        if (resizeHandle.includes('e') && snapPositions.x !== null) {
          const snappedRight = snapPositions.x + newWidth;
          newWidth = snappedRight - newX;
        }
        if (resizeHandle.includes('w') && snapPositions.x !== null) {
          const delta = newX - snapPositions.x;
          newX = snapPositions.x;
          newWidth = newWidth + delta;
        }
        if (resizeHandle.includes('s') && snapPositions.y !== null) {
          const snappedBottom = snapPositions.y + newHeight;
          newHeight = snappedBottom - newY;
        }
        if (resizeHandle.includes('n') && snapPositions.y !== null) {
          const delta = newY - snapPositions.y;
          newY = snapPositions.y;
          newHeight = newHeight + delta;
        }
      } else {
        setActiveGuides({ vertical: [], horizontal: [] });
        if (showGrid) {
          newWidth = Math.max(MIN_WIDTH, Math.round(newWidth / gridSize) * gridSize);
          newHeight = Math.max(MIN_HEIGHT, Math.round(newHeight / gridSize) * gridSize);
        }
      }

      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      newWidth = Math.min(newWidth, A4_WIDTH_PX - newX);
      newHeight = Math.min(newHeight, A4_HEIGHT_PX - newY);
      newWidth = Math.max(MIN_WIDTH, newWidth);
      newHeight = Math.max(MIN_HEIGHT, newHeight);

      updateElement(selectedElementId, { x: newX, y: newY, width: newWidth, height: newHeight });
      setHasMoved(true);
    }
  }, [isDragging, isResizing, selectedElementId, selectedElementIds, dragStart, elementStart, zoom, showGrid, gridSize, resizeHandle, draggedElement, A4_WIDTH_PX, A4_HEIGHT_PX, updateElement, elements, smartSnapping, isMultiDragging, multiDragStartPositions]);

  const handleMouseUp = useCallback(() => {
    if ((isDragging || isResizing) && selectedElementId && hasMoved) {
      commitElementChange();
    }
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setDraggedElement(null);
    setHasMoved(false);
    setActiveGuides({ vertical: [], horizontal: [] });
    setIsMultiDragging(false);
    setMultiDragStartPositions({});
  }, [isDragging, isResizing, selectedElementId, hasMoved, commitElementChange]);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'a' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const { selectAll } = useDesign;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderIcon = (iconName, color, size) => {
    const IconComponent = LucideIcons[iconName];
    if (!IconComponent) {
      return <LucideIcons.HelpCircle style={{ width: size, height: size, color }} />;
    }
    return <IconComponent style={{ width: size, height: size, color }} />;
  };

  const renderProgressBar = (element) => {
    const { progress = 75, label, style = {} } = element;
    const {
      backgroundColor = '#e2e8f0',
      progressColor = '#6366f1',
      borderRadius = 10,
      showLabel = true,
      showPercentage = true,
      labelColor = '#1e293b',
      labelFontSize = 12,
    } = style;

    return (
      <div className="w-full h-full flex flex-col justify-center">
        {showLabel && label && (
          <div 
            className="flex justify-between items-center mb-1"
            style={{ fontSize: labelFontSize, color: labelColor }}
          >
            <span className="font-medium">{label}</span>
            {showPercentage && <span>{progress}%</span>}
          </div>
        )}
        <div
          className="w-full overflow-hidden"
          style={{
            backgroundColor,
            borderRadius,
            height: showLabel ? 'calc(100% - 20px)' : '100%',
          }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: progressColor,
              borderRadius,
            }}
          />
        </div>
      </div>
    );
  };

  const renderElement = (element) => {
    const isSelected = selectedElementIds.includes(element.id);
    const isEditing = element.id === editingElementId;

    const resizeHandles = [
      { position: 'nw', className: '-top-1.5 -left-1.5 cursor-nw-resize' },
      { position: 'n', className: '-top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize' },
      { position: 'ne', className: '-top-1.5 -right-1.5 cursor-ne-resize' },
      { position: 'w', className: 'top-1/2 -left-1.5 -translate-y-1/2 cursor-w-resize' },
      { position: 'e', className: 'top-1/2 -right-1.5 -translate-y-1/2 cursor-e-resize' },
      { position: 'sw', className: '-bottom-1.5 -left-1.5 cursor-sw-resize' },
      { position: 's', className: '-bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize' },
      { position: 'se', className: '-bottom-1.5 -right-1.5 cursor-se-resize' },
    ];

    return (
      <div
        key={element.id}
        className={`absolute transition-shadow ${
          isSelected && !isEditing ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
        } ${!isEditing ? 'cursor-move' : ''}`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          zIndex: element.zIndex,
        }}
        onMouseDown={(e) => !isEditing && handleElementMouseDown(e, element)}
        onDoubleClick={(e) => handleDoubleClick(e, element)}
      >
        {element.type === 'text' && (
          <div
            className="w-full h-full overflow-hidden whitespace-pre-wrap"
            style={{
              fontSize: element.style?.fontSize,
              fontFamily: element.style?.fontFamily,
              fontWeight: element.style?.fontWeight,
              fontStyle: element.style?.fontStyle,
              color: element.style?.color,
              textAlign: element.style?.textAlign,
              backgroundColor: element.style?.backgroundColor,
              padding: element.style?.padding,
              borderRadius: element.style?.borderRadius,
            }}
          >
            {isEditing ? (
              <textarea
                value={editText}
                onChange={handleTextChange}
                onKeyDown={handleTextKeyDown}
                onBlur={handleTextBlur}
                autoFocus
                className="w-full h-full bg-transparent border-none outline-none resize-none p-0 m-0"
                style={{
                  fontSize: element.style?.fontSize,
                  fontFamily: element.style?.fontFamily,
                  fontWeight: element.style?.fontWeight,
                  fontStyle: element.style?.fontStyle,
                  color: element.style?.color,
                  textAlign: element.style?.textAlign,
                }}
              />
            ) : (
              element.content
            )}
          </div>
        )}
        {element.type === 'shape' && (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.style?.backgroundColor || '#e2e8f0',
              borderRadius: element.style?.borderRadius,
            }}
          />
        )}
        {element.type === 'line' && (
          <div
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
            style={{ 
              height: Math.max(2, element.height || 2),
              backgroundColor: element.style?.color || '#1e293b' 
            }}
          />
        )}
        {element.type === 'icon' && (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: element.style?.backgroundColor || 'transparent',
              borderRadius: element.style?.borderRadius || 0,
            }}
          >
            {renderIcon(
              element.iconName,
              element.style?.color || '#1e293b',
              Math.min(element.width, element.height) * 0.8
            )}
          </div>
        )}
        {element.type === 'progressBar' && renderProgressBar(element)}

        {isSelected && !isEditing && (
          <>
            {resizeHandles.map(handle => (
              <div
                key={handle.position}
                className={`absolute w-3 h-3 bg-white border-2 border-indigo-500 rounded-sm ${handle.className}`}
                onMouseDown={(e) => handleResizeMouseDown(e, element, handle.position)}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    const lines = [];
    const scaledGridSize = gridSize;

    for (let x = 0; x <= A4_WIDTH_PX; x += scaledGridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={A4_HEIGHT_PX}
          stroke="#e2e8f0"
          strokeWidth="0.5"
        />
      );
    }

    for (let y = 0; y <= A4_HEIGHT_PX; y += scaledGridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={A4_WIDTH_PX}
          y2={y}
          stroke="#e2e8f0"
          strokeWidth="0.5"
        />
      );
    }

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={A4_WIDTH_PX}
        height={A4_HEIGHT_PX}
      >
        {lines}
      </svg>
    );
  };

  const renderSmartGuides = () => {
    if (activeGuides.vertical.length === 0 && activeGuides.horizontal.length === 0) {
      return null;
    }

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={A4_WIDTH_PX}
        height={A4_HEIGHT_PX}
        style={{ zIndex: 9999 }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {activeGuides.vertical.map((guide, index) => (
          <g key={`v-${index}-${guide.position}`}>
            <line
              x1={guide.position}
              y1={0}
              x2={guide.position}
              y2={A4_HEIGHT_PX}
              stroke={getGuideColor(guide.sourceType)}
              strokeWidth="1"
              strokeDasharray={guide.sourceType === 'canvas-center' ? '8,4' : 'none'}
              opacity="0.8"
              filter="url(#glow)"
            />
            <circle
              cx={guide.position}
              cy={A4_HEIGHT_PX / 2}
              r="3"
              fill={getGuideColor(guide.sourceType)}
            />
          </g>
        ))}
        
        {activeGuides.horizontal.map((guide, index) => (
          <g key={`h-${index}-${guide.position}`}>
            <line
              x1={0}
              y1={guide.position}
              x2={A4_WIDTH_PX}
              y2={guide.position}
              stroke={getGuideColor(guide.sourceType)}
              strokeWidth="1"
              strokeDasharray={guide.sourceType === 'canvas-center' ? '8,4' : 'none'}
              opacity="0.8"
              filter="url(#glow)"
            />
            <circle
              cx={A4_WIDTH_PX / 2}
              cy={guide.position}
              r="3"
              fill={getGuideColor(guide.sourceType)}
            />
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-slate-200 p-8"
      style={{ 
        backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      <div className="flex items-center justify-center min-h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <div
            ref={canvasRef}
            id="cv-canvas"
            className="relative bg-white shadow-2xl"
            style={{
              width: A4_WIDTH_PX,
              height: A4_HEIGHT_PX,
            }}
            onClick={handleCanvasClick}
          >
            {renderGrid()}
            {renderSmartGuides()}
            {elements
              .slice()
              .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
              .map(renderElement)}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
