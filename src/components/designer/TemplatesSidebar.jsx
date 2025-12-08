import React, { useState } from 'react';
import { useDesign } from '@/context/DesignContext';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Briefcase,
  GraduationCap,
  User,
  Star,
  Mail,
  Phone,
  MapPin,
  Award,
  Code,
  Layout,
  Type,
  Square,
  Minus,
} from 'lucide-react';

const CV_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    elements: [
      { type: 'shape', x: 0, y: 0, width: 250, height: 1122, style: { backgroundColor: '#1e293b', borderRadius: 0 } },
      { type: 'text', x: 30, y: 40, width: 190, height: 40, content: 'Your Name', style: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 30, y: 90, width: 190, height: 24, content: 'Professional Title', style: { fontSize: 14, color: '#94a3b8', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'line', x: 30, y: 130, width: 190, height: 2, style: { color: '#475569' } },
      { type: 'text', x: 30, y: 150, width: 190, height: 20, content: 'CONTACT', style: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 30, y: 175, width: 190, height: 80, content: 'email@example.com\n+1 234 567 890\nCity, Country', style: { fontSize: 12, color: '#ffffff', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 30, y: 280, width: 190, height: 20, content: 'SKILLS', style: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 30, y: 305, width: 190, height: 120, content: 'Leadership\nCommunication\nProblem Solving\nTeam Management\nStrategic Planning', style: { fontSize: 12, color: '#ffffff', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 280, y: 40, width: 480, height: 20, content: 'PROFILE', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 280, y: 70, width: 480, height: 80, content: 'A brief summary of your professional background, key achievements, and career objectives. Highlight what makes you unique and what value you bring to potential employers.', style: { fontSize: 12, color: '#475569', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'line', x: 280, y: 165, width: 480, height: 2, style: { color: '#e2e8f0' } },
      { type: 'text', x: 280, y: 180, width: 480, height: 20, content: 'EXPERIENCE', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 280, y: 210, width: 480, height: 24, content: 'Job Title at Company Name', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 280, y: 235, width: 480, height: 18, content: '2020 - Present', style: { fontSize: 11, color: '#6366f1', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 280, y: 260, width: 480, height: 60, content: '• Key achievement or responsibility\n• Another important accomplishment\n• Measurable result or impact', style: { fontSize: 12, color: '#475569', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'line', x: 280, y: 500, width: 480, height: 2, style: { color: '#e2e8f0' } },
      { type: 'text', x: 280, y: 515, width: 480, height: 20, content: 'EDUCATION', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 280, y: 545, width: 480, height: 24, content: 'Degree in Field of Study', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'left' } },
      { type: 'text', x: 280, y: 570, width: 480, height: 18, content: 'University Name | 2016 - 2020', style: { fontSize: 11, color: '#6366f1', fontFamily: 'Inter', textAlign: 'left' } },
    ],
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout',
    elements: [
      { type: 'text', x: 60, y: 50, width: 674, height: 45, content: 'YOUR NAME', style: { fontSize: 36, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Georgia', textAlign: 'center' } },
      { type: 'text', x: 60, y: 100, width: 674, height: 24, content: 'Professional Title', style: { fontSize: 16, color: '#64748b', fontFamily: 'Georgia', textAlign: 'center' } },
      { type: 'line', x: 60, y: 140, width: 674, height: 3, style: { color: '#1e293b' } },
      { type: 'text', x: 60, y: 155, width: 674, height: 20, content: 'email@example.com | +1 234 567 890 | City, Country', style: { fontSize: 11, color: '#64748b', fontFamily: 'Georgia', textAlign: 'center' } },
      { type: 'text', x: 60, y: 200, width: 674, height: 24, content: 'PROFESSIONAL SUMMARY', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Georgia', textAlign: 'left' } },
      { type: 'line', x: 60, y: 225, width: 674, height: 1, style: { color: '#cbd5e1' } },
      { type: 'text', x: 60, y: 235, width: 674, height: 70, content: 'Dedicated professional with extensive experience in your field. Proven track record of delivering results and driving success. Strong analytical and leadership skills with a passion for excellence.', style: { fontSize: 12, color: '#475569', fontFamily: 'Georgia', textAlign: 'left' } },
      { type: 'text', x: 60, y: 320, width: 674, height: 24, content: 'WORK EXPERIENCE', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Georgia', textAlign: 'left' } },
      { type: 'line', x: 60, y: 345, width: 674, height: 1, style: { color: '#cbd5e1' } },
      { type: 'text', x: 60, y: 360, width: 500, height: 24, content: 'Senior Position Title', style: { fontSize: 13, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Georgia', textAlign: 'left' } },
      { type: 'text', x: 560, y: 360, width: 174, height: 24, content: '2020 - Present', style: { fontSize: 12, color: '#64748b', fontFamily: 'Georgia', textAlign: 'right' } },
      { type: 'text', x: 60, y: 385, width: 674, height: 18, content: 'Company Name, Location', style: { fontSize: 12, fontStyle: 'italic', color: '#64748b', fontFamily: 'Georgia', textAlign: 'left' } },
      { type: 'text', x: 60, y: 410, width: 674, height: 80, content: '• Led cross-functional teams to achieve project objectives\n• Implemented strategic initiatives resulting in significant improvements\n• Collaborated with stakeholders to drive organizational success', style: { fontSize: 12, color: '#475569', fontFamily: 'Georgia', textAlign: 'left' } },
      { type: 'text', x: 60, y: 550, width: 674, height: 24, content: 'EDUCATION', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Georgia', textAlign: 'left' } },
      { type: 'line', x: 60, y: 575, width: 674, height: 1, style: { color: '#cbd5e1' } },
      { type: 'text', x: 60, y: 590, width: 500, height: 24, content: 'Master of Science in Your Field', style: { fontSize: 13, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Georgia', textAlign: 'left' } },
      { type: 'text', x: 560, y: 590, width: 174, height: 24, content: '2016 - 2018', style: { fontSize: 12, color: '#64748b', fontFamily: 'Georgia', textAlign: 'right' } },
      { type: 'text', x: 60, y: 615, width: 674, height: 18, content: 'University Name', style: { fontSize: 12, fontStyle: 'italic', color: '#64748b', fontFamily: 'Georgia', textAlign: 'left' } },
      { type: 'text', x: 60, y: 680, width: 674, height: 24, content: 'SKILLS', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Georgia', textAlign: 'left' } },
      { type: 'line', x: 60, y: 705, width: 674, height: 1, style: { color: '#cbd5e1' } },
      { type: 'text', x: 60, y: 720, width: 674, height: 50, content: 'Leadership & Management | Strategic Planning | Data Analysis | Project Management | Communication', style: { fontSize: 12, color: '#475569', fontFamily: 'Georgia', textAlign: 'left' } },
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant',
    elements: [
      { type: 'text', x: 60, y: 60, width: 674, height: 40, content: 'First Last', style: { fontSize: 32, fontWeight: 'normal', color: '#1e293b', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'text', x: 60, y: 105, width: 674, height: 20, content: 'email@email.com  •  (555) 123-4567  •  City, State', style: { fontSize: 12, color: '#64748b', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'line', x: 60, y: 145, width: 674, height: 1, style: { color: '#e2e8f0' } },
      { type: 'text', x: 60, y: 170, width: 674, height: 70, content: 'Brief professional summary highlighting your key strengths, experience, and what you bring to potential employers. Keep it concise and impactful.', style: { fontSize: 12, color: '#475569', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'text', x: 60, y: 260, width: 674, height: 20, content: 'Experience', style: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'text', x: 60, y: 290, width: 400, height: 20, content: 'Job Title', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'text', x: 460, y: 290, width: 274, height: 20, content: '2022 - Present', style: { fontSize: 12, color: '#64748b', fontFamily: 'Helvetica', textAlign: 'right' } },
      { type: 'text', x: 60, y: 310, width: 674, height: 18, content: 'Company Name', style: { fontSize: 12, color: '#64748b', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'text', x: 60, y: 335, width: 674, height: 60, content: '• Accomplishment or responsibility with measurable impact\n• Another key achievement demonstrating your skills\n• Additional relevant experience or contribution', style: { fontSize: 12, color: '#475569', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'text', x: 60, y: 450, width: 674, height: 20, content: 'Education', style: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'text', x: 60, y: 480, width: 400, height: 20, content: 'Degree in Field', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'text', x: 460, y: 480, width: 274, height: 20, content: '2018 - 2022', style: { fontSize: 12, color: '#64748b', fontFamily: 'Helvetica', textAlign: 'right' } },
      { type: 'text', x: 60, y: 500, width: 674, height: 18, content: 'University Name', style: { fontSize: 12, color: '#64748b', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'text', x: 60, y: 560, width: 674, height: 20, content: 'Skills', style: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Helvetica', textAlign: 'left' } },
      { type: 'text', x: 60, y: 590, width: 674, height: 40, content: 'Skill 1  •  Skill 2  •  Skill 3  •  Skill 4  •  Skill 5', style: { fontSize: 12, color: '#475569', fontFamily: 'Helvetica', textAlign: 'left' } },
    ],
  },
];

const QUICK_SECTIONS = [
  { id: 'header', name: 'Header', icon: User, elements: [
    { type: 'text', x: 60, y: 50, width: 674, height: 40, content: 'Your Name', style: { fontSize: 32, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'center' } },
    { type: 'text', x: 60, y: 95, width: 674, height: 20, content: 'Professional Title', style: { fontSize: 14, color: '#64748b', fontFamily: 'Inter', textAlign: 'center' } },
  ]},
  { id: 'contact', name: 'Contact Info', icon: Mail, elements: [
    { type: 'text', x: 60, y: 120, width: 674, height: 20, content: 'email@example.com | +1 234 567 890 | City, Country', style: { fontSize: 11, color: '#64748b', fontFamily: 'Inter', textAlign: 'center' } },
  ]},
  { id: 'experience', name: 'Experience', icon: Briefcase, elements: [
    { type: 'text', x: 60, y: 200, width: 674, height: 24, content: 'EXPERIENCE', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'left' } },
    { type: 'line', x: 60, y: 228, width: 674, height: 2, style: { color: '#e2e8f0' } },
    { type: 'text', x: 60, y: 245, width: 500, height: 22, content: 'Job Title at Company', style: { fontSize: 13, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'left' } },
    { type: 'text', x: 560, y: 245, width: 174, height: 22, content: '2020 - Present', style: { fontSize: 11, color: '#6366f1', fontFamily: 'Inter', textAlign: 'right' } },
    { type: 'text', x: 60, y: 275, width: 674, height: 60, content: '• Key accomplishment or responsibility\n• Another achievement with impact\n• Additional relevant experience', style: { fontSize: 12, color: '#475569', fontFamily: 'Inter', textAlign: 'left' } },
  ]},
  { id: 'education', name: 'Education', icon: GraduationCap, elements: [
    { type: 'text', x: 60, y: 400, width: 674, height: 24, content: 'EDUCATION', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'left' } },
    { type: 'line', x: 60, y: 428, width: 674, height: 2, style: { color: '#e2e8f0' } },
    { type: 'text', x: 60, y: 445, width: 500, height: 22, content: 'Degree in Field of Study', style: { fontSize: 13, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'left' } },
    { type: 'text', x: 560, y: 445, width: 174, height: 22, content: '2016 - 2020', style: { fontSize: 11, color: '#6366f1', fontFamily: 'Inter', textAlign: 'right' } },
    { type: 'text', x: 60, y: 470, width: 674, height: 20, content: 'University Name', style: { fontSize: 12, color: '#64748b', fontFamily: 'Inter', textAlign: 'left' } },
  ]},
  { id: 'skills', name: 'Skills', icon: Star, elements: [
    { type: 'text', x: 60, y: 540, width: 674, height: 24, content: 'SKILLS', style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', fontFamily: 'Inter', textAlign: 'left' } },
    { type: 'line', x: 60, y: 568, width: 674, height: 2, style: { color: '#e2e8f0' } },
    { type: 'text', x: 60, y: 585, width: 674, height: 40, content: 'Skill 1 • Skill 2 • Skill 3 • Skill 4 • Skill 5', style: { fontSize: 12, color: '#475569', fontFamily: 'Inter', textAlign: 'left' } },
  ]},
];

export default function TemplatesSidebar() {
  const { loadTemplate, addElement } = useDesign();
  const [activeTab, setActiveTab] = useState('templates');

  const handleLoadTemplate = (template) => {
    if (loadTemplate) {
      loadTemplate(template.elements);
    }
  };

  const handleAddSection = (section) => {
    section.elements.forEach((el, index) => {
      setTimeout(() => {
        addElement(el);
      }, index * 50);
    });
  };

  const handleAddElement = (type) => {
    const elementConfigs = {
      text: {
        type: 'text',
        content: 'New Text',
        width: 200,
        height: 30,
        style: { fontSize: 14, fontFamily: 'Inter', color: '#1e293b', textAlign: 'left' },
      },
      heading: {
        type: 'text',
        content: 'Heading',
        width: 300,
        height: 40,
        style: { fontSize: 24, fontWeight: 'bold', fontFamily: 'Inter', color: '#1e293b', textAlign: 'left' },
      },
      shape: {
        type: 'shape',
        width: 100,
        height: 100,
        style: { backgroundColor: '#6366f1', borderRadius: 8 },
      },
      line: {
        type: 'line',
        width: 200,
        height: 2,
        style: { color: '#e2e8f0' },
      },
    };
    addElement(elementConfigs[type]);
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'templates'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('elements')}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'elements'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Elements
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">CV Templates</h3>
              <div className="space-y-3">
                {CV_TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleLoadTemplate(template)}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-white border border-slate-200 rounded flex items-center justify-center group-hover:border-indigo-300">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{template.name}</p>
                        <p className="text-xs text-slate-500">{template.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Quick Sections</h3>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_SECTIONS.map(section => (
                  <button
                    key={section.id}
                    onClick={() => handleAddSection(section)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors"
                  >
                    <section.icon className="w-5 h-5 mx-auto mb-1 text-slate-500" />
                    <span className="text-xs text-slate-700">{section.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Basic Elements</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddElement('text')}
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors"
                >
                  <Type className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                  <span className="text-xs text-slate-700">Text</span>
                </button>
                <button
                  onClick={() => handleAddElement('heading')}
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors"
                >
                  <Type className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                  <span className="text-xs text-slate-700">Heading</span>
                </button>
                <button
                  onClick={() => handleAddElement('shape')}
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors"
                >
                  <Square className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                  <span className="text-xs text-slate-700">Shape</span>
                </button>
                <button
                  onClick={() => handleAddElement('line')}
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-center transition-colors"
                >
                  <Minus className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                  <span className="text-xs text-slate-700">Line</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
