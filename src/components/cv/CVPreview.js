import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { format } from 'date-fns';

export default function CVPreview({ data }) {
  const {
    personal_info = {},
    experiences = [],
    education = [],
    skills = [],
    customization = {}
  } = data || {};

  const primaryColor = customization?.primary_color || '#4F46E5';

  return (
    <div 
      className="bg-white shadow-lg rounded-lg overflow-hidden"
      style={{ 
        fontFamily: customization?.font_family || 'Inter, sans-serif',
        minHeight: '800px'
      }}
    >
      {/* Header */}
      <div 
        className="p-8 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <h1 className="text-3xl font-bold mb-2">
          {personal_info.full_name || 'Your Name'}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          {personal_info.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {personal_info.email}
            </div>
          )}
          {personal_info.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {personal_info.phone}
            </div>
          )}
          {personal_info.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {personal_info.location}
            </div>
          )}
          {personal_info.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              {personal_info.linkedin}
            </div>
          )}
          {personal_info.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {personal_info.website}
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Summary */}
        {personal_info.summary && (
          <section>
            <h2 
              className="text-lg font-semibold mb-3 pb-2 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {personal_info.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 
              className="text-lg font-semibold mb-3 pb-2 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Work Experience
            </h2>
            <div className="space-y-5">
              {experiences.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.job_title}</h3>
                      <p className="text-gray-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {exp.start_date && format(new Date(exp.start_date + '-01'), 'MMM yyyy')}
                      {' - '}
                      {exp.is_current ? 'Present' : (exp.end_date && format(new Date(exp.end_date + '-01'), 'MMM yyyy'))}
                    </span>
                  </div>
                  {exp.bullet_points && exp.bullet_points.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mt-2">
                      {exp.bullet_points.filter(bp => bp).map((bp, bpIndex) => (
                        <li key={bpIndex}>{bp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 
              className="text-lg font-semibold mb-3 pb-2 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree}{edu.field && ` in ${edu.field}`}
                      </h3>
                      <p className="text-gray-600">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {edu.graduation_date && format(new Date(edu.graduation_date + '-01'), 'MMM yyyy')}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 text-sm mt-1">
                      {edu.achievements.filter(a => a).map((achievement, aIndex) => (
                        <li key={aIndex}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 
              className="text-lg font-semibold mb-3 pb-2 border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Skills
            </h2>
            <div className="space-y-3">
              {skills.map((skillCategory, index) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{skillCategory.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(skillCategory.items || []).map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-2 py-1 text-xs rounded"
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
    </div>
  );
}