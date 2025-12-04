import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Eye, 
  Download, 
  Wand2, 
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Loader2,
  ArrowLeft,
  LayoutTemplate,
  FileText,
  CheckCircle,
  Upload,
  FileUp,
  Sparkles,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import CVTemplateRenderer from '@/components/cv/templates/CVTemplateRenderer';
import PersonalInfoForm from '@/components/cv/PersonalInfoForm';
import ExperienceForm from '@/components/cv/ExperienceForm';
import EducationForm from '@/components/cv/EducationForm';
import SkillsForm from '@/components/cv/SkillsForm';

const sections = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Award },
];

export default function CVEditor() {
  const urlParams = new URLSearchParams(window.location.search);
  const cvId = urlParams.get('id');
  const isUploadMode = urlParams.get('upload') === 'true';
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(isUploadMode && !cvId);
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [cvData, setCvData] = useState({
    title: 'My CV',
    template_id: 'professional',
    personal_info: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    customization: {
      primary_color: '#4F46E5',
      secondary_color: '#6366F1',
      font_family: 'Inter',
      font_size: 'medium',
      spacing: 'normal'
    },
    status: 'draft'
  });

  const queryClient = useQueryClient();

  const { data: existingCV, isLoading: loadingCV } = useQuery({
    queryKey: ['cv', cvId],
    queryFn: () => api.cvs.get(cvId),
    enabled: !!cvId,
  });

  useEffect(() => {
    if (existingCV) {
      setCvData(existingCV);
    }
  }, [existingCV]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (cvId) {
        return api.cvs.update(cvId, data);
      } else {
        return api.cvs.create(data);
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
      queryClient.invalidateQueries({ queryKey: ['cv', cvId] });
      setIsSaving(false);
      setHasChanges(false);
      toast.success('CV saved successfully!');
      if (!cvId && result?.id) {
        navigate(`/CVEditor?id=${result.id}`, { replace: true });
      }
    },
    onError: (error) => {
      setIsSaving(false);
      toast.error(error.message || 'Failed to save CV');
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    await saveMutation.mutateAsync(cvData);
  };

  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    
    try {
      const enhanced = await api.ai.enhanceCV(cvData);
      
      if (enhanced) {
        setCvData(prev => ({
          ...prev,
          personal_info: {
            ...prev.personal_info,
            ...enhanced.personal_info
          },
          experiences: enhanced.experiences || prev.experiences,
          skills: enhanced.skills || prev.skills
        }));
        setHasChanges(true);
        toast.success('CV enhanced with AI! Review the changes and save.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to enhance CV with AI');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      const blob = await api.export.cvPdf(cvData, cvData.template_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cvData.title || 'cv'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to export PDF');
    }
  };

  const updateCVData = (section, data) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
    setHasChanges(true);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      toast.error('Please upload a PDF, Word document, or text file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    setUploadedFileName(file.name);
    setIsParsing(true);
    
    try {
      const parsedData = await api.ai.parseCV(file);
      
      const transformedExperiences = (parsedData.experiences || []).map(exp => ({
        ...exp,
        job_title: exp.title || exp.job_title || '',
        bullet_points: exp.achievements || exp.bullet_points || [],
        is_current: exp.current || exp.is_current || false
      }));
      
      const transformedEducation = (parsedData.education || []).map(edu => ({
        ...edu,
        start_date: edu.start_date || '',
        graduation_date: edu.end_date || edu.graduation_date || ''
      }));
      
      const transformedSkills = (parsedData.skills || []).map((skill, index) => {
        if (typeof skill === 'string') {
          return { id: `skill_${index}`, category: 'General', items: [skill] };
        }
        if (skill.name && !skill.items) {
          return { 
            id: skill.id || `skill_${index}`, 
            category: skill.category || 'General', 
            items: [skill.name] 
          };
        }
        return skill;
      });
      
      const groupedSkills = transformedSkills.reduce((acc, skill) => {
        const category = skill.category || 'General';
        const existing = acc.find(s => s.category === category);
        if (existing) {
          existing.items = [...new Set([...(existing.items || []), ...(skill.items || [])])];
        } else {
          acc.push({ id: skill.id || `skill_cat_${acc.length}`, category, items: skill.items || [] });
        }
        return acc;
      }, []);
      
      const transformedLanguages = (parsedData.languages || []).map(lang => ({
        ...lang,
        language: lang.name || lang.language || '',
        proficiency: lang.proficiency || 'Intermediate'
      }));
      
      setCvData(prev => ({
        ...prev,
        title: parsedData.personal_info?.full_name 
          ? `${parsedData.personal_info.full_name}'s CV` 
          : 'Imported CV',
        personal_info: {
          ...prev.personal_info,
          ...parsedData.personal_info
        },
        experiences: transformedExperiences,
        education: transformedEducation,
        skills: groupedSkills,
        certifications: parsedData.certifications || [],
        languages: transformedLanguages,
        projects: parsedData.projects || []
      }));
      
      setHasChanges(true);
      setShowUploadModal(false);
      toast.success('CV imported successfully! Review and edit your information.');
      
      navigate('/CVEditor', { replace: true });
    } catch (error) {
      console.error('CV parsing error:', error);
      toast.error(error.message || 'Failed to parse CV. Please try again.');
    } finally {
      setIsParsing(false);
      setUploadedFileName('');
    }
  };

  if (loadingCV && cvId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isParsing && setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Import Your CV</h2>
                    <p className="text-sm text-slate-500">AI will extract all your information</p>
                  </div>
                </div>
                {!isParsing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowUploadModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {isParsing ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Analyzing Your CV</h3>
                  <p className="text-slate-500 mb-2">AI is extracting your information...</p>
                  <p className="text-sm text-slate-400">{uploadedFileName}</p>
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-indigo-600">
                    <Sparkles className="w-4 h-4" />
                    <span>This may take a few seconds</span>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragActive 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-4">
                      <FileUp className="w-8 h-8 text-indigo-600" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {dragActive ? 'Drop your file here' : 'Drag & drop your CV'}
                    </h3>
                    <p className="text-slate-500 mb-4">or click to browse</p>
                    
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Select File
                    </Button>
                    
                    <p className="text-xs text-slate-400 mt-4">
                      Supports PDF, Word (.doc, .docx), and text files up to 10MB
                    </p>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-slate-900 text-sm">AI-Powered Import</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Our AI will automatically extract your personal info, work experience, 
                          education, skills, and more from your existing CV.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      Skip and create from scratch
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('MyCVs')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <Input
              value={cvData.title}
              onChange={(e) => {
                setCvData(prev => ({ ...prev, title: e.target.value }));
                setHasChanges(true);
              }}
              className="text-xl font-semibold border-none px-0 h-auto focus-visible:ring-0 bg-transparent"
              placeholder="CV Title"
            />
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {cvData.status || 'Draft'}
              </Badge>
              {cvData.ats_score && (
                <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                  ATS: {cvData.ats_score}%
                </Badge>
              )}
              {hasChanges && (
                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                  Unsaved changes
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowUploadModal(true)}
            className="hidden sm:flex border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CV
          </Button>
          
          <Button
            variant="outline"
            onClick={handleEnhanceWithAI}
            disabled={isEnhancing}
            className="hidden sm:flex"
          >
            {isEnhancing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            Enhance with AI
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`${showPreview ? 'hidden lg:block' : ''}`}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-slate-100 p-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveSection(section.id)}
                      className={`flex-shrink-0 ${
                        activeSection === section.id 
                          ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100' 
                          : ''
                      }`}
                    >
                      <section.icon className="w-4 h-4 mr-2" />
                      {section.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeSection === 'personal' && (
                      <PersonalInfoForm
                        data={cvData.personal_info}
                        onChange={(data) => updateCVData('personal_info', data)}
                      />
                    )}
                    {activeSection === 'experience' && (
                      <ExperienceForm
                        data={cvData.experiences}
                        onChange={(data) => updateCVData('experiences', data)}
                      />
                    )}
                    {activeSection === 'education' && (
                      <EducationForm
                        data={cvData.education}
                        onChange={(data) => updateCVData('education', data)}
                      />
                    )}
                    {activeSection === 'skills' && (
                      <SkillsForm
                        data={cvData.skills}
                        onChange={(data) => updateCVData('skills', data)}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1].id);
                      }
                    }}
                    disabled={activeSection === sections[0].id}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1].id);
                      }
                    }}
                    disabled={activeSection === sections[sections.length - 1].id}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={`${!showPreview ? 'hidden lg:block' : ''}`}>
          <Card className="border-0 shadow-sm sticky top-6">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportPdf}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'professional', label: 'Professional', color: '#1e40af' },
                    { id: 'modern', label: 'Modern', color: '#6366f1' },
                    { id: 'minimal', label: 'Minimal', color: '#111827' },
                    { id: 'executive', label: 'Executive', color: '#1c1917' },
                    { id: 'tech', label: 'Tech', color: '#10b981' },
                    { id: 'creative', label: 'Creative', color: '#ec4899' },
                    { id: 'academic', label: 'Academic', color: '#7c3aed' },
                    { id: 'compact', label: 'Compact', color: '#3b82f6' },
                  ].map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setCvData(prev => ({ ...prev, template_id: template.id }));
                        setHasChanges(true);
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                        cvData.template_id === template.id
                          ? 'text-white shadow-md scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      style={cvData.template_id === template.id ? { backgroundColor: template.color } : {}}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-slate-100 rounded-lg p-4 overflow-auto max-h-[calc(100vh-200px)]">
                <CVTemplateRenderer data={cvData} templateId={cvData.template_id} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
