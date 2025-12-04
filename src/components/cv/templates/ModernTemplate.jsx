import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Sparkles, Code2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ModernTemplate({ data, forExport = false }) {
  const {
    personal_info = {},
    experiences = [],
    education = [],
    skills = [],
    certifications = [],
    languages = [],
    customization = {}
  } = data || {};

  const primaryColor = customization?.primary_color || '#6366f1';
  const fontFamily = customization?.font_family || 'Inter, system-ui, sans-serif';

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
      className={`bg-white ${forExport ? '' : 'shadow-xl rounded-2xl'} overflow-hidden`}
      style={{ 
        fontFamily,
        minHeight: forExport ? 'auto' : '1100px',
        maxWidth: '8.5in',
        margin: '0 auto'
      }}
    >
      <header className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}aa 50%, ${primaryColor}55 100%)`
          }}
        ></div>
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ backgroundColor: primaryColor }}
        ></div>
        <div 
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
          style={{ backgroundColor: primaryColor }}
        ></div>
        
        <div className="relative px-10 py-10">
          <div className="flex items-start gap-6">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)` 
              }}
            >
              {(personal_info.full_name || 'YN').split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {personal_info.full_name || 'Your Name'}
              </h1>
              {personal_info.title && (
                <p 
                  className="text-lg font-medium mb-4"
                  style={{ color: primaryColor }}
                >
                  {personal_info.title}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {personal_info.email && (
                  <a href={`mailto:${personal_info.email}`} className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    </div>
                    {personal_info.email}
                  </a>
                )}
                {personal_info.phone && (
                  <a href={`tel:${personal_info.phone}`} className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    </div>
                    {personal_info.phone}
                  </a>
                )}
                {personal_info.location && (
                  <span className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                      <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    </div>
                    {personal_info.location}
                  </span>
                )}
                {personal_info.linkedin && (
                  <a href={personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Linkedin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    </div>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-10 py-8 space-y-8">
        {personal_info.summary && (
          <section 
            className="p-5 rounded-xl border-l-4"
            style={{ 
              backgroundColor: `${primaryColor}08`,
              borderColor: primaryColor
            }}
          >
            <h2 className="text-sm font-bold uppercase tracking-wide mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
              <Sparkles className="w-4 h-4" />
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {personal_info.summary}
            </p>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide mb-5 flex items-center gap-2" style={{ color: primaryColor }}>
              <Briefcase className="w-4 h-4" />
              Work Experience
            </h2>
            <div className="space-y-5">
              {experiences.map((exp, index) => (
                <article 
                  key={index} 
                  className="relative pl-6 border-l-2 pb-5 last:pb-0"
                  style={{ borderColor: `${primaryColor}30` }}
                >
                  <div 
                    className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{exp.job_title}</h3>
                      <p className="font-medium" style={{ color: primaryColor }}>{exp.company}</p>
                      {exp.location && (
                        <p className="text-gray-500 text-sm">{exp.location}</p>
                      )}
                    </div>
                    <span 
                      className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                    </span>
                  </div>
                  
                  {exp.bullet_points && exp.bullet_points.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                        <li key={bpIndex} className="text-gray-600 text-sm leading-relaxed flex gap-2">
                          <span 
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: primaryColor }}
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

        <div className="grid sm:grid-cols-2 gap-8">
          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                <GraduationCap className="w-4 h-4" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <article 
                    key={index}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: `${primaryColor}05` }}
                  >
                    <h3 className="font-bold text-gray-900 text-sm">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600 text-sm">{edu.institution}</p>
                    <p className="text-xs mt-1" style={{ color: primaryColor }}>{formatDate(edu.graduation_date)}</p>
                    {edu.gpa && (
                      <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide mb-4 flex items-center gap-2" style={{ color: primaryColor }}>
                <Code2 className="w-4 h-4" />
                Skills
              </h2>
              <div className="space-y-4">
                {skills.map((skillCategory, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{skillCategory.category}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {(skillCategory.items || []).map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-2.5 py-1 text-xs rounded-full font-medium"
                          style={{ 
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {(certifications?.length > 0 || languages?.length > 0) && (
          <div className="grid sm:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
            {certifications && certifications.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: primaryColor }}>
                  Certifications
                </h2>
                <ul className="space-y-1.5">
                  {certifications.map((cert, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                      {cert.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {languages && languages.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: primaryColor }}>
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-sm rounded-lg border"
                      style={{ borderColor: `${primaryColor}30` }}
                    >
                      {lang.language}
                      {lang.proficiency && <span className="text-gray-400 ml-1">({lang.proficiency})</span>}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
