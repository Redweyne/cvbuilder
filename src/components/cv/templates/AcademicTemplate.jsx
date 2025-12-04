import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, BookOpen, Award, FileText, Users, Microscope, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

export default function AcademicTemplate({ data, forExport = false }) {
  const {
    personal_info = {},
    experiences = [],
    education = [],
    skills = [],
    certifications = [],
    languages = [],
    projects = [],
    publications = [],
    customization = {}
  } = data || {};

  const primaryColor = customization?.primary_color || '#7c3aed';
  const fontFamily = customization?.font_family || 'Times New Roman, serif';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr + '-01'), 'MMMM yyyy');
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
      <header className="px-12 py-10 text-center border-b-4" style={{ borderColor: primaryColor }}>
        <h1 
          className="text-3xl font-bold tracking-wide mb-2"
          style={{ color: primaryColor }}
        >
          {personal_info.full_name || 'Your Name'}
        </h1>
        
        {personal_info.title && (
          <p className="text-lg text-gray-600 mb-1">{personal_info.title}</p>
        )}
        
        {personal_info.department && (
          <p className="text-gray-500 italic mb-4">{personal_info.department}</p>
        )}
        
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-gray-600">
          {personal_info.email && (
            <a href={`mailto:${personal_info.email}`} className="flex items-center gap-1.5 hover:underline">
              <Mail className="w-4 h-4" style={{ color: primaryColor }} />
              {personal_info.email}
            </a>
          )}
          {personal_info.phone && (
            <a href={`tel:${personal_info.phone}`} className="flex items-center gap-1.5 hover:underline">
              <Phone className="w-4 h-4" style={{ color: primaryColor }} />
              {personal_info.phone}
            </a>
          )}
          {personal_info.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
              {personal_info.location}
            </span>
          )}
          {personal_info.website && (
            <a href={personal_info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline">
              <Globe className="w-4 h-4" style={{ color: primaryColor }} />
              Academic Profile
            </a>
          )}
        </div>
      </header>

      <main className="px-12 py-8 space-y-8">
        {personal_info.summary && (
          <section>
            <h2 
              className="text-base font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Research Interests & Statement
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {personal_info.summary}
            </p>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 
              className="text-base font-bold uppercase tracking-widest mb-4 pb-2 border-b-2 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <GraduationCap className="w-5 h-5" />
              Education
            </h2>
            <div className="space-y-5">
              {education.map((edu, index) => (
                <article key={index} className="relative pl-5 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                  <div 
                    className="absolute -left-1.5 top-1 w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {edu.degree}{edu.field && ` in ${edu.field}`}
                      </h3>
                      <p className="text-gray-600 italic">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                      {edu.thesis && (
                        <p className="text-gray-600 text-sm mt-1">
                          <span className="font-semibold">Thesis:</span> "{edu.thesis}"
                        </p>
                      )}
                      {edu.advisor && (
                        <p className="text-gray-600 text-sm">
                          <span className="font-semibold">Advisor:</span> {edu.advisor}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                      {formatDate(edu.graduation_date)}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {edu.achievements.filter(a => a && a.trim()).map((achievement, aIndex) => (
                        <li key={aIndex} className="text-gray-600 text-sm pl-4 relative">
                          <span className="absolute left-0">•</span>
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

        {publications && publications.length > 0 && (
          <section>
            <h2 
              className="text-base font-bold uppercase tracking-widest mb-4 pb-2 border-b-2 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <FileText className="w-5 h-5" />
              Publications
            </h2>
            <ol className="space-y-3 list-decimal list-inside">
              {publications.map((pub, index) => (
                <li key={index} className="text-gray-700 text-sm leading-relaxed">
                  {pub.authors && <span>{pub.authors}. </span>}
                  {pub.title && <span className="font-semibold">"{pub.title}." </span>}
                  {pub.journal && <span className="italic">{pub.journal}</span>}
                  {pub.year && <span>, {pub.year}</span>}
                  {pub.doi && <span className="text-xs text-gray-500"> DOI: {pub.doi}</span>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <h2 
              className="text-base font-bold uppercase tracking-widest mb-4 pb-2 border-b-2 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <Microscope className="w-5 h-5" />
              Research & Professional Experience
            </h2>
            <div className="space-y-5">
              {experiences.map((exp, index) => (
                <article key={index}>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.job_title}</h3>
                      <p className="text-gray-600 italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
                    </div>
                    <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                      {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 text-sm mb-2">{exp.description}</p>
                  )}
                  {exp.bullet_points && exp.bullet_points.length > 0 && (
                    <ul className="space-y-1">
                      {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                        <li key={bpIndex} className="text-gray-700 text-sm pl-4 relative">
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

        {projects && projects.length > 0 && (
          <section>
            <h2 
              className="text-base font-bold uppercase tracking-widest mb-4 pb-2 border-b-2 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <BookOpen className="w-5 h-5" />
              Research Projects & Grants
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  {project.role && <p className="text-gray-600 text-sm italic">{project.role}</p>}
                  {project.description && (
                    <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                  )}
                  {project.funding && (
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-semibold">Funding:</span> {project.funding}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          {skills.length > 0 && (
            <section>
              <h2 
                className="text-base font-bold uppercase tracking-widest mb-4 pb-2 border-b-2"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                Skills & Methodologies
              </h2>
              <div className="space-y-3">
                {skills.map((skillCategory, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">{skillCategory.category}</h3>
                    <p className="text-gray-600 text-sm">
                      {(skillCategory.items || []).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-6">
            {certifications && certifications.length > 0 && (
              <section>
                <h2 
                  className="text-base font-bold uppercase tracking-widest mb-3 pb-2 border-b-2 flex items-center gap-2"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  <Award className="w-5 h-5" />
                  Awards & Honors
                </h2>
                <ul className="space-y-1.5">
                  {certifications.map((cert, index) => (
                    <li key={index} className="text-gray-700 text-sm">
                      <span className="font-medium">{cert.name}</span>
                      {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
                      {cert.date && <span className="text-gray-500">, {cert.date}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {languages && languages.length > 0 && (
              <section>
                <h2 
                  className="text-base font-bold uppercase tracking-widest mb-3 pb-2 border-b-2"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  Languages
                </h2>
                <div className="space-y-1">
                  {languages.map((lang, index) => (
                    <p key={index} className="text-gray-700 text-sm">
                      <span className="font-medium">{lang.language}</span>
                      {lang.proficiency && <span className="text-gray-500"> — {lang.proficiency}</span>}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
