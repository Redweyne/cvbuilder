import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProfessionalTemplate from '@/components/cv/templates/ProfessionalTemplate';
import MinimalTemplate from '@/components/cv/templates/MinimalTemplate';
import CreativeTemplate from '@/components/cv/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/cv/templates/ExecutiveTemplate';
import TechTemplate from '@/components/cv/templates/TechTemplate';
import AcademicTemplate from '@/components/cv/templates/AcademicTemplate';
import CompactTemplate from '@/components/cv/templates/CompactTemplate';
import ModernTemplate from '@/components/cv/templates/ModernTemplate';

const templates = {
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  tech: TechTemplate,
  academic: AcademicTemplate,
  compact: CompactTemplate,
  modern: ModernTemplate,
  designer: CreativeTemplate,
};

export default function CVExport() {
  const [searchParams] = useSearchParams();
  const [cvData, setCvData] = useState(null);
  const [error, setError] = useState(null);

  const templateId = searchParams.get('template') || 'professional';
  const dataParam = searchParams.get('data');

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

  if (!cvData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const TemplateComponent = templates[templateId] || templates.professional;

  return (
    <div 
      id="cv-export-container"
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0',
        padding: '0',
        backgroundColor: 'white',
      }}
    >
      <TemplateComponent data={cvData} forExport={true} />
    </div>
  );
}
