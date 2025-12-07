import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Star, Target, User, Languages, Calendar, Building2, Camera } from 'lucide-react';
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

  const primaryColor = customization?.primary_color || '#1a1a2e';
  const accentColor = customization?.accent_color || '#6366f1';
  const accentLight = '#818cf8';
  const accentGlow = '#a5b4fc';
  const headerFont = customization?.font_family || "'Cormorant Garamond', 'Playfair Display', Georgia, serif";
  const bodyFont = "'Inter', 'Segoe UI', -apple-system, sans-serif";

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr + '-01'), 'MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const getProficiencyWidth = (proficiency) => {
    const levels = {
      'Native': 100,
      'Fluent': 100,
      'Advanced': 90,
      'Proficient': 80,
      'Intermediate': 65,
      'Elementary': 45,
      'Basic': 25
    };
    return levels[proficiency] || 60;
  };

  const firstName = personal_info.full_name?.split(' ')[0] || 'Your';
  const lastName = personal_info.full_name?.split(' ').slice(1).join(' ') || 'Name';

  return (
    <div 
      className={`bg-white ${forExport ? '' : 'shadow-2xl'}`}
      style={{ 
        fontFamily: bodyFont,
        minHeight: '297mm',
        width: '210mm',
        maxWidth: '210mm',
        margin: '0 auto',
        fontSize: '9px',
        lineHeight: '1.4'
      }}
    >
      {/* Use CSS Grid for proper two-column layout */}
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: '200px 1fr',
          minHeight: '297mm'
        }}
      >
        {/* LEFT SIDEBAR */}
        <aside 
          className="relative"
          style={{ 
            background: `linear-gradient(175deg, #1e1e3f 0%, ${primaryColor} 30%, #12122a 100%)`
          }}
        >
          {/* Subtle texture */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Glow effects */}
          <div 
            className="absolute -top-20 -right-20 w-40 h-40 opacity-15"
            style={{
              background: `radial-gradient(circle, ${accentColor}50, transparent 60%)`,
            }}
          />
          
          <div className="relative z-10" style={{ padding: '16px' }}>
            {/* PHOTO + NAME HEADER */}
            <div className="text-center mb-3">
              {/* Photo placeholder */}
              <div className="mb-2">
                {personal_info.photo_url ? (
                  <img 
                    src={personal_info.photo_url} 
                    alt={personal_info.full_name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                    style={{ 
                      border: `3px solid ${accentColor}`,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 0 4px rgba(255,255,255,0.1)`
                    }}
                  />
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
                      border: `3px solid ${accentColor}50`,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.2)`
                    }}
                  >
                    <User className="w-7 h-7 text-white/60" />
                  </div>
                )}
              </div>
              
              {/* Name */}
              <h1 
                className="text-white leading-tight"
                style={{ 
                  fontFamily: headerFont,
                  fontSize: '22px',
                  fontWeight: '600',
                  letterSpacing: '0.02em'
                }}
              >
                {firstName}
              </h1>
              <h2 
                className="text-white/75 mt-1"
                style={{ 
                  fontFamily: headerFont,
                  fontSize: '18px',
                  fontWeight: '400',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                {lastName}
              </h2>
              
              {/* Title */}
              {personal_info.title && (
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="h-px w-8 bg-white/20"></div>
                    <div className="w-1.5 h-1.5 rotate-45 bg-amber-400"></div>
                    <div className="h-px w-8 bg-white/20"></div>
                  </div>
                  <p 
                    className="text-[9px] font-semibold tracking-[0.2em] uppercase px-2"
                    style={{ color: accentLight }}
                  >
                    {personal_info.title}
                  </p>
                </div>
              )}
            </div>

            {/* PROFILE */}
            {personal_info.summary && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}30` }}
                  >
                    <User className="w-2.5 h-2.5" style={{ color: accentLight }} />
                  </div>
                  <h3 className="text-[8px] font-bold tracking-[0.15em] uppercase text-white/90">
                    Profile
                  </h3>
                </div>
                <p className="text-white/70 text-[8px] leading-[1.5] text-justify">
                  {personal_info.summary}
                </p>
              </div>
            )}

            {/* CONTACT */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}30` }}
                >
                  <Mail className="w-2.5 h-2.5" style={{ color: accentLight }} />
                </div>
                <h3 className="text-[8px] font-bold tracking-[0.15em] uppercase text-white/90">
                  Contact
                </h3>
              </div>
              
              <div className="space-y-1.5">
                {personal_info.full_name && (
                  <div>
                    <p className="text-[7px] text-white/40 uppercase tracking-wider mb-0.5">Name</p>
                    <p className="text-white/90 text-[8px]">{personal_info.full_name}</p>
                  </div>
                )}
                {personal_info.location && (
                  <div>
                    <p className="text-[7px] text-white/40 uppercase tracking-wider mb-0.5">Address</p>
                    <p className="text-white/90 text-[8px]">{personal_info.location}</p>
                  </div>
                )}
                {personal_info.phone && (
                  <div>
                    <p className="text-[7px] text-white/40 uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="text-white/90 text-[8px]">{personal_info.phone}</p>
                  </div>
                )}
                {personal_info.email && (
                  <div>
                    <p className="text-[7px] text-white/40 uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-white/90 text-[8px] break-words">{personal_info.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* COMPETENCES */}
            {skills.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}30` }}
                  >
                    <Star className="w-2.5 h-2.5" style={{ color: accentLight }} />
                  </div>
                  <h3 className="text-[8px] font-bold tracking-[0.15em] uppercase text-white/90">
                    Competences
                  </h3>
                </div>
                
                <div className="space-y-0.5">
                  {skills.map((skillCategory, index) => (
                    <div key={index}>
                      {(skillCategory.items || []).map((skill, skillIndex) => (
                        <div 
                          key={skillIndex}
                          className="flex items-start gap-2 py-0.5"
                        >
                          <div 
                            className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: accentLight }}
                          />
                          <span className="text-white/80 text-[8px] leading-snug">
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LANGUAGES */}
            {languages && languages.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}30` }}
                  >
                    <Languages className="w-2.5 h-2.5" style={{ color: accentLight }} />
                  </div>
                  <h3 className="text-[8px] font-bold tracking-[0.15em] uppercase text-white/90">
                    Languages
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {languages.map((lang, index) => {
                    const width = getProficiencyWidth(lang.proficiency);
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white/90 text-[8px] font-medium">
                            {lang.language}
                          </span>
                          <span className="text-[7px]" style={{ color: accentLight }}>
                            {width}%
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-white/10">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${width}%`,
                              background: `linear-gradient(90deg, ${accentColor}, ${accentLight})`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main 
          className="min-w-0"
          style={{ 
            backgroundColor: '#f8f9fb',
            padding: '12px'
          }}
        >
          {/* EDUCATION */}
          {education.length > 0 && (
            <section className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
                    boxShadow: `0 3px 12px ${accentColor}40`
                  }}
                >
                  <GraduationCap className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 
                    className="text-[11px] font-semibold"
                    style={{ fontFamily: headerFont, color: primaryColor }}
                  >
                    EDUCATION
                  </h2>
                  <div 
                    className="h-0.5 w-8 mt-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentLight})` }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <div key={index} className="flex gap-2">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: accentColor,
                          boxShadow: `0 0 0 3px white, 0 0 8px ${accentColor}40`
                        }}
                      />
                      {index < education.length - 1 && (
                        <div 
                          className="w-0.5 flex-1 mt-1"
                          style={{ backgroundColor: `${accentColor}30` }}
                        />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div 
                      className="flex-1 min-w-0 bg-white rounded-lg p-3 border border-gray-100"
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                    >
                      <div 
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold mb-2"
                        style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
                      >
                        <Calendar className="w-3 h-3" />
                        {edu.start_date && formatDate(edu.start_date)} – {edu.graduation_date && formatDate(edu.graduation_date)}
                      </div>
                      
                      <h3 className="font-bold text-[12px] text-gray-800 leading-tight">
                        {edu.degree}{edu.field && ` in ${edu.field}`}
                      </h3>
                      
                      <p className="text-gray-500 text-[10px] mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{edu.institution}</span>
                      </p>
                      
                      {edu.achievements && edu.achievements.length > 0 && (
                        <p className="text-[9px] mt-2 italic" style={{ color: accentColor }}>
                          {edu.achievements.filter(a => a && a.trim()).join(' • ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EXPERIENCES */}
          {experiences.length > 0 && (
            <section className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
                    boxShadow: `0 3px 12px ${accentColor}40`
                  }}
                >
                  <Briefcase className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 
                    className="text-[11px] font-semibold"
                    style={{ fontFamily: headerFont, color: primaryColor }}
                  >
                    EXPERIENCES
                  </h2>
                  <div 
                    className="h-0.5 w-10 mt-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentLight})` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {experiences.map((exp, index) => (
                  <div key={index} className="flex gap-2">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: accentColor,
                          boxShadow: `0 0 0 3px white, 0 0 8px ${accentColor}40`
                        }}
                      />
                      {index < experiences.length - 1 && (
                        <div 
                          className="w-0.5 flex-1 mt-1"
                          style={{ backgroundColor: `${accentColor}30` }}
                        />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div 
                      className="flex-1 min-w-0 bg-white rounded-lg p-3 border border-gray-100"
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold"
                          style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
                        >
                          <Calendar className="w-3 h-3" />
                          {formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </div>
                        {exp.is_current && (
                          <span 
                            className="text-[8px] px-1.5 py-0.5 rounded-full font-semibold text-white"
                            style={{ backgroundColor: '#10b981' }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-[12px] text-gray-800 leading-tight">
                        {exp.job_title}
                      </h3>
                      
                      <p className="text-gray-500 text-[10px] mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{exp.company}{exp.location && ` • ${exp.location}`}</span>
                      </p>
                      
                      {exp.bullet_points && exp.bullet_points.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                            <li key={bpIndex} className="flex items-start gap-1.5">
                              <div 
                                className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: accentColor }}
                              />
                              <span className="text-gray-600 text-[9px] leading-relaxed">{bp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {certifications && certifications.length > 0 && (
            <section className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
                    boxShadow: `0 3px 12px ${accentColor}40`
                  }}
                >
                  <Award className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 
                    className="text-[11px] font-semibold"
                    style={{ fontFamily: headerFont, color: primaryColor }}
                  >
                    CERTIFICATIONS
                  </h2>
                  <div 
                    className="h-0.5 w-10 mt-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentLight})` }}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {certifications.map((cert, index) => (
                  <div 
                    key={index}
                    className="px-2 py-1 rounded-lg text-[9px] font-medium bg-white border border-gray-100"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  >
                    <span style={{ color: accentColor }}>{cert.name}</span>
                    {cert.issuer && <span className="text-gray-400 ml-1">• {cert.issuer}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {projects && projects.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
                    boxShadow: `0 3px 12px ${accentColor}40`
                  }}
                >
                  <Target className="w-3 h-3 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 
                    className="text-[11px] font-semibold"
                    style={{ fontFamily: headerFont, color: primaryColor }}
                  >
                    PROJECTS
                  </h2>
                  <div 
                    className="h-0.5 w-8 mt-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentLight})` }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                {projects.map((project, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg p-3 border border-gray-100"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  >
                    <h3 className="font-bold text-[11px] text-gray-800">{project.name}</h3>
                    {project.description && (
                      <p className="text-gray-500 text-[9px] mt-1 leading-relaxed">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-1.5 py-0.5 rounded text-[8px] font-medium"
                            style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
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
        </main>
      </div>
    </div>
  );
}
