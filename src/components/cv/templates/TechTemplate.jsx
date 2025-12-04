import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Github, Terminal, Cpu, Database, Cloud, Code, Layers, Server, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function TechTemplate({ data, forExport = false }) {
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

  const primaryColor = customization?.primary_color || '#10b981';
  const bgDark = '#0f172a';
  const fontFamily = customization?.font_family || 'JetBrains Mono, Fira Code, monospace';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr + '-01'), 'MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const getSkillIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('language') || cat.includes('programming')) return Code;
    if (cat.includes('framework') || cat.includes('library')) return Layers;
    if (cat.includes('database') || cat.includes('data')) return Database;
    if (cat.includes('cloud') || cat.includes('devops')) return Cloud;
    if (cat.includes('tool') || cat.includes('platform')) return Server;
    return Cpu;
  };

  return (
    <div 
      className={`${forExport ? '' : 'shadow-2xl rounded-xl'} overflow-hidden`}
      style={{ 
        fontFamily,
        minHeight: forExport ? 'auto' : '1100px',
        maxWidth: '8.5in',
        margin: '0 auto',
        backgroundColor: '#ffffff'
      }}
    >
      <header 
        className="px-8 py-8 text-white relative overflow-hidden"
        style={{ backgroundColor: bgDark }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 text-xs mb-4 font-mono" style={{ color: primaryColor }}>
            <Terminal className="w-4 h-4" />
            <span>~/resume/</span>
            <span className="animate-pulse">|</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-1 tracking-tight">
            <span style={{ color: primaryColor }}>&lt;</span>
            {personal_info.full_name || 'Developer Name'}
            <span style={{ color: primaryColor }}>/&gt;</span>
          </h1>
          
          {personal_info.title && (
            <p className="text-lg text-gray-300 mb-5 font-normal">
              {personal_info.title}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {personal_info.email && (
              <a href={`mailto:${personal_info.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors font-mono">
                <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                {personal_info.email}
              </a>
            )}
            {personal_info.phone && (
              <a href={`tel:${personal_info.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors font-mono">
                <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                {personal_info.phone}
              </a>
            )}
            {personal_info.location && (
              <span className="flex items-center gap-1.5 font-mono">
                <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                {personal_info.location}
              </span>
            )}
            {personal_info.linkedin && (
              <a href={personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" style={{ color: primaryColor }} />
                LinkedIn
              </a>
            )}
            {personal_info.website && (
              <a href={personal_info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Globe className="w-4 h-4" style={{ color: primaryColor }} />
                Portfolio
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="p-8 space-y-7 bg-white">
        {personal_info.summary && (
          <section className="p-4 rounded-lg border-l-4 bg-gray-50" style={{ borderColor: primaryColor }}>
            <div className="flex items-center gap-2 mb-2 text-xs font-mono" style={{ color: primaryColor }}>
              <span>/**</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm pl-3">
              * {personal_info.summary}
            </p>
            <div className="text-xs font-mono mt-2" style={{ color: primaryColor }}>
              <span>*/</span>
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2 font-mono">
              <Cpu className="w-4 h-4" style={{ color: primaryColor }} />
              <span style={{ color: primaryColor }}>const</span>
              <span className="text-gray-800">techStack</span>
              <span className="text-gray-400">=</span>
              <span className="text-gray-400">{"{"}</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 pl-4">
              {skills.map((skillCategory, index) => {
                const SkillIcon = getSkillIcon(skillCategory.category);
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2">
                      <SkillIcon className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                      <span className="text-gray-600">{skillCategory.category}</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {(skillCategory.items || []).map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-2 py-0.5 text-xs rounded font-mono"
                          style={{ 
                            backgroundColor: `${primaryColor}20`,
                            color: '#047857'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-sm font-mono text-gray-400 mt-2">{"}"}</div>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2 font-mono">
              <Zap className="w-4 h-4" style={{ color: primaryColor }} />
              <span style={{ color: primaryColor }}>async function</span>
              <span className="text-gray-800">workExperience</span>
              <span className="text-gray-400">()</span>
            </h2>
            <div className="space-y-5">
              {experiences.map((exp, index) => (
                <article 
                  key={index}
                  className="relative pl-5 border-l-2 border-dashed"
                  style={{ borderColor: `${primaryColor}50` }}
                >
                  <div 
                    className="absolute -left-1.5 top-0 w-3 h-3 rounded-sm rotate-45"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.job_title}</h3>
                      <p style={{ color: primaryColor }} className="font-medium text-sm">
                        @{exp.company}
                        {exp.location && <span className="text-gray-500"> • {exp.location}</span>}
                      </p>
                    </div>
                    <span 
                      className="text-xs font-mono px-2 py-1 rounded whitespace-nowrap"
                      style={{ backgroundColor: bgDark, color: primaryColor }}
                    >
                      {formatDate(exp.start_date)} → {exp.is_current ? 'now' : formatDate(exp.end_date)}
                    </span>
                  </div>
                  
                  {exp.bullet_points && exp.bullet_points.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                        <li key={bpIndex} className="text-gray-600 text-sm flex gap-2">
                          <span style={{ color: primaryColor }} className="font-mono">→</span>
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
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4" style={{ color: primaryColor }} />
              <span style={{ color: primaryColor }}>const</span>
              <span className="text-gray-800">projects</span>
              <span className="text-gray-400">=</span>
              <span className="text-gray-400">[</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 pl-4">
              {projects.map((project, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
                >
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{project.name}</h3>
                  {project.description && (
                    <p className="text-gray-600 text-xs mb-2">{project.description}</p>
                  )}
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="text-xs px-1.5 py-0.5 rounded font-mono"
                          style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm font-mono text-gray-400 mt-2">]</div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold mb-3 flex items-center gap-2 font-mono">
                <span style={{ color: primaryColor }}>//</span>
                <span className="text-gray-800">Education</span>
              </h2>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600 text-xs">{edu.institution}</p>
                    <p className="text-xs font-mono" style={{ color: primaryColor }}>
                      {formatDate(edu.graduation_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold mb-3 flex items-center gap-2 font-mono">
                <span style={{ color: primaryColor }}>//</span>
                <span className="text-gray-800">Certifications</span>
              </h2>
              <ul className="space-y-1.5">
                {certifications.map((cert, index) => (
                  <li key={index} className="text-gray-700 text-sm flex items-center gap-2">
                    <span style={{ color: primaryColor }}>✓</span>
                    {cert.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
