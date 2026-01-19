import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CVTemplateRenderer, { templates as templateMap } from '@/components/cv/templates/CVTemplateRenderer';
import sampleCvData from '@/data/sampleCvData';

const formatTemplateLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export default function TemplatePreview() {
  const [searchParams] = useSearchParams();
  const rawTemplateId = searchParams.get('template') || 'professional';
  const templateId = templateMap[rawTemplateId] ? rawTemplateId : 'professional';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Template Preview: {formatTemplateLabel(templateId)}
          </h1>
          <p className="text-slate-600">Preview with sample CV data</p>
        </div>

        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <CVTemplateRenderer data={sampleCvData} templateId={templateId} forExport={false} />
        </div>
      </div>
    </div>
  );
}
