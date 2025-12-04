import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { format } from 'date-fns';

export default function CompactTemplate({ data, forExport = false }) {
  const {
    personal_info = {},
    experiences = [],
    education = [],
    skills = [],
    certifications = [],
    languages = [],
    customization = {}
  } = data || {};

  const primaryColor = customization?.primary_color || '#1f2937';
  const accentColor = '#3b82f6';
  const fontFamily = customization?.font_family || 'Arial, Helvetica, sans-serif';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr + '-01'), 'MM/yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      className={`bg-white ${forExport ? '' : 'shadow-lg rounded-lg'} overflow-hidden`}
      style={{ 
        fontFamily,
        minHeight: forExport ? 'auto' : '1100px',
        maxWidth: '8.5in',
        margin: '0 auto',
        fontSize: '11px',
        lineHeight: '1.4'
      }}
    >
      <header 
        className="px-6 py-4 border-b-2"
        style={{ borderColor: accentColor }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
          <div>
            <h1 
              className="text-2xl font-bold tracking-tight"
              style={{ color: primaryColor }}
            >
              {personal_info.full_name || 'Your Name'}
            </h1>
            {personal_info.title && (
              <p className="text-sm font-medium" style={{ color: accentColor }}>
                {personal_info.title}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            {personal_info.email && (
              <a href={`mailto:${personal_info.email}`} className="flex items-center gap-1 hover:text-gray-900">
                <Mail className="w-3 h-3" />
                {personal_info.email}
              </a>
            )}
            {personal_info.phone && (
              <a href={`tel:${personal_info.phone}`} className="flex items-center gap-1 hover:text-gray-900">
                <Phone className="w-3 h-3" />
                {personal_info.phone}
              </a>
            )}
            {personal_info.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {personal_info.location}
              </span>
            )}
            {personal_info.linkedin && (
              <a href={personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-900">
                <Linkedin className="w-3 h-3" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="px-6 py-4 space-y-4">
        {personal_info.summary && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: accentColor }}
            >
              Summary
            </h2>
            <p className="text-gray-700 text-xs leading-snug">
              {personal_info.summary}
            </p>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: accentColor }}
            >
              Core Competencies
            </h2>
            <div className="space-y-1.5">
              {skills.map((skillCategory, index) => (
                <div key={index} className="flex gap-2 text-xs">
                  <span className="font-semibold text-gray-800 min-w-[100px]">{skillCategory.category}:</span>
                  <span className="text-gray-600">{(skillCategory.items || []).join(' | ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: accentColor }}
            >
              Professional Experience
            </h2>
            <div className="space-y-3">
              {experiences.map((exp, index) => (
                <article key={index}>
                  <div className="flex justify-between items-start gap-2 mb-0.5">
                    <div className="flex-1">
                      <span className="font-bold text-gray-900">{exp.job_title}</span>
                      <span className="text-gray-600"> | {exp.company}</span>
                      {exp.location && <span className="text-gray-500"> | {exp.location}</span>}
                    </div>
                    <span 
                      className="text-xs font-semibold whitespace-nowrap"
                      style={{ color: accentColor }}
                    >
                      {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.bullet_points && exp.bullet_points.length > 0 && (
                    <ul className="mt-1 space-y-0.5 ml-2">
                      {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                        <li key={bpIndex} className="text-gray-700 text-xs pl-2 relative">
                          <span className="absolute left-0">•</span>
                          {bp}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {education.length > 0 && (
            <section>
              <h2 
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: accentColor }}
              >
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <article key={index}>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs">
                          {edu.degree}{edu.field && `, ${edu.field}`}
                        </h3>
                        <p className="text-gray-600 text-xs">{edu.institution}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(edu.graduation_date)}
                      </span>
                    </div>
                    {edu.gpa && (
                      <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-3">
            {certifications && certifications.length > 0 && (
              <section>
                <h2 
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: accentColor }}
                >
                  Certifications
                </h2>
                <ul className="space-y-0.5">
                  {certifications.map((cert, index) => (
                    <li key={index} className="text-gray-700 text-xs">
                      {cert.name}{cert.issuer && ` (${cert.issuer})`}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {languages && languages.length > 0 && (
              <section>
                <h2 
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: accentColor }}
                >
                  Languages
                </h2>
                <p className="text-xs text-gray-700">
                  {languages.map((lang, index) => (
                    <span key={index}>
                      {lang.language}{lang.proficiency && ` (${lang.proficiency})`}
                      {index < languages.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
