import React from 'react';
import ProfessionalTemplate from './ProfessionalTemplate';
import MinimalTemplate from './MinimalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import ModernTemplate from './ModernTemplate';
import TechTemplate from './TechTemplate';
import CreativeTemplate from './CreativeTemplate';
import AcademicTemplate from './AcademicTemplate';
import CompactTemplate from './CompactTemplate';

const templates = {
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  modern: ModernTemplate,
  tech: TechTemplate,
  creative: CreativeTemplate,
  academic: AcademicTemplate,
  compact: CompactTemplate,
  designer: CreativeTemplate,
};

export default function CVTemplateRenderer({ data, templateId = 'professional', forExport = false }) {
  const TemplateComponent = templates[templateId] || templates.professional;
  
  return (
    <TemplateComponent 
      data={data} 
      forExport={forExport}
    />
  );
}

export { templates };
