import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Star, Target, User, Languages, Calendar, Building2 } from 'lucide-react';
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
  const goldAccent = '#d4af37';
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
      className={`bg-white ${forExport ? '' : 'shadow-2xl'} overflow-hidden`}
      style={{ 
        fontFamily: bodyFont,
        minHeight: forExport ? 'auto' : '1100px',
        maxWidth: '8.5in',
        margin: '0 auto',
        fontSize: '11px',
        lineHeight: '1.6'
      }}
    >
      <div className="flex min-h-full">
        {/* ═══════════════════════════════════════════════════════════════════
            LEFT SIDEBAR - Premium Dark Panel with Luxurious Depth
        ═══════════════════════════════════════════════════════════════════ */}
        <aside 
          className="w-[270px] flex-shrink-0 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(175deg, #1e1e3f 0%, ${primaryColor} 30%, #12122a 100%)`,
          }}
        >
          {/* Luxury subtle texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Radiant glow accents */}
          <div 
            className="absolute -top-32 -right-32 w-64 h-64 opacity-20"
            style={{
              background: `radial-gradient(circle, ${accentColor}40, transparent 60%)`,
            }}
          />
          <div 
            className="absolute -bottom-24 -left-24 w-48 h-48 opacity-15"
            style={{
              background: `radial-gradient(circle, ${accentLight}30, transparent 60%)`,
            }}
          />
          
          <div className="relative z-10 h-full flex flex-col">
            {/* ─────────────────────────────────────────────────────────────────
                NAME HEADER - Elegant First Name, Last Name Format
            ───────────────────────────────────────────────────────────────── */}
            <div className="px-7 pt-14 pb-6 text-center">
              <h1 
                className="text-white leading-none mb-1"
                style={{ 
                  fontFamily: headerFont,
                  fontSize: '38px',
                  fontWeight: '600',
                  letterSpacing: '0.02em',
                  textShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                {firstName}
              </h1>
              <h2 
                className="text-white/80"
                style={{ 
                  fontFamily: headerFont,
                  fontSize: '32px',
                  fontWeight: '400',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                {lastName}
              </h2>
            </div>

            {/* Decorative gold accent line with title */}
            {personal_info.title && (
              <div className="px-6 mb-7">
                <div className="relative py-3">
                  <div 
                    className="absolute inset-0 opacity-10 rounded"
                    style={{ 
                      background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` 
                    }}
                  />
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-px flex-1"
                      style={{ background: `linear-gradient(90deg, transparent, ${goldAccent}60)` }}
                    />
                    <div 
                      className="w-2 h-2 rotate-45"
                      style={{ backgroundColor: goldAccent }}
                    />
                    <div 
                      className="h-px flex-1"
                      style={{ background: `linear-gradient(90deg, ${goldAccent}60, transparent)` }}
                    />
                  </div>
                  <p 
                    className="text-center text-[9px] font-bold tracking-[0.25em] uppercase mt-3"
                    style={{ color: accentLight }}
                  >
                    {personal_info.title}
                  </p>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                PROFILE SECTION
            ───────────────────────────────────────────────────────────────── */}
            {personal_info.summary && (
              <div className="px-6 mb-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <div 
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor}35, ${accentColor}15)`,
                      boxShadow: `0 2px 8px ${accentColor}20`
                    }}
                  >
                    <User className="w-3.5 h-3.5" style={{ color: accentLight }} />
                  </div>
                  <h3 
                    className="text-[10px] font-bold tracking-[0.2em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.95)' }}
                  >
                    Profile
                  </h3>
                </div>
                <p 
                  className="text-[10.5px] leading-[1.75] text-justify"
                  style={{ color: 'rgba(255,255,255,0.72)' }}
                >
                  {personal_info.summary}
                </p>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                CONTACT SECTION
            ───────────────────────────────────────────────────────────────── */}
            <div className="px-6 mb-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div 
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}35, ${accentColor}15)`,
                    boxShadow: `0 2px 8px ${accentColor}20`
                  }}
                >
                  <Mail className="w-3.5 h-3.5" style={{ color: accentLight }} />
                </div>
                <h3 
                  className="text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.95)' }}
                >
                  Contact
                </h3>
              </div>
              
              <div className="space-y-3">
                {personal_info.full_name && (
                  <div className="group">
                    <p className="text-[8px] uppercase tracking-[0.18em] mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Name</p>
                    <p className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.92)' }}>{personal_info.full_name}</p>
                  </div>
                )}
                {personal_info.location && (
                  <div className="group">
                    <p className="text-[8px] uppercase tracking-[0.18em] mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Address</p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.88)' }}>{personal_info.location}</p>
                  </div>
                )}
                {personal_info.phone && (
                  <div className="group">
                    <p className="text-[8px] uppercase tracking-[0.18em] mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Phone</p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.88)' }}>{personal_info.phone}</p>
                  </div>
                )}
                {personal_info.email && (
                  <div className="group">
                    <p className="text-[8px] uppercase tracking-[0.18em] mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Email</p>
                    <p className="text-[11px] break-all" style={{ color: 'rgba(255,255,255,0.88)' }}>{personal_info.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────────
                COMPETENCES
            ───────────────────────────────────────────────────────────────── */}
            {skills.length > 0 && (
              <div className="px-6 mb-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div 
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor}35, ${accentColor}15)`,
                      boxShadow: `0 2px 8px ${accentColor}20`
                    }}
                  >
                    <Star className="w-3.5 h-3.5" style={{ color: accentLight }} />
                  </div>
                  <h3 
                    className="text-[10px] font-bold tracking-[0.2em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.95)' }}
                  >
                    Competences
                  </h3>
                </div>
                
                <div className="space-y-1">
                  {skills.map((skillCategory, index) => (
                    <div key={index}>
                      {(skillCategory.items || []).map((skill, skillIndex) => (
                        <div 
                          key={skillIndex}
                          className="flex items-start gap-2.5 py-1.5"
                        >
                          <div 
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ 
                              backgroundColor: accentLight,
                              boxShadow: `0 0 6px ${accentColor}60`
                            }}
                          />
                          <span 
                            className="text-[10.5px] leading-snug"
                            style={{ color: 'rgba(255,255,255,0.82)' }}
                          >
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                LANGUAGES - Premium Progress Bars
            ───────────────────────────────────────────────────────────────── */}
            {languages && languages.length > 0 && (
              <div className="px-6 mt-auto pb-8">
                <div className="flex items-center gap-2.5 mb-5">
                  <div 
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor}35, ${accentColor}15)`,
                      boxShadow: `0 2px 8px ${accentColor}20`
                    }}
                  >
                    <Languages className="w-3.5 h-3.5" style={{ color: accentLight }} />
                  </div>
                  <h3 
                    className="text-[10px] font-bold tracking-[0.2em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.95)' }}
                  >
                    Languages
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {languages.map((lang, index) => {
                    const width = getProficiencyWidth(lang.proficiency);
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span 
                            className="text-[11px] font-medium"
                            style={{ color: 'rgba(255,255,255,0.9)' }}
                          >
                            {lang.language}
                          </span>
                          <span 
                            className="text-[9px] font-medium"
                            style={{ color: accentLight }}
                          >
                            {width}%
                          </span>
                        </div>
                        <div 
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                        >
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${width}%`,
                              background: `linear-gradient(90deg, ${accentColor}, ${accentLight}, ${accentGlow})`,
                              boxShadow: `0 0 12px ${accentColor}50`
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

        {/* ═══════════════════════════════════════════════════════════════════
            RIGHT MAIN CONTENT - Elegant Cards with Premium Styling
        ═══════════════════════════════════════════════════════════════════ */}
        <main 
          className="flex-1"
          style={{ 
            background: 'linear-gradient(180deg, #fafbfc 0%, #f8f9fb 50%, #f5f6f8 100%)'
          }}
        >
          <div className="p-8">
            
            {/* ─────────────────────────────────────────────────────────────────
                EDUCATION SECTION
            ───────────────────────────────────────────────────────────────── */}
            {education.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-3.5 mb-5">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
                      boxShadow: `0 4px 16px ${accentColor}40, 0 0 0 3px rgba(255,255,255,0.8)`
                    }}
                  >
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-[17px] font-semibold tracking-[0.06em]"
                      style={{ 
                        fontFamily: headerFont,
                        color: primaryColor
                      }}
                    >
                      EDUCATION
                    </h2>
                    <div 
                      className="h-[3px] w-12 mt-1 rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${accentColor}, ${accentLight})`,
                        boxShadow: `0 2px 6px ${accentColor}30`
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <article 
                      key={index}
                      className="relative pl-6"
                    >
                      {/* Vertical timeline line */}
                      <div 
                        className="absolute left-[7px] top-3 bottom-0 w-[2px] rounded-full"
                        style={{ 
                          background: `linear-gradient(180deg, ${accentColor}50, ${accentColor}15)`
                        }}
                      />
                      
                      {/* Glowing timeline dot */}
                      <div 
                        className="absolute left-0 top-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ 
                          background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
                          boxShadow: `0 0 0 3px white, 0 0 12px ${accentColor}50`
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      
                      {/* Content card */}
                      <div 
                        className="rounded-lg p-4 border"
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.85)',
                          borderColor: 'rgba(0,0,0,0.05)',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold mb-2"
                          style={{ 
                            backgroundColor: `${accentColor}12`,
                            color: accentColor
                          }}
                        >
                          <Calendar className="w-3 h-3" />
                          {edu.start_date && formatDate(edu.start_date)} – {edu.graduation_date && formatDate(edu.graduation_date)}
                        </div>
                        
                        <h3 
                          className="font-bold text-[13px] leading-tight mb-1"
                          style={{ color: primaryColor }}
                        >
                          {edu.degree}{edu.field && ` in ${edu.field}`}
                        </h3>
                        
                        <p className="text-gray-500 text-[11px] flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-gray-400" />
                          {edu.institution}
                        </p>
                        
                        {edu.achievements && edu.achievements.length > 0 && (
                          <p 
                            className="text-[10px] mt-2 italic"
                            style={{ color: `${accentColor}cc` }}
                          >
                            {edu.achievements.filter(a => a && a.trim()).join(' • ')}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                EXPERIENCES SECTION
            ───────────────────────────────────────────────────────────────── */}
            {experiences.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-3.5 mb-5">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
                      boxShadow: `0 4px 16px ${accentColor}40, 0 0 0 3px rgba(255,255,255,0.8)`
                    }}
                  >
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-[17px] font-semibold tracking-[0.06em]"
                      style={{ 
                        fontFamily: headerFont,
                        color: primaryColor
                      }}
                    >
                      EXPERIENCES
                    </h2>
                    <div 
                      className="h-[3px] w-12 mt-1 rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${accentColor}, ${accentLight})`,
                        boxShadow: `0 2px 6px ${accentColor}30`
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  {experiences.map((exp, index) => (
                    <article 
                      key={index}
                      className="relative pl-6"
                    >
                      {/* Vertical timeline line */}
                      <div 
                        className="absolute left-[7px] top-3 bottom-0 w-[2px] rounded-full"
                        style={{ 
                          background: `linear-gradient(180deg, ${accentColor}50, ${accentColor}15)`
                        }}
                      />
                      
                      {/* Glowing timeline dot */}
                      <div 
                        className="absolute left-0 top-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ 
                          background: `linear-gradient(135deg, ${accentColor}, ${accentLight})`,
                          boxShadow: `0 0 0 3px white, 0 0 12px ${accentColor}50`
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      
                      {/* Content card */}
                      <div 
                        className="rounded-lg p-4 border"
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.85)',
                          borderColor: 'rgba(0,0,0,0.05)',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold mb-2"
                          style={{ 
                            backgroundColor: `${accentColor}12`,
                            color: accentColor
                          }}
                        >
                          <Calendar className="w-3 h-3" />
                          {formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </div>
                        
                        <h3 
                          className="font-bold text-[13px] leading-tight mb-1"
                          style={{ color: primaryColor }}
                        >
                          {exp.job_title}
                          <span className="font-normal text-gray-500"> – {exp.company}</span>
                        </h3>
                        
                        {exp.location && (
                          <p className="text-gray-400 text-[10px] flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </p>
                        )}
                        
                        {exp.bullet_points && exp.bullet_points.length > 0 && (
                          <ul className="space-y-1.5 mt-2">
                            {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                              <li 
                                key={bpIndex} 
                                className="text-gray-600 text-[10.5px] flex items-start gap-2 leading-relaxed"
                              >
                                <span 
                                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                  style={{ 
                                    backgroundColor: accentColor,
                                    boxShadow: `0 0 4px ${accentColor}40`
                                  }}
                                />
                                <span>{bp}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {exp.achievements && typeof exp.achievements === 'string' && exp.achievements.trim() && (
                          <div 
                            className="mt-3 px-3 py-2 rounded-r-md border-l-[3px] text-[10px] italic leading-relaxed"
                            style={{ 
                              borderColor: accentColor,
                              backgroundColor: `${accentColor}08`,
                              color: '#5a5a6e'
                            }}
                          >
                            {exp.achievements}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                CERTIFICATIONS
            ───────────────────────────────────────────────────────────────── */}
            {certifications && certifications.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-3.5 mb-5">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
                      boxShadow: `0 4px 16px ${accentColor}40, 0 0 0 3px rgba(255,255,255,0.8)`
                    }}
                  >
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-[17px] font-semibold tracking-[0.06em]"
                      style={{ 
                        fontFamily: headerFont,
                        color: primaryColor
                      }}
                    >
                      CERTIFICATIONS
                    </h2>
                    <div 
                      className="h-[3px] w-12 mt-1 rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${accentColor}, ${accentLight})`,
                        boxShadow: `0 2px 6px ${accentColor}30`
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  {certifications.map((cert, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        borderColor: 'rgba(0,0,0,0.05)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`
                        }}
                      >
                        <Award className="w-4 h-4" style={{ color: accentColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[11px]" style={{ color: primaryColor }}>
                          {cert.name}
                        </h4>
                        {cert.issuer && (
                          <p className="text-gray-400 text-[9px]">{cert.issuer}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                PROJECTS
            ───────────────────────────────────────────────────────────────── */}
            {projects && projects.length > 0 && (
              <section>
                <div className="flex items-center gap-3.5 mb-5">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentLight} 100%)`,
                      boxShadow: `0 4px 16px ${accentColor}40, 0 0 0 3px rgba(255,255,255,0.8)`
                    }}
                  >
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-[17px] font-semibold tracking-[0.06em]"
                      style={{ 
                        fontFamily: headerFont,
                        color: primaryColor
                      }}
                    >
                      PROJECTS
                    </h2>
                    <div 
                      className="h-[3px] w-12 mt-1 rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${accentColor}, ${accentLight})`,
                        boxShadow: `0 2px 6px ${accentColor}30`
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {projects.map((project, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        borderColor: 'rgba(0,0,0,0.05)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}
                    >
                      <h4 className="font-semibold text-[12px]" style={{ color: primaryColor }}>
                        {project.name}
                      </h4>
                      {project.description && (
                        <p className="text-gray-500 text-[10.5px] mt-1.5 leading-relaxed">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {project.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-2 py-0.5 text-[8px] rounded-full font-semibold"
                              style={{ 
                                background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}06)`,
                                color: accentColor
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
          </div>
        </main>
      </div>
    </div>
  );
}
