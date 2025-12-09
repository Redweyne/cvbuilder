import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
} from 'lucide-react';
import { useDesign } from '@/context/DesignContext';

export default function AlignmentTools() {
  const {
    selectedElementIds,
    elements,
    updateElement,
    commitElementChange,
    A4_WIDTH_PX,
    A4_HEIGHT_PX,
  } = useDesign();

  const selectedElements = elements.filter(el => selectedElementIds?.includes(el.id));
  const hasMultipleSelected = selectedElements.length > 1;
  const hasSingleSelected = selectedElements.length === 1;

  const alignLeft = () => {
    if (hasSingleSelected) {
      updateElement(selectedElements[0].id, { x: 0 }, true);
    } else if (hasMultipleSelected) {
      const minX = Math.min(...selectedElements.map(el => el.x));
      selectedElements.forEach(el => {
        updateElement(el.id, { x: minX });
      });
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
      selectedElements.forEach(el => {
        updateElement(el.id, { x: centerX - el.width / 2 });
      });
      commitElementChange();
    }
  };

  const alignRight = () => {
    if (hasSingleSelected) {
      const el = selectedElements[0];
      updateElement(el.id, { x: A4_WIDTH_PX - el.width }, true);
    } else if (hasMultipleSelected) {
      const maxX = Math.max(...selectedElements.map(el => el.x + el.width));
      selectedElements.forEach(el => {
        updateElement(el.id, { x: maxX - el.width });
      });
      commitElementChange();
    }
  };

  const alignTop = () => {
    if (hasSingleSelected) {
      updateElement(selectedElements[0].id, { y: 0 }, true);
    } else if (hasMultipleSelected) {
      const minY = Math.min(...selectedElements.map(el => el.y));
      selectedElements.forEach(el => {
        updateElement(el.id, { y: minY });
      });
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
      selectedElements.forEach(el => {
        updateElement(el.id, { y: centerY - el.height / 2 });
      });
      commitElementChange();
    }
  };

  const alignBottom = () => {
    if (hasSingleSelected) {
      const el = selectedElements[0];
      updateElement(el.id, { y: A4_HEIGHT_PX - el.height }, true);
    } else if (hasMultipleSelected) {
      const maxY = Math.max(...selectedElements.map(el => el.y + el.height));
      selectedElements.forEach(el => {
        updateElement(el.id, { y: maxY - el.height });
      });
      commitElementChange();
    }
  };

  const distributeHorizontally = () => {
    if (!hasMultipleSelected || selectedElements.length < 3) return;
    
    const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
    const totalWidth = sorted.reduce((sum, el) => sum + el.width, 0);
    const bounds = getBounds(sorted);
    const availableSpace = (bounds.maxX - bounds.minX) - totalWidth + sorted[sorted.length - 1].width;
    const gap = availableSpace / (sorted.length - 1);
    
    let currentX = bounds.minX;
    sorted.forEach((el, index) => {
      if (index > 0) {
        updateElement(el.id, { x: currentX });
      }
      currentX += el.width + gap;
    });
    commitElementChange();
  };

  const distributeVertically = () => {
    if (!hasMultipleSelected || selectedElements.length < 3) return;
    
    const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
    const totalHeight = sorted.reduce((sum, el) => sum + el.height, 0);
    const bounds = getBounds(sorted);
    const availableSpace = (bounds.maxY - bounds.minY) - totalHeight + sorted[sorted.length - 1].height;
    const gap = availableSpace / (sorted.length - 1);
    
    let currentY = bounds.minY;
    sorted.forEach((el, index) => {
      if (index > 0) {
        updateElement(el.id, { y: currentY });
      }
      currentY += el.height + gap;
    });
    commitElementChange();
  };

  const getBounds = (elements) => {
    return {
      minX: Math.min(...elements.map(el => el.x)),
      maxX: Math.max(...elements.map(el => el.x + el.width)),
      minY: Math.min(...elements.map(el => el.y)),
      maxY: Math.max(...elements.map(el => el.y + el.height)),
    };
  };

  const isDisabled = !hasSingleSelected && !hasMultipleSelected;
  const distributeDisabled = selectedElements.length < 3;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={alignLeft}
              disabled={isDisabled}
              className="h-7 w-7"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={alignCenter}
              disabled={isDisabled}
              className="h-7 w-7"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Center</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={alignRight}
              disabled={isDisabled}
              className="h-7 w-7"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Right</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={alignTop}
              disabled={isDisabled}
              className="h-7 w-7"
            >
              <AlignStartVertical className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Top</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={alignMiddle}
              disabled={isDisabled}
              className="h-7 w-7"
            >
              <AlignCenterVertical className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Middle</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={alignBottom}
              disabled={isDisabled}
              className="h-7 w-7"
            >
              <AlignEndVertical className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Bottom</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={distributeHorizontally}
              disabled={distributeDisabled}
              className="h-7 w-7"
            >
              <AlignHorizontalDistributeCenter className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Distribute Horizontally (3+ elements)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={distributeVertically}
              disabled={distributeDisabled}
              className="h-7 w-7"
            >
              <AlignVerticalDistributeCenter className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Distribute Vertically (3+ elements)</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
