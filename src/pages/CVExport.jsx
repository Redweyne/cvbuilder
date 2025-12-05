import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CVTemplateRenderer from '@/components/cv/templates/CVTemplateRenderer';

export default function CVExport() {
  const [searchParams] = useSearchParams();
  const [cvData, setCvData] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const templateId = searchParams.get('template') || 'professional';
  const dataParam = searchParams.get('data');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(() => setFontsLoaded(true), 300);
      });
    } else {
      setTimeout(() => setFontsLoaded(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam));
        setCvData(decoded);
      } catch (e) {
        setError('Failed to parse CV data');
      }
    }
  }, [dataParam]);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!cvData || !fontsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
            }
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        `}
      </style>
      <div 
        id="cv-export-container"
        style={{
          width: '210mm',
          height: '297mm',
          maxHeight: '297mm',
          margin: '0 auto',
          padding: '0',
          backgroundColor: 'white',
          overflow: 'hidden',
          pageBreakAfter: 'avoid',
          pageBreakInside: 'avoid'
        }}
      >
        <CVTemplateRenderer data={cvData} templateId={templateId} forExport={true} />
      </div>
    </>
  );
}
