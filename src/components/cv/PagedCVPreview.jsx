import React, { useRef, useEffect, useState } from 'react';
import CVTemplateRenderer from './templates/CVTemplateRenderer';

const A4_HEIGHT_PX = 1123;
const A4_WIDTH_PX = 794;

export default function PagedCVPreview({ data, templateId }) {
  const contentRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
      setPageCount(Math.ceil(height / A4_HEIGHT_PX));
    }
  }, [data, templateId]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.target.scrollHeight;
        setContentHeight(height);
        setPageCount(Math.ceil(height / A4_HEIGHT_PX));
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scale = 0.5;

  return (
    <div className="flex flex-col items-center gap-4">
      {pageCount > 1 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Your CV will export as <strong>{pageCount} pages</strong>. Consider reducing content to fit one page.</span>
        </div>
      )}
      
      <div 
        className="relative bg-slate-200 rounded-lg overflow-hidden"
        style={{
          width: A4_WIDTH_PX * scale + 40,
          padding: '20px'
        }}
      >
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <div key={pageIndex} className="relative mb-4 last:mb-0">
            {pageCount > 1 && (
              <div className="absolute -left-1 top-0 bottom-0 flex items-start">
                <span className="bg-slate-500 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
                  {pageIndex + 1}
                </span>
              </div>
            )}
            
            <div
              className="bg-white shadow-lg overflow-hidden"
              style={{
                width: A4_WIDTH_PX * scale,
                height: A4_HEIGHT_PX * scale,
                marginLeft: pageCount > 1 ? '20px' : '0'
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
              <div className="absolute -bottom-2 left-0 right-0 flex items-center justify-center">
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
