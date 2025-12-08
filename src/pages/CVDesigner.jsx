import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import CVTemplateRenderer from '@/components/cv/templates/CVTemplateRenderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Sparkles, 
  Loader2, 
  Check,
  FileText,
  Crown,
  Eye,
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  Star,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const TEMPLATES = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and modern design perfect for corporate roles',
    color: '#4F46E5',
    isPremium: false,
    atsScore: 95,
    popular: true
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with focus on content',
    color: '#1F2937',
    isPremium: false,
    atsScore: 98
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with gradient accents',
    color: '#6366F1',
    isPremium: false,
    atsScore: 94
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with unique layouts and colors',
    color: '#EC4899',
    isPremium: true,
    atsScore: 85
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior positions',
    color: '#0F172A',
    isPremium: true,
    atsScore: 94
  },
  {
    id: 'tech',
    name: 'Tech Modern',
    description: 'Perfect for developers and IT professionals',
    color: '#059669',
    isPremium: false,
    atsScore: 96
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Ideal for research and academic positions',
    color: '#7C3AED',
    isPremium: false,
    atsScore: 92
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Creative portfolio style for designers',
    color: '#F43F5E',
    isPremium: true,
    atsScore: 82
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Fit more content in a single page',
    color: '#6366F1',
    isPremium: false,
    atsScore: 97
  }
];

const DEFAULT_CV_DATA = {
  personal_info: {
    full_name: 'Your Name',
    title: 'Professional Title',
    email: 'email@example.com',
    phone: '+1 234 567 890',
    location: 'City, Country',
    summary: 'A brief professional summary highlighting your key strengths, experience, and career objectives.'
  },
  experiences: [
    {
      job_title: 'Job Title',
      company: 'Company Name',
      location: 'Location',
      start_date: '2020-01',
      end_date: '',
      is_current: true,
      bullet_points: [
        'Key achievement or responsibility',
        'Another important accomplishment',
        'Measurable result or impact'
      ]
    }
  ],
  education: [
    {
      degree: 'Degree',
      field: 'Field of Study',
      institution: 'University Name',
      graduation_date: '2020-05',
      gpa: ''
    }
  ],
  skills: [
    {
      category: 'Technical Skills',
      items: ['Skill 1', 'Skill 2', 'Skill 3']
    }
  ],
  certifications: [],
  languages: [],
  customization: {
    primary_color: '#6366f1'
  }
};

