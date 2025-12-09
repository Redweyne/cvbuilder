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
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
    undo,
    redo,
    canUndo,
    canRedo,
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

  const handleDelete = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };

  const zoomIn = () => setZoom(zoom + 0.1);
  const zoomOut = () => setZoom(zoom - 0.1);
  const fitToScreen = () => setZoom(0.75);

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
