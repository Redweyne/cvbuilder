import React from 'react';
import { useDesign } from '@/context/DesignContext';
import { Button } from '@/components/ui/button';
import {
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Undo2,
  Redo2,
  Maximize,
  Type,
  Square,
  Minus,
  Image,
  Trash2,
  Magnet,
  Smile,
  BarChart3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  LayoutGrid,
  Columns,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import IconPicker from './IconPicker';

export default function Toolbar() {
  const {
    zoom,
    setZoom,
    showGrid,
    toggleGrid,
    smartSnapping,
    toggleSmartSnapping,
    addElement,
    deleteElement,
    selectedElementId,
    selectedElementIds,
    elements,
    updateElement,
    commitElementChange,
    undo,
    redo,
    canUndo,
    canRedo,
    A4_WIDTH_PX,
    A4_HEIGHT_PX,
  } = useDesign();

  const handleAddText = () => {
    addElement({
      type: 'text',
      content: 'New Text',
      width: 200,
      height: 40,
      style: {
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: 'normal',
        color: '#1e293b',
        textAlign: 'left',
        backgroundColor: 'transparent',
        padding: 8,
      },
    });
  };

  const handleAddShape = () => {
    addElement({
      type: 'shape',
      width: 100,
      height: 100,
      style: {
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
    });
  };

  const handleAddLine = () => {
    addElement({
      type: 'line',
      width: 200,
      height: 4,
      style: {
        color: '#1e293b',
      },
    });
  };

  const handleAddIcon = (iconName) => {
    addElement({
      type: 'icon',
      iconName: iconName,
      width: 40,
      height: 40,
      style: {
        color: '#1e293b',
        backgroundColor: 'transparent',
      },
    });
  };

  const handleAddProgressBar = () => {
    addElement({
      type: 'progressBar',
      width: 200,
      height: 20,
      progress: 75,
      label: 'Skill',
      style: {
        backgroundColor: '#e2e8f0',
        progressColor: '#6366f1',
        borderRadius: 10,
        showLabel: true,
        showPercentage: true,
        labelColor: '#1e293b',
        labelFontSize: 12,
      },
    });
  };

  const handleAddSection = () => {
    addElement({
      type: 'section',
      width: 300,
      height: 200,
      style: {
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        paddingTop: 16,
        paddingRight: 16,
        paddingBottom: 16,
        paddingLeft: 16,
      },
      sectionTitle: 'Section Title',
      showTitle: true,
    });
  };

  const handleAddColumns = () => {
    addElement({
      type: 'columns',
      width: 400,
      height: 150,
      columns: 2,
      gap: 16,
      style: {
        backgroundColor: 'transparent',
        borderColor: '#e2e8f0',
        borderWidth: 0,
        borderRadius: 0,
        padding: 0,
      },
    });
  };

  const handleDelete = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };

  const zoomIn = () => setZoom(zoom + 0.1);
  const zoomOut = () => setZoom(zoom - 0.1);
  const fitToScreen = () => setZoom(0.75);

  const selectedElements = elements.filter(el => selectedElementIds?.includes(el.id));
  const hasMultipleSelected = selectedElements.length > 1;
  const hasSingleSelected = selectedElements.length === 1;
  const isDisabled = !hasSingleSelected && !hasMultipleSelected;

  const getBounds = (els) => ({
    minX: Math.min(...els.map(el => el.x)),
    maxX: Math.max(...els.map(el => el.x + el.width)),
    minY: Math.min(...els.map(el => el.y)),
    maxY: Math.max(...els.map(el => el.y + el.height)),
  });

  const alignLeft = () => {
    if (hasSingleSelected) {
      updateElement(selectedElements[0].id, { x: 0 }, true);
    } else if (hasMultipleSelected) {
      const minX = Math.min(...selectedElements.map(el => el.x));
      selectedElements.forEach(el => updateElement(el.id, { x: minX }));
      commitElementChange();
    }
  };

  const alignCenter = () => {
    if (hasSingleSelected) {
      const el = selectedElements[0];
      updateElement(el.id, { x: (A4_WIDTH_PX - el.width) / 2 }, true);
    } else if (hasMultipleSelected) {
      const bounds = getBounds(selectedElements);
      const centerX = bounds.minX + (bounds.maxX - bounds.minX) / 2;
      selectedElements.forEach(el => updateElement(el.id, { x: centerX - el.width / 2 }));
      commitElementChange();
    }
  };

  const alignRight = () => {
    if (hasSingleSelected) {
      const el = selectedElements[0];
      updateElement(el.id, { x: A4_WIDTH_PX - el.width }, true);
    } else if (hasMultipleSelected) {
      const maxX = Math.max(...selectedElements.map(el => el.x + el.width));
      selectedElements.forEach(el => updateElement(el.id, { x: maxX - el.width }));
      commitElementChange();
    }
  };

  const alignTop = () => {
    if (hasSingleSelected) {
      updateElement(selectedElements[0].id, { y: 0 }, true);
    } else if (hasMultipleSelected) {
      const minY = Math.min(...selectedElements.map(el => el.y));
      selectedElements.forEach(el => updateElement(el.id, { y: minY }));
      commitElementChange();
    }
  };

  const alignMiddle = () => {
    if (hasSingleSelected) {
      const el = selectedElements[0];
      updateElement(el.id, { y: (A4_HEIGHT_PX - el.height) / 2 }, true);
    } else if (hasMultipleSelected) {
      const bounds = getBounds(selectedElements);
      const centerY = bounds.minY + (bounds.maxY - bounds.minY) / 2;
      selectedElements.forEach(el => updateElement(el.id, { y: centerY - el.height / 2 }));
      commitElementChange();
    }
  };

  const alignBottom = () => {
    if (hasSingleSelected) {
      const el = selectedElements[0];
      updateElement(el.id, { y: A4_HEIGHT_PX - el.height }, true);
    } else if (hasMultipleSelected) {
      const maxY = Math.max(...selectedElements.map(el => el.y + el.height));
      selectedElements.forEach(el => updateElement(el.id, { y: maxY - el.height }));
      commitElementChange();
    }
  };

  const distributeHorizontally = () => {
    if (selectedElements.length < 3) return;
    const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
    const bounds = getBounds(sorted);
    const totalWidth = sorted.reduce((sum, el) => sum + el.width, 0);
    const availableSpace = (bounds.maxX - bounds.minX) - totalWidth + sorted[sorted.length - 1].width;
    const gap = availableSpace / (sorted.length - 1);
    let currentX = bounds.minX;
    sorted.forEach((el, index) => {
      if (index > 0) updateElement(el.id, { x: currentX });
      currentX += el.width + gap;
    });
    commitElementChange();
  };

  const distributeVertically = () => {
    if (selectedElements.length < 3) return;
    const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
    const bounds = getBounds(sorted);
    const totalHeight = sorted.reduce((sum, el) => sum + el.height, 0);
    const availableSpace = (bounds.maxY - bounds.minY) - totalHeight + sorted[sorted.length - 1].height;
    const gap = availableSpace / (sorted.length - 1);
    let currentY = bounds.minY;
    sorted.forEach((el, index) => {
      if (index > 0) updateElement(el.id, { y: currentY });
      currentY += el.height + gap;
    });
    commitElementChange();
  };

  return (
    <TooltipProvider>
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 pr-4 border-r border-slate-200">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddText}
                  className="h-9 w-9"
                >
                  <Type className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Text</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddShape}
                  className="h-9 w-9"
                >
                  <Square className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Shape</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddLine}
                  className="h-9 w-9"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Line</TooltipContent>
            </Tooltip>

            <IconPicker
              onSelectIcon={handleAddIcon}
              trigger={
                <Button variant="ghost" size="icon" className="h-9 w-9" title="Add Icon">
                  <Smile className="w-4 h-4" />
                </Button>
              }
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddProgressBar}
                  className="h-9 w-9"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Skill Bar</TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddSection}
                  className="h-9 w-9"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Section Container</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddColumns}
                  className="h-9 w-9"
                >
                  <Columns className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Column Layout</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 opacity-50"
                  disabled
                >
                  <Image className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Image (Coming Soon)</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-1 px-4 border-r border-slate-200">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo}
                  className="h-9 w-9"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo}
                  className="h-9 w-9"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-0.5 px-4 border-r border-slate-200">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={alignLeft} disabled={isDisabled} className="h-8 w-8">
                  <AlignLeft className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Left</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={alignCenter} disabled={isDisabled} className="h-8 w-8">
                  <AlignCenter className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Center</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={alignRight} disabled={isDisabled} className="h-8 w-8">
                  <AlignRight className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Right</TooltipContent>
            </Tooltip>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={alignTop} disabled={isDisabled} className="h-8 w-8">
                  <AlignStartVertical className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Top</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={alignMiddle} disabled={isDisabled} className="h-8 w-8">
                  <AlignCenterVertical className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Middle</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={alignBottom} disabled={isDisabled} className="h-8 w-8">
                  <AlignEndVertical className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Bottom</TooltipContent>
            </Tooltip>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={distributeHorizontally} disabled={selectedElements.length < 3} className="h-8 w-8">
                  <AlignHorizontalDistributeCenter className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Distribute Horizontally (3+)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={distributeVertically} disabled={selectedElements.length < 3} className="h-8 w-8">
                  <AlignVerticalDistributeCenter className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Distribute Vertically (3+)</TooltipContent>
            </Tooltip>
          </div>

          {selectedElementId && (
            <div className="flex items-center gap-1 px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Selected</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedElementIds.length > 1 && (
            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {selectedElementIds.length} selected
            </span>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={smartSnapping ? 'secondary' : 'ghost'}
                size="icon"
                onClick={toggleSmartSnapping}
                className={`h-9 w-9 ${smartSnapping ? 'bg-indigo-100 text-indigo-600' : ''}`}
              >
                <Magnet className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Smart Snapping (Hold Alt to disable temporarily)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? 'secondary' : 'ghost'}
                size="icon"
                onClick={toggleGrid}
                className="h-9 w-9"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={zoomOut}
                  className="h-7 w-7"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <span className="text-xs font-medium w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={zoomIn}
                  className="h-7 w-7"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={fitToScreen}
                className="h-9 w-9"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fit to Screen</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
