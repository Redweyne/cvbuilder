import React from 'react';
import { useDesign } from '@/context/DesignContext';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function PageNavigator() {
  const {
    pages,
    currentPageIndex,
    addPage,
    deletePage,
    duplicatePage,
    goToPage,
  } = useDesign();

  const canDeletePage = pages.length > 1;
  const canGoPrev = currentPageIndex > 0;
  const canGoNext = currentPageIndex < pages.length - 1;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-t border-slate-200">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goToPage(currentPageIndex - 1)}
                disabled={!canGoPrev}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous Page</TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-lg">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              Page {currentPageIndex + 1} of {pages.length}
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goToPage(currentPageIndex + 1)}
                disabled={!canGoNext}
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next Page</TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={addPage}
                className="h-8 w-8"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add New Page</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => duplicatePage(currentPageIndex)}
                className="h-8 w-8"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Duplicate Current Page</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deletePage(currentPageIndex)}
                disabled={!canDeletePage}
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Current Page</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1 overflow-x-auto max-w-[300px]">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => goToPage(index)}
              className={`flex-shrink-0 w-8 h-10 rounded border-2 transition-all ${
                index === currentPageIndex
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              title={`Go to Page ${index + 1}`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-medium text-slate-600">{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
