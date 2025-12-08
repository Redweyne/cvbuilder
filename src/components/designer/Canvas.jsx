import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDesign } from '@/context/DesignContext';
import { motion } from 'framer-motion';

export default function Canvas() {
  const {
    elements,
    zoom,
    showGrid,
    gridSize,
    selectedElementId,
    setSelectedElementId,
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

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedElementId(null);
      if (editingElementId) {
        finishEditing();
      }
    }
  };

  const handleElementMouseDown = (e, element) => {
    if (editingElementId === element.id) return;
    e.stopPropagation();
    setSelectedElementId(element.id);
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
      let newX = elementStart.x + dx;
      let newY = elementStart.y + dy;

      if (showGrid) {
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
      }

      const elementWidth = draggedElement.width || 100;
      const elementHeight = draggedElement.height || 50;
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

      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      
      if (showGrid) {
        newWidth = Math.max(MIN_WIDTH, Math.round(newWidth / gridSize) * gridSize);
        newHeight = Math.max(MIN_HEIGHT, Math.round(newHeight / gridSize) * gridSize);
      }

      newWidth = Math.min(newWidth, A4_WIDTH_PX - newX);
      newHeight = Math.min(newHeight, A4_HEIGHT_PX - newY);

      updateElement(selectedElementId, { x: newX, y: newY, width: newWidth, height: newHeight });
      setHasMoved(true);
    }
  }, [isDragging, isResizing, selectedElementId, dragStart, elementStart, zoom, showGrid, gridSize, resizeHandle, draggedElement, A4_WIDTH_PX, A4_HEIGHT_PX, updateElement]);

  const handleMouseUp = useCallback(() => {
    if ((isDragging || isResizing) && selectedElementId && hasMoved) {
      commitElementChange();
    }
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setDraggedElement(null);
    setHasMoved(false);
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

  const renderElement = (element) => {
    const isSelected = element.id === selectedElementId;
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
