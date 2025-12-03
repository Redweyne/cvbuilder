import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Eye, 
  Download, 
  Wand2, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  FolderOpen,
  Sparkles,
  Check,
  Loader2,
  ArrowLeft,
  LayoutTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

import CVPreview from '@/components/cv/CVPreview';
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
  
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
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
    queryFn: () => base44.entities.CVDocument.filter({ id: cvId }),
    enabled: !!cvId,
  });

  useEffect(() => {
    if (existingCV && existingCV.length > 0) {
      setCvData(existingCV[0]);
    }
  }, [existingCV]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (cvId) {
        return base44.entities.CVDocument.update(cvId, data);
      } else {
        return base44.entities.CVDocument.create(data);
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
      setIsSaving(false);
      if (!cvId && result?.id) {
        window.history.replaceState(null, '', `${window.location.pathname}?id=${result.id}`);
      }
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    await saveMutation.mutateAsync(cvData);
  };

  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    
    const prompt = `
    Enhance this CV data to make it more professional and ATS-friendly. 
    Improve the summary to be compelling and keyword-rich.
    Rewrite bullet points using strong action verbs and quantifiable achievements.
    
    Current CV data:
    ${JSON.stringify(cvData, null, 2)}
    
    Return the enhanced CV data in the exact same JSON structure.
    `;
    
    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          personal_info: {
            type: "object",
            properties: {
              summary: { type: "string" }
            }
          },
          experiences: {
            type: "array",
            items: {
              type: "object",
              properties: {
                job_title: { type: "string" },
                bullet_points: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    });
    
    if (response) {
      setCvData(prev => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          summary: response.personal_info?.summary || prev.personal_info.summary
        },
        experiences: prev.experiences.map((exp, idx) => ({
          ...exp,
          bullet_points: response.experiences?.[idx]?.bullet_points || exp.bullet_points
        }))
      }));
    }
    
    setIsEnhancing(false);
  };

  const updateCVData = (section, data) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
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
      {/* Header */}
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
              onChange={(e) => setCvData(prev => ({ ...prev, title: e.target.value }))}
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
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
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

      {/* Main Editor */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className={`${showPreview ? 'hidden lg:block' : ''}`}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              {/* Section Tabs */}
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

              {/* Form Content */}
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

                {/* Section Navigation */}
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

        {/* Preview Section */}
        <div className={`${!showPreview ? 'hidden lg:block' : ''}`}>
          <Card className="border-0 shadow-sm sticky top-6">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Preview</CardTitle>
                <div className="flex items-center gap-2">
                  <Link to={createPageUrl('Templates')}>
                    <Button variant="outline" size="sm">
                      <LayoutTemplate className="w-4 h-4 mr-2" />
                      Templates
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-slate-100 rounded-lg p-4 overflow-auto max-h-[calc(100vh-200px)]">
                <CVPreview data={cvData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}