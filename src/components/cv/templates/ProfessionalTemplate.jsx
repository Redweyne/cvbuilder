import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar, Building2, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfessionalTemplate({ data, forExport = false }) {
  const {
    personal_info = {},
    experiences = [],
    education = [],
    skills = [],
    certifications = [],
    languages = [],
    projects = [],
    customization = {}
  } = data || {};

  const primaryColor = customization?.primary_color || '#1e40af';
  const fontFamily = customization?.font_family || 'Georgia, serif';

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
      className={`bg-white ${forExport ? '' : 'shadow-xl rounded-lg'} overflow-hidden`}
      style={{ 
        fontFamily,
        minHeight: forExport ? 'auto' : '1100px',
        maxWidth: '8.5in',
        margin: '0 auto'
      }}
    >
      <header 
        className="px-10 py-8"
        style={{ backgroundColor: primaryColor }}
      >
        <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
          {personal_info.full_name || 'Your Full Name'}
        </h1>
        {personal_info.title && (
          <p className="text-lg text-blue-100 font-medium mb-4">
            {personal_info.title}
          </p>
        )}
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">
          {personal_info.email && (
            <a href={`mailto:${personal_info.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              <span>{personal_info.email}</span>
            </a>
          )}
          {personal_info.phone && (
            <a href={`tel:${personal_info.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              <span>{personal_info.phone}</span>
            </a>
          )}
          {personal_info.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{personal_info.location}</span>
            </span>
          )}
          {personal_info.linkedin && (
            <a href={personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}
          {personal_info.website && (
            <a href={personal_info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
              <span>Portfolio</span>
            </a>
          )}
        </div>
      </header>

      <main className="px-10 py-8 space-y-7">
        {personal_info.summary && (
          <section>
            <h2 
              className="text-sm font-bold uppercase tracking-widest mb-3 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              {personal_info.summary}
            </p>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <h2 
              className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Professional Experience
            </h2>
            <div className="space-y-5">
              {experiences.map((exp, index) => (
                <article key={index} className="relative">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{exp.job_title}</h3>
                      <p className="text-gray-600 font-medium flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {exp.company}{exp.location && ` | ${exp.location}`}
                      </p>
                    </div>
                    <div 
                      className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap px-3 py-1 rounded"
                      style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 text-sm mb-2">{exp.description}</p>
                  )}
                  {exp.bullet_points && exp.bullet_points.length > 0 && (
                    <ul className="space-y-1.5 mt-2">
                      {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                        <li key={bpIndex} className="text-gray-700 text-sm pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full" style={{ '--before-bg': primaryColor }}>
                          <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
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
              className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <article key={index}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {edu.degree}{edu.field && ` in ${edu.field}`}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {edu.institution}{edu.location && ` | ${edu.location}`}
                      </p>
                    </div>
                    <span 
                      className="text-sm font-medium px-3 py-1 rounded whitespace-nowrap"
                      style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
                    >
                      {formatDate(edu.graduation_date)}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {edu.achievements.filter(a => a && a.trim()).map((achievement, aIndex) => (
                        <li key={aIndex} className="text-gray-700 text-sm pl-4 relative">
                          <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 
              className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Skills & Expertise
            </h2>
            <div className="space-y-3">
              {skills.map((skillCategory, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2">
                  <h3 className="font-semibold text-gray-800 text-sm min-w-[140px]">{skillCategory.category}:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(skillCategory.items || []).map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1 text-sm rounded-full border font-medium"
                        style={{ 
                          borderColor: primaryColor,
                          color: primaryColor,
                          backgroundColor: `${primaryColor}08`
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

        {certifications && certifications.length > 0 && (
          <section>
            <h2 
              className="text-sm font-bold uppercase tracking-widest mb-3 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Certifications
            </h2>
            <ul className="space-y-2">
              {certifications.map((cert, index) => (
                <li key={index} className="text-gray-700 text-sm flex justify-between">
                  <span className="font-medium">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-500">{cert.issuer}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {languages && languages.length > 0 && (
          <section>
            <h2 
              className="text-sm font-bold uppercase tracking-widest mb-3 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Languages
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 text-sm rounded border"
                  style={{ borderColor: `${primaryColor}40` }}
                >
                  <span className="font-medium text-gray-800">{lang.language}</span>
                  {lang.proficiency && (
                    <span className="text-gray-500 ml-1">({lang.proficiency})</span>
                  )}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
