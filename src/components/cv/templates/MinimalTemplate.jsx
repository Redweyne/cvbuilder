import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { format } from 'date-fns';

export default function MinimalTemplate({ data, forExport = false }) {
  const {
    personal_info = {},
    experiences = [],
    education = [],
    skills = [],
    certifications = [],
    languages = [],
    customization = {}
  } = data || {};

  const primaryColor = customization?.primary_color || '#111827';
  const fontFamily = customization?.font_family || 'system-ui, -apple-system, sans-serif';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr + '-01'), 'MMM yyyy');
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
        margin: '0 auto'
      }}
    >
      <div className="px-12 py-10">
        <header className="text-center mb-10 pb-8 border-b border-gray-200">
          <h1 
            className="text-4xl font-light tracking-wide mb-2"
            style={{ color: primaryColor }}
          >
            {personal_info.full_name || 'Your Name'}
          </h1>
          {personal_info.title && (
            <p className="text-lg text-gray-500 font-light tracking-wide mb-5">
              {personal_info.title}
            </p>
          )}
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            {personal_info.email && (
              <a href={`mailto:${personal_info.email}`} className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                <Mail className="w-4 h-4" />
                {personal_info.email}
              </a>
            )}
            {personal_info.phone && (
              <a href={`tel:${personal_info.phone}`} className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                <Phone className="w-4 h-4" />
                {personal_info.phone}
              </a>
            )}
            {personal_info.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {personal_info.location}
              </span>
            )}
            {personal_info.linkedin && (
              <a href={personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {personal_info.website && (
              <a href={personal_info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                <Globe className="w-4 h-4" />
                Portfolio
              </a>
            )}
          </div>
        </header>

        <main className="space-y-8">
          {personal_info.summary && (
            <section>
              <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto italic">
                "{personal_info.summary}"
              </p>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <h2 
                className="text-xs font-semibold uppercase tracking-[0.3em] mb-6 text-center"
                style={{ color: primaryColor }}
              >
                Experience
              </h2>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <article key={index} className="border-l-2 border-gray-200 pl-6 relative">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-gray-400"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{exp.job_title}</h3>
                        <p className="text-gray-500 text-sm">{exp.company}{exp.location && ` — ${exp.location}`}</p>
                      </div>
                      <span className="text-sm text-gray-400 font-light whitespace-nowrap">
                        {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                      </span>
                    </div>
                    {exp.bullet_points && exp.bullet_points.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                          <li key={bpIndex} className="text-gray-600 text-sm leading-relaxed">
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

          {education.length > 0 && (
            <section>
              <h2 
                className="text-xs font-semibold uppercase tracking-[0.3em] mb-6 text-center"
                style={{ color: primaryColor }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <article key={index} className="text-center">
                    <h3 className="font-medium text-gray-900">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {edu.institution}{edu.location && ` — ${edu.location}`}
                    </p>
                    <p className="text-gray-400 text-sm">{formatDate(edu.graduation_date)}</p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-500 mt-1">GPA: {edu.gpa}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 
                className="text-xs font-semibold uppercase tracking-[0.3em] mb-6 text-center"
                style={{ color: primaryColor }}
              >
                Skills
              </h2>
              <div className="text-center">
                {skills.map((skillCategory, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <span className="text-gray-500 text-sm">{skillCategory.category}: </span>
                    <span className="text-gray-700 text-sm">
                      {(skillCategory.items || []).join(' · ')}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <h2 
                className="text-xs font-semibold uppercase tracking-[0.3em] mb-4 text-center"
                style={{ color: primaryColor }}
              >
                Certifications
              </h2>
              <div className="text-center space-y-1">
                {certifications.map((cert, index) => (
                  <p key={index} className="text-gray-600 text-sm">
                    {cert.name}{cert.issuer && ` — ${cert.issuer}`}
                  </p>
                ))}
              </div>
            </section>
          )}

          {languages && languages.length > 0 && (
            <section>
              <h2 
                className="text-xs font-semibold uppercase tracking-[0.3em] mb-4 text-center"
                style={{ color: primaryColor }}
              >
                Languages
              </h2>
              <p className="text-center text-gray-600 text-sm">
                {languages.map((lang, index) => (
                  <span key={index}>
                    {lang.language}{lang.proficiency && ` (${lang.proficiency})`}
                    {index < languages.length - 1 && ' · '}
                  </span>
                ))}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
