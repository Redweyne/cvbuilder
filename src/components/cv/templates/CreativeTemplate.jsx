import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Instagram, Dribbble, Palette, Lightbulb, Star, Heart, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function CreativeTemplate({ data, forExport = false }) {
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

  const primaryColor = customization?.primary_color || '#ec4899';
  const secondaryColor = '#8b5cf6';
  const fontFamily = customization?.font_family || 'Poppins, sans-serif';

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
      className={`bg-white ${forExport ? '' : 'shadow-2xl rounded-3xl'} overflow-hidden`}
      style={{ 
        fontFamily,
        minHeight: forExport ? 'auto' : '1100px',
        maxWidth: '8.5in',
        margin: '0 auto'
      }}
    >
      <header 
        className="relative px-10 py-12 text-white overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="white" />
            <circle cx="140" cy="60" r="50" fill="white" />
            <circle cx="60" cy="140" r="40" fill="white" />
          </svg>
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white opacity-10"></div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase opacity-90">Creative Professional</span>
          </div>
          
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
            {personal_info.full_name || 'Your Name'}
          </h1>
          
          {personal_info.title && (
            <p className="text-xl font-light mb-6 opacity-90">
              {personal_info.title}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm">
            {personal_info.email && (
              <a href={`mailto:${personal_info.email}`} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">
                <Mail className="w-4 h-4" />
                {personal_info.email}
              </a>
            )}
            {personal_info.phone && (
              <a href={`tel:${personal_info.phone}`} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">
                <Phone className="w-4 h-4" />
                {personal_info.phone}
              </a>
            )}
            {personal_info.location && (
              <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <MapPin className="w-4 h-4" />
                {personal_info.location}
              </span>
            )}
            {personal_info.linkedin && (
              <a href={personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {personal_info.website && (
              <a href={personal_info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">
                <Globe className="w-4 h-4" />
                Portfolio
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="px-10 py-8 space-y-8">
        {personal_info.summary && (
          <section className="relative">
            <div 
              className="absolute -left-4 top-0 bottom-0 w-1 rounded-full"
              style={{ background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})` }}
            ></div>
            <h2 
              className="text-lg font-bold mb-3 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <Lightbulb className="w-5 h-5" />
              My Story
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              {personal_info.summary}
            </p>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 
              className="text-lg font-bold mb-5 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <Palette className="w-5 h-5" />
              My Superpowers
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skillCategory, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-2xl relative overflow-hidden group"
                  style={{ backgroundColor: `${index % 2 === 0 ? primaryColor : secondaryColor}08` }}
                >
                  <div 
                    className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -mr-10 -mt-10"
                    style={{ backgroundColor: index % 2 === 0 ? primaryColor : secondaryColor }}
                  ></div>
                  <h3 
                    className="font-bold text-sm mb-3"
                    style={{ color: index % 2 === 0 ? primaryColor : secondaryColor }}
                  >
                    {skillCategory.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(skillCategory.items || []).map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-2.5 py-1 text-xs rounded-full font-medium text-white"
                        style={{ 
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
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

        {experiences.length > 0 && (
          <section>
            <h2 
              className="text-lg font-bold mb-5 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <Star className="w-5 h-5" />
              Creative Journey
            </h2>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <article 
                  key={index}
                  className="relative pl-8"
                >
                  <div 
                    className="absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  >
                    {index + 1}
                  </div>
                  <div 
                    className="absolute left-[11px] top-8 bottom-0 w-0.5"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  ></div>
                  
                  <div className="pb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{exp.job_title}</h3>
                        <p 
                          className="font-semibold text-sm"
                          style={{ color: secondaryColor }}
                        >
                          {exp.company}
                          {exp.location && <span className="text-gray-400 font-normal"> • {exp.location}</span>}
                        </p>
                      </div>
                      <span 
                        className="text-xs font-semibold px-3 py-1.5 rounded-full text-white whitespace-nowrap"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                      >
                        {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                      </span>
                    </div>
                    
                    {exp.bullet_points && exp.bullet_points.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                          <li key={bpIndex} className="text-gray-600 text-sm flex gap-2">
                            <Heart className="w-3.5 h-3.5 mt-1 flex-shrink-0" style={{ color: primaryColor }} />
                            {bp}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {projects && projects.length > 0 && (
          <section>
            <h2 
              className="text-lg font-bold mb-5 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <Sparkles className="w-5 h-5" />
              Featured Work
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <div 
                  key={index}
                  className="p-5 rounded-2xl border-2 hover:shadow-lg transition-shadow"
                  style={{ borderColor: `${primaryColor}30` }}
                >
                  <h3 className="font-bold text-gray-900 mb-2">{project.name}</h3>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  )}
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
          {education.length > 0 && (
            <section>
              <h2 
                className="text-base font-bold mb-4"
                style={{ color: primaryColor }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-gray-500 text-sm">{edu.institution}</p>
                    <p className="text-xs" style={{ color: secondaryColor }}>{formatDate(edu.graduation_date)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-6">
            {certifications && certifications.length > 0 && (
              <section>
                <h2 
                  className="text-base font-bold mb-3"
                  style={{ color: primaryColor }}
                >
                  Certifications
                </h2>
                <ul className="space-y-1">
                  {certifications.map((cert, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-center gap-2">
                      <Star className="w-3 h-3" style={{ color: primaryColor }} />
                      {cert.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {languages && languages.length > 0 && (
              <section>
                <h2 
                  className="text-base font-bold mb-3"
                  style={{ color: primaryColor }}
                >
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-sm rounded-full text-white"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                      {lang.language}
                    </span>
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
