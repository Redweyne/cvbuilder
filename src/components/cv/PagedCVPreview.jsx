import React, { useRef, useEffect, useState } from 'react';
import CVTemplateRenderer from './templates/CVTemplateRenderer';

const A4_HEIGHT_PX = 1123;
const A4_WIDTH_PX = 794;

export default function PagedCVPreview({ data, templateId }) {
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setPageCount(Math.ceil(height / A4_HEIGHT_PX));
    }
  }, [data, templateId]);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const padding = 40;
        const availableWidth = containerWidth - padding;
        const newScale = Math.min(Math.max(availableWidth / A4_WIDTH_PX, 0.45), 1);
        setScale(newScale);
      }
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.target.scrollHeight;
        setPageCount(Math.ceil(height / A4_HEIGHT_PX));
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 w-full">
      {pageCount > 1 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Your CV will export as <strong>{pageCount} pages</strong>. Consider reducing content to fit one page.</span>
        </div>
      )}
      
      <div className="relative bg-slate-200 rounded-lg p-4 w-full flex flex-col items-center">
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <div key={pageIndex} className="relative mb-4 last:mb-0">
            {pageCount > 1 && (
              <div className="absolute -left-2 top-2 z-10">
                <span className="bg-slate-600 text-white text-xs px-2 py-1 rounded font-medium shadow">
                  {pageIndex + 1}
                </span>
              </div>
            )}
            
            <div
              className="bg-white shadow-lg rounded overflow-hidden"
              style={{
                width: A4_WIDTH_PX * scale,
                height: A4_HEIGHT_PX * scale
              }}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: A4_WIDTH_PX,
                  height: A4_HEIGHT_PX,
                  overflow: 'hidden'
                }}
              >
                <div
                  ref={pageIndex === 0 ? contentRef : undefined}
                  style={{
                    width: A4_WIDTH_PX,
                    marginTop: -pageIndex * A4_HEIGHT_PX
                  }}
                >
                  <CVTemplateRenderer data={data} templateId={templateId} forExport={true} />
                </div>
              </div>
            </div>
            
            {pageIndex < pageCount - 1 && (
              <div className="flex items-center justify-center mt-3 mb-1">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-500 border border-slate-300">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Page break
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