export default function CVDesigner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const previewRef = useRef(null);
  
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [cvData, setCvData] = useState(DEFAULT_CV_DATA);
  const [activeSection, setActiveSection] = useState('personal');
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [cvList, setCvList] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState(null);
  const [zoom, setZoom] = useState(0.6);

  useEffect(() => {
    fetchUserCVs();
  }, []);

  const fetchUserCVs = async () => {
    try {
      const response = await fetch('/api/cvs', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCvList(data);
        if (data.length > 0 && !selectedCvId) {
          loadCV(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  const loadCV = (cv) => {
    setSelectedCvId(cv.id);
    setCvData({
      personal_info: cv.personal_info || DEFAULT_CV_DATA.personal_info,
      experiences: cv.experiences || DEFAULT_CV_DATA.experiences,
      education: cv.education || DEFAULT_CV_DATA.education,
      skills: cv.skills || DEFAULT_CV_DATA.skills,
      certifications: cv.certifications || [],
      languages: cv.languages || [],
      projects: cv.projects || [],
      customization: cv.customization || DEFAULT_CV_DATA.customization
    });
    if (cv.template_id) {
      setSelectedTemplate(cv.template_id);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const method = selectedCvId ? 'PUT' : 'POST';
      const url = selectedCvId ? `/api/cvs/${selectedCvId}` : '/api/cvs';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...cvData,
          template_id: selectedTemplate,
          title: cvData.personal_info.full_name + ' - CV'
        })
      });

      if (response.ok) {
        const savedCv = await response.json();
        setSelectedCvId(savedCv.id);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
        toast.success('CV saved successfully!');
        fetchUserCVs();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save CV');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/cv-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cvData,
          templateId: selectedTemplate
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cvData.personal_info.full_name || 'cv'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        toast.success('PDF exported successfully!');
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast.error('Failed to export PDF. Try saving first.');
    } finally {
      setIsExporting(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personal_info: { ...prev.personal_info, [field]: value }
    }));
  };

  const updateExperience = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        job_title: 'New Position',
        company: 'Company',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        bullet_points: ['']
      }]
    }));
  };

  const removeExperience = (index) => {
    setCvData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: 'Degree',
        field: 'Field of Study',
        institution: 'Institution',
        graduation_date: '',
        gpa: ''
      }]
    }));
  };

  const removeEducation = (index) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateSkillCategory = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const updateCustomization = (field, value) => {
    setCvData(prev => ({
      ...prev,
      customization: { ...prev.customization, [field]: value }
    }));
  };

  const addCertification = () => {
    setCvData(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), { name: '', issuer: '', date: '' }]
    }));
  };

  const updateCertification = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (index) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    setCvData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), { language: '', proficiency: 'Intermediate' }]
    }));
  };

  const updateLanguage = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (index) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { name: '', description: '', technologies: '', link: '' }]
    }));
  };

  const updateProject = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (index) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/Dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">CV Designer</h1>
              <p className="text-xs text-slate-500">
                {cvList.length > 0 ? `Editing: ${cvData.personal_info.full_name}` : 'Create your CV'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1">
            <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}>-</Button>
            <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => setZoom(z => Math.min(1.2, z + 0.1))}>+</Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : showSaved ? (
              <Check className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {showSaved ? 'Saved!' : 'Save'}
          </Button>
          <Button 
            size="sm" 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <Tabs defaultValue="templates" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 m-2">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="edit">Edit CV</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="flex-1 overflow-y-auto p-2 m-0">
              <div className="space-y-2">
                {TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedTemplate === template.id
                        ? 'bg-indigo-50 border-2 border-indigo-500'
                        : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-14 rounded flex items-center justify-center shrink-0"
                        style={{ backgroundColor: template.color + '20' }}
                      >
                        <FileText className="w-5 h-5" style={{ color: template.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900 truncate">{template.name}</p>
                          {template.isPremium && (
                            <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                          )}
                          {template.popular && (
                            <Badge variant="secondary" className="text-[10px] px-1 py-0">Popular</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{template.description}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${template.atsScore}%`,
                                backgroundColor: template.atsScore >= 95 ? '#22c55e' : template.atsScore >= 90 ? '#84cc16' : '#eab308'
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400">ATS {template.atsScore}%</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="edit" className="flex-1 overflow-y-auto p-3 m-0 space-y-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <User className="w-4 h-4" />
                    Personal Info
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Full Name"
                      value={cvData.personal_info.full_name || ''}
                      onChange={(e) => updatePersonalInfo('full_name', e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="Professional Title"
                      value={cvData.personal_info.title || ''}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="Email"
                      value={cvData.personal_info.email || ''}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="Phone"
                      value={cvData.personal_info.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Input
                      placeholder="Location"
                      value={cvData.personal_info.location || ''}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      className="h-8 text-sm"
                    />
                    <textarea
                      placeholder="Professional Summary"
                      value={cvData.personal_info.summary || ''}
                      onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Briefcase className="w-4 h-4" />
                      Experience
                    </div>
                    <Button variant="ghost" size="sm" onClick={addExperience} className="h-6 px-2">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  {cvData.experiences.map((exp, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Position {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeExperience(index)} className="h-5 w-5 p-0 text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Job Title"
                        value={exp.job_title || ''}
                        onChange={(e) => updateExperience(index, 'job_title', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <Input
                        placeholder="Company"
                        value={exp.company || ''}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Start (YYYY-MM)"
                          value={exp.start_date || ''}
                          onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                          className="h-7 text-xs"
                        />
                        <Input
                          placeholder="End (YYYY-MM)"
                          value={exp.end_date || ''}
                          onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                          disabled={exp.is_current}
                          className="h-7 text-xs"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={exp.is_current || false}
                          onChange={(e) => updateExperience(index, 'is_current', e.target.checked)}
                        />
                        Currently working here
                      </label>
                      <Input
                        placeholder="Location"
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">Key Achievements</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              const newBullets = [...(exp.bullet_points || []), ''];
                              updateExperience(index, 'bullet_points', newBullets);
                            }} 
                            className="h-4 px-1 text-[10px]"
                          >
                            <Plus className="w-2 h-2" />
                          </Button>
                        </div>
                        {(exp.bullet_points || []).map((bullet, bIndex) => (
                          <div key={bIndex} className="flex gap-1">
                            <Input
                              placeholder={`Achievement ${bIndex + 1}`}
                              value={bullet}
                              onChange={(e) => {
                                const newBullets = [...exp.bullet_points];
                                newBullets[bIndex] = e.target.value;
                                updateExperience(index, 'bullet_points', newBullets);
                              }}
                              className="h-6 text-[10px] flex-1"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                const newBullets = exp.bullet_points.filter((_, i) => i !== bIndex);
                                updateExperience(index, 'bullet_points', newBullets);
                              }} 
                              className="h-6 w-6 p-0 text-red-400"
                            >
                              <Trash2 className="w-2 h-2" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <GraduationCap className="w-4 h-4" />
                      Education
                    </div>
                    <Button variant="ghost" size="sm" onClick={addEducation} className="h-6 px-2">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Education {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeEducation(index)} className="h-5 w-5 p-0 text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Degree"
                        value={edu.degree || ''}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <Input
                        placeholder="Field of Study"
                        value={edu.field || ''}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <Input
                        placeholder="Institution"
                        value={edu.institution || ''}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Graduation (YYYY-MM)"
                          value={edu.graduation_date || ''}
                          onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)}
                          className="h-7 text-xs"
                        />
                        <Input
                          placeholder="GPA (optional)"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                          className="h-7 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Star className="w-4 h-4" />
                    Skills
                  </div>
                  {cvData.skills.map((skillCat, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded-lg space-y-2">
                      <Input
                        placeholder="Category"
                        value={skillCat.category || ''}
                        onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <Input
                        placeholder="Skills (comma separated)"
                        value={(skillCat.items || []).join(', ')}
                        onChange={(e) => updateSkillCategory(index, 'items', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        className="h-7 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Briefcase className="w-4 h-4" />
                      Projects
                    </div>
                    <Button variant="ghost" size="sm" onClick={addProject} className="h-6 px-2">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  {(cvData.projects || []).map((proj, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Project {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeProject(index)} className="h-5 w-5 p-0 text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Project Name"
                        value={proj.name || ''}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <textarea
                        placeholder="Description"
                        value={proj.description || ''}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded-md resize-none"
                        rows={2}
                      />
                      <Input
                        placeholder="Technologies (comma separated)"
                        value={proj.technologies || ''}
                        onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <Input
                        placeholder="Link (optional)"
                        value={proj.link || ''}
                        onChange={(e) => updateProject(index, 'link', e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Star className="w-4 h-4" />
                      Certifications
                    </div>
                    <Button variant="ghost" size="sm" onClick={addCertification} className="h-6 px-2">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  {(cvData.certifications || []).map((cert, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Certification {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeCertification(index)} className="h-5 w-5 p-0 text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Certification Name"
                        value={cert.name || ''}
                        onChange={(e) => updateCertification(index, 'name', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <Input
                        placeholder="Issuer (optional)"
                        value={cert.issuer || ''}
                        onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <Input
                        placeholder="Date (e.g., 2023)"
                        value={cert.date || ''}
                        onChange={(e) => updateCertification(index, 'date', e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Star className="w-4 h-4" />
                      Languages
                    </div>
                    <Button variant="ghost" size="sm" onClick={addLanguage} className="h-6 px-2">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  {(cvData.languages || []).map((lang, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Language {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeLanguage(index)} className="h-5 w-5 p-0 text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Language"
                        value={lang.language || ''}
                        onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                        className="h-7 text-xs"
                      />
                      <select
                        value={lang.proficiency || 'Intermediate'}
                        onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                        className="w-full h-7 text-xs border border-slate-200 rounded-md px-2"
                      >
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Elementary">Elementary</option>
                      </select>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Sparkles className="w-4 h-4" />
                    Styling
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Accent Color</Label>
                    <div className="flex gap-2">
                      {['#6366f1', '#ec4899', '#059669', '#f59e0b', '#0ea5e9', '#8b5cf6', '#1e293b', '#0f172a'].map(color => (
                        <button
                          key={color}
                          onClick={() => updateCustomization('primary_color', color)}
                          className={`w-6 h-6 rounded-full border-2 ${
                            cvData.customization?.primary_color === color ? 'border-slate-900 scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Font Family</Label>
                    <select
                      value={cvData.customization?.font_family || 'Inter, system-ui, sans-serif'}
                      onChange={(e) => updateCustomization('font_family', e.target.value)}
                      className="w-full h-8 text-xs border border-slate-200 rounded-md px-2"
                    >
                      <option value="Inter, system-ui, sans-serif">Inter (Modern)</option>
                      <option value="Georgia, serif">Georgia (Classic)</option>
                      <option value="system-ui, -apple-system, sans-serif">System Default</option>
                      <option value="'Playfair Display', Georgia, serif">Playfair Display (Elegant)</option>
                      <option value="Arial, sans-serif">Arial (Clean)</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {cvList.length > 0 && (
            <div className="border-t border-slate-200 p-2">
              <p className="text-xs text-slate-500 mb-2">Your CVs</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {cvList.map(cv => (
                  <button
                    key={cv.id}
                    onClick={() => loadCV(cv)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs truncate ${
                      selectedCvId === cv.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100'
                    }`}
                  >
                    {cv.title || cv.personal_info?.full_name || 'Untitled CV'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div 
          className="flex-1 overflow-auto bg-slate-200 p-8"
          style={{ 
            backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          <div className="flex items-center justify-center min-h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="origin-top"
              style={{ transform: `scale(${zoom})` }}
            >
              <div 
                ref={previewRef}
                className="bg-white shadow-2xl"
                style={{ width: '210mm', minHeight: '297mm' }}
              >
                <CVTemplateRenderer 
                  data={cvData} 
                  templateId={selectedTemplate}
                  forExport={false}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
