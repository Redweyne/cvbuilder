import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Award, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function ExecutiveTemplate({ data, forExport = false }) {
  const {
    personal_info = {},
    experiences = [],
    education = [],
    skills = [],
    certifications = [],
    languages = [],
    customization = {}
  } = data || {};

  const primaryColor = customization?.primary_color || '#1c1917';
  const accentColor = '#b45309';
  const fontFamily = customization?.font_family || 'Palatino Linotype, Book Antiqua, Palatino, serif';

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
      className={`bg-white ${forExport ? '' : 'shadow-2xl rounded-lg'} overflow-hidden`}
      style={{ 
        fontFamily,
        minHeight: forExport ? 'auto' : '1100px',
        maxWidth: '8.5in',
        margin: '0 auto'
      }}
    >
      <div className="flex">
        <aside 
          className="w-1/3 p-8 text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold leading-tight mb-2">
              {personal_info.full_name || 'Your Name'}
            </h1>
            {personal_info.title && (
              <p className="text-amber-400 font-medium text-sm tracking-wide uppercase">
                {personal_info.title}
              </p>
            )}
          </div>

          <div className="space-y-4 mb-10">
            {personal_info.email && (
              <a href={`mailto:${personal_info.email}`} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm">
                <Mail className="w-4 h-4 text-amber-500" />
                <span className="break-all">{personal_info.email}</span>
              </a>
            )}
            {personal_info.phone && (
              <a href={`tel:${personal_info.phone}`} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>{personal_info.phone}</span>
              </a>
            )}
            {personal_info.location && (
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>{personal_info.location}</span>
              </div>
            )}
            {personal_info.linkedin && (
              <a href={personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm">
                <Linkedin className="w-4 h-4 text-amber-500" />
                <span>LinkedIn Profile</span>
              </a>
            )}
          </div>

          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Core Competencies
              </h2>
              <div className="space-y-3">
                {skills.map((skillCategory, index) => (
                  <div key={index}>
                    <h3 className="text-xs text-amber-300 uppercase tracking-wide mb-2">{skillCategory.category}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {(skillCategory.items || []).map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-white text-sm leading-snug">
                      {edu.degree}
                    </h3>
                    {edu.field && (
                      <p className="text-gray-400 text-xs">{edu.field}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">{edu.institution}</p>
                    <p className="text-amber-500 text-xs">{formatDate(edu.graduation_date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
                Certifications
              </h2>
              <ul className="space-y-2">
                {certifications.map((cert, index) => (
                  <li key={index} className="text-gray-300 text-xs">
                    {cert.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
                Languages
              </h2>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-gray-300">{lang.language}</span>
                    <span className="text-amber-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="w-2/3 p-8">
          {personal_info.summary && (
            <section className="mb-8">
              <h2 
                className="text-sm font-bold uppercase tracking-widest mb-3 pb-2 border-b-2 flex items-center gap-2"
                style={{ color: primaryColor, borderColor: accentColor }}
              >
                <TrendingUp className="w-4 h-4" style={{ color: accentColor }} />
                Executive Profile
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                {personal_info.summary}
              </p>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <h2 
                className="text-sm font-bold uppercase tracking-widest mb-5 pb-2 border-b-2"
                style={{ color: primaryColor, borderColor: accentColor }}
              >
                Professional Experience
              </h2>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <article key={index}>
                    <div className="mb-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                        <h3 className="font-bold text-gray-900">{exp.job_title}</h3>
                        <span 
                          className="text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap"
                          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                        >
                          {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm font-medium" style={{ color: accentColor }}>
                        {exp.company}{exp.location && ` | ${exp.location}`}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-sm mb-2 italic">{exp.description}</p>
                    )}
                    {exp.bullet_points && exp.bullet_points.length > 0 && (
                      <ul className="space-y-1.5">
                        {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                          <li key={bpIndex} className="text-gray-700 text-sm pl-4 relative">
                            <span 
                              className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: accentColor }}
                            ></span>
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
        </main>
      </div>
    </div>
  );
}
