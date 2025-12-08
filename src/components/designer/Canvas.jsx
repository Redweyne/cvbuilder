import React, { useRef, useEffect, useState } from 'react';
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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  const [draggedElement, setDraggedElement] = useState(null);

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedElementId(null);
    }
  };

  const handleElementMouseDown = (e, element) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: element.x, y: element.y });
    setDraggedElement(element);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElementId || !draggedElement) return;

    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;

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
  };

  const handleMouseUp = () => {
    if (isDragging && selectedElementId) {
      commitElementChange();
    }
    setIsDragging(false);
    setDraggedElement(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, selectedElementId, dragStart, elementStart, zoom, showGrid, gridSize]);

  const renderElement = (element) => {
    const isSelected = element.id === selectedElementId;

    return (
      <div
        key={element.id}
        className={`absolute cursor-move transition-shadow ${
          isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
        }`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          zIndex: element.zIndex,
          fontSize: element.style?.fontSize,
          fontFamily: element.style?.fontFamily,
          fontWeight: element.style?.fontWeight,
          color: element.style?.color,
          textAlign: element.style?.textAlign,
          backgroundColor: element.style?.backgroundColor,
          borderColor: element.style?.borderColor,
          borderWidth: element.style?.borderWidth,
          borderStyle: element.style?.borderWidth > 0 ? 'solid' : 'none',
          borderRadius: element.style?.borderRadius,
          padding: element.style?.padding,
        }}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
      >
        {element.type === 'text' && (
          <div className="w-full h-full overflow-hidden">
            {element.content}
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
            className="absolute top-1/2 left-0 right-0 h-0.5"
            style={{ backgroundColor: element.style?.color || '#1e293b' }}
          />
        )}

        {isSelected && (
          <>
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-indigo-500 rounded-sm cursor-nw-resize" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-sm cursor-ne-resize" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-indigo-500 rounded-sm cursor-sw-resize" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 rounded-sm cursor-se-resize" />
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
            className="relative bg-white shadow-2xl"
            style={{
              width: A4_WIDTH_PX,
              height: A4_HEIGHT_PX,
            }}
            onClick={handleCanvasClick}
          >
            {renderGrid()}
            {elements.map(renderElement)}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
