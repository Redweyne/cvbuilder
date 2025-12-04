import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Star, Target, User, Languages, CheckCircle2 } from 'lucide-react';
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

  const primaryColor = customization?.primary_color || '#2D3748';
  const accentColor = customization?.accent_color || '#6366F1';
  const fontFamily = customization?.font_family || "'Playfair Display', 'Georgia', serif";
  const bodyFont = "'Inter', 'Segoe UI', sans-serif";

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
      'Fluent': 95,
      'Advanced': 85,
      'Proficient': 75,
      'Intermediate': 60,
      'Elementary': 40,
      'Basic': 25
    };
    return levels[proficiency] || 50;
  };

  return (
    <div 
      className={`bg-white ${forExport ? '' : 'shadow-2xl rounded-xl'} overflow-hidden`}
      style={{ 
        fontFamily: bodyFont,
        minHeight: forExport ? 'auto' : '1100px',
        maxWidth: '8.5in',
        margin: '0 auto'
      }}
    >
      <div className="flex min-h-full">
        {/* Elegant Sidebar */}
        <aside 
          className="w-[280px] flex-shrink-0 relative"
          style={{ 
            background: `linear-gradient(180deg, ${primaryColor} 0%, ${primaryColor}ee 50%, ${primaryColor}dd 100%)`,
          }}
        >
          {/* Subtle pattern overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="relative z-10 p-7">
            {/* Name Section with elegant typography */}
            <div className="text-center mb-8 pt-4">
              <div className="mb-4">
                <div 
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}40 0%, ${accentColor}20 100%)`,
                    border: `2px solid ${accentColor}60`
                  }}
                >
                  <User className="w-10 h-10 text-white opacity-90" />
                </div>
              </div>
              <h1 
                className="text-2xl font-bold text-white tracking-wide leading-tight"
                style={{ fontFamily }}
              >
                {personal_info.full_name?.split(' ')[0] || 'Your'}
              </h1>
              <h1 
                className="text-2xl font-bold text-white tracking-wide"
                style={{ fontFamily }}
              >
                {personal_info.full_name?.split(' ').slice(1).join(' ') || 'Name'}
              </h1>
              {personal_info.title && (
                <p 
                  className="text-sm mt-3 font-medium tracking-wider uppercase"
                  style={{ color: `${accentColor}` }}
                >
                  {personal_info.title}
                </p>
              )}
            </div>

            {/* Decorative divider */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-8 bg-white/20"></div>
              <div 
                className="w-2 h-2 rounded-full mx-3"
                style={{ backgroundColor: accentColor }}
              ></div>
              <div className="h-px w-8 bg-white/20"></div>
            </div>

            {/* Profile Section */}
            {personal_info.summary && (
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}30` }}
                  >
                    <Target className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <h2 
                    className="text-xs font-bold uppercase tracking-[0.2em] text-white"
                    style={{ fontFamily }}
                  >
                    Profile
                  </h2>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  {personal_info.summary}
                </p>
              </section>
            )}

            {/* Contact Section */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}30` }}
                >
                  <Mail className="w-4 h-4" style={{ color: accentColor }} />
                </div>
                <h2 
                  className="text-xs font-bold uppercase tracking-[0.2em] text-white"
                  style={{ fontFamily }}
                >
                  Contact
                </h2>
              </div>
              <div className="space-y-3">
                {personal_info.full_name && (
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Name</p>
                      <p className="text-white text-sm">{personal_info.full_name}</p>
                    </div>
                  </div>
                )}
                {personal_info.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Address</p>
                      <p className="text-white text-sm">{personal_info.location}</p>
                    </div>
                  </div>
                )}
                {personal_info.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Phone</p>
                      <p className="text-white text-sm">{personal_info.phone}</p>
                    </div>
                  </div>
                )}
                {personal_info.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Email</p>
                      <p className="text-white text-sm break-all">{personal_info.email}</p>
                    </div>
                  </div>
                )}
                {personal_info.linkedin && (
                  <div className="flex items-start gap-3">
                    <Linkedin className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">LinkedIn</p>
                      <a href={personal_info.linkedin} className="text-white text-sm hover:underline">
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Skills/Competences Section */}
            {skills.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}30` }}
                  >
                    <Star className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <h2 
                    className="text-xs font-bold uppercase tracking-[0.2em] text-white"
                    style={{ fontFamily }}
                  >
                    Competences
                  </h2>
                </div>
                <div className="space-y-2">
                  {skills.map((skillCategory, index) => (
                    <div key={index}>
                      {skillCategory.category && (
                        <p 
                          className="text-xs font-semibold mb-2 uppercase tracking-wider"
                          style={{ color: accentColor }}
                        >
                          {skillCategory.category}
                        </p>
                      )}
                      {(skillCategory.items || []).map((skill, skillIndex) => (
                        <div 
                          key={skillIndex}
                          className="flex items-center gap-2 text-white/90 text-sm py-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages with elegant progress bars */}
            {languages && languages.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}30` }}
                  >
                    <Languages className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                  <h2 
                    className="text-xs font-bold uppercase tracking-[0.2em] text-white"
                    style={{ fontFamily }}
                  >
                    Languages
                  </h2>
                </div>
                <div className="space-y-4">
                  {languages.map((lang, index) => {
                    const width = getProficiencyWidth(lang.proficiency);
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white text-sm font-medium">{lang.language}</span>
                          <span className="text-white/60 text-xs">{width}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${width}%`,
                              background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}cc 100%)`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50/50">
          <div className="p-10">
            {/* Education Section */}
            {education.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` 
                    }}
                  >
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-lg font-bold tracking-wide"
                      style={{ fontFamily, color: primaryColor }}
                    >
                      EDUCATION
                    </h2>
                    <div 
                      className="h-0.5 w-12 mt-1 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                </div>
                
                <div className="space-y-5">
                  {education.map((edu, index) => (
                    <article 
                      key={index} 
                      className="relative pl-6 border-l-2"
                      style={{ borderColor: `${accentColor}30` }}
                    >
                      <div 
                        className="absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 bg-white"
                        style={{ borderColor: accentColor }}
                      />
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                        <div className="flex-1">
                          <p 
                            className="text-sm font-semibold"
                            style={{ color: accentColor }}
                          >
                            {formatDate(edu.start_date)} - {formatDate(edu.graduation_date)}
                          </p>
                          <h3 
                            className="font-bold text-base mt-1"
                            style={{ color: primaryColor }}
                          >
                            {edu.degree}{edu.field && ` in ${edu.field}`}
                          </h3>
                          <p className="text-gray-600 text-sm mt-0.5">
                            {edu.institution}{edu.location && ` • ${edu.location}`}
                          </p>
                        </div>
                      </div>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          {edu.achievements.filter(a => a && a.trim()).map((achievement, aIndex) => (
                            <p key={aIndex}>{achievement}</p>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Experience Section */}
            {experiences.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` 
                    }}
                  >
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-lg font-bold tracking-wide"
                      style={{ fontFamily, color: primaryColor }}
                    >
                      EXPERIENCES
                    </h2>
                    <div 
                      className="h-0.5 w-12 mt-1 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <article 
                      key={index} 
                      className="relative pl-6 border-l-2"
                      style={{ borderColor: `${accentColor}30` }}
                    >
                      <div 
                        className="absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 bg-white"
                        style={{ borderColor: accentColor }}
                      />
                      <div className="mb-2">
                        <p 
                          className="text-sm font-semibold"
                          style={{ color: accentColor }}
                        >
                          {formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                        </p>
                        <h3 
                          className="font-bold text-base mt-1"
                          style={{ color: primaryColor }}
                        >
                          {exp.job_title} – {exp.company}
                        </h3>
                        {exp.location && (
                          <p className="text-gray-500 text-sm">{exp.location}</p>
                        )}
                      </div>
                      
                      {exp.description && (
                        <p className="text-gray-600 text-sm mb-2">{exp.description}</p>
                      )}
                      
                      {exp.bullet_points && exp.bullet_points.length > 0 && (
                        <ul className="space-y-1.5">
                          {exp.bullet_points.filter(bp => bp && bp.trim()).map((bp, bpIndex) => (
                            <li 
                              key={bpIndex} 
                              className="text-gray-700 text-sm flex items-start gap-2"
                            >
                              <span 
                                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: accentColor }}
                              />
                              <span>{bp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {exp.achievements && (
                        <p className="text-gray-600 text-sm mt-3 italic border-l-2 pl-3 bg-gray-50 py-2 rounded-r"
                          style={{ borderColor: `${accentColor}50` }}
                        >
                          {exp.achievements}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications Section */}
            {certifications && certifications.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` 
                    }}
                  >
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-lg font-bold tracking-wide"
                      style={{ fontFamily, color: primaryColor }}
                    >
                      CERTIFICATIONS
                    </h2>
                    <div 
                      className="h-0.5 w-12 mt-1 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  {certifications.map((cert, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${accentColor}15` }}
                      >
                        <Award className="w-4 h-4" style={{ color: accentColor }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm" style={{ color: primaryColor }}>
                          {cert.name}
                        </h4>
                        {cert.issuer && (
                          <p className="text-gray-500 text-xs">{cert.issuer}</p>
                        )}
                      </div>
                      {cert.date && (
                        <span className="text-xs text-gray-400">{cert.date}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {projects && projects.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` 
                    }}
                  >
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-lg font-bold tracking-wide"
                      style={{ fontFamily, color: primaryColor }}
                    >
                      PROJECTS
                    </h2>
                    <div 
                      className="h-0.5 w-12 mt-1 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <h4 className="font-semibold" style={{ color: primaryColor }}>
                        {project.name}
                      </h4>
                      {project.description && (
                        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-2 py-0.5 text-xs rounded-full"
                              style={{ 
                                backgroundColor: `${accentColor}15`,
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
