import React, { useState } from 'react';
import { useDesign } from '@/context/DesignContext';
import { Button } from '@/components/ui/button';
import { CV_TEMPLATES } from '@/data/cvTemplates';
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
                      <div 
                        className="w-10 h-14 border border-slate-200 rounded flex items-center justify-center group-hover:border-indigo-300"
                        style={{ backgroundColor: template.color + '15' }}
                      >
                        <FileText className="w-5 h-5" style={{ color: template.color }} />
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
