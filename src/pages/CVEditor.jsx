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
  Sun,
  Info,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import CVTemplateRenderer from '@/components/cv/templates/CVTemplateRenderer';
import PagedCVPreview from '@/components/cv/PagedCVPreview';
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

function CelebrationBurst({ celebration }) {
  if (!celebration) return null;
  const particles = Array.from({ length: 18 }, (_, index) => index);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="rounded-full bg-indigo-600/10 px-4 py-2 text-sm font-semibold text-indigo-700 shadow">
          {celebration.title}
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-xs text-slate-600 shadow">
          {celebration.message}
        </div>
      </div>
      {particles.map((particle) => (
        <motion.span
          key={particle}
          className="absolute left-1/2 top-12 h-2 w-2 rounded-full bg-indigo-500"
          initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          animate={{
            opacity: [1, 1, 0],
            y: 220,
            x: (particle - 9) * 18,
            scale: [1, 1.2, 0.6],
          }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

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
  const [isExporting, setIsExporting] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [aiDiffMode, setAiDiffMode] = useState('after');
  const [aiBaseline, setAiBaseline] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [achievementFlags, setAchievementFlags] = useState({
    firstSummary: false,
    firstExperience: false,
    firstSkills: false,
    firstMetric: false,
  });
  const [quickStart, setQuickStart] = useState({
    role: '',
    level: '',
    target: '',
    templateId: '',
    atsTarget: '85',
  });
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

  const buildQuickStartSummary = ({ role, level, target }) => {
    const targetLine = target
      ? `Targeting roles at ${target} with a focus on outcomes, clarity, and measurable impact.`
      : 'Focused on outcomes, clarity, and measurable impact across every project.';

    return `Impact-driven ${role} (${level}) with a track record of turning goals into results through structured execution and thoughtful collaboration. ${targetLine}`;
  };

  const tokenize = (value = '') => value.split(/\s+/).filter(Boolean);

  const highlightDiff = (beforeText, afterText, mode) => {
    const beforeTokens = tokenize(beforeText);
    const afterTokens = tokenize(afterText);
    const beforeSet = new Set(beforeTokens);
    const afterSet = new Set(afterTokens);

    if (mode === 'before') {
      return beforeTokens.map((token, index) => ({
        token,
        status: afterSet.has(token) ? 'same' : 'removed',
        key: `${token}-${index}`,
      }));
    }

    return afterTokens.map((token, index) => ({
      token,
      status: beforeSet.has(token) ? 'same' : 'added',
      key: `${token}-${index}`,
    }));
  };

  const countBulletPoints = (experiences = []) =>
    experiences.reduce((total, experience) => total + (experience.bullet_points?.length || 0), 0);

  const countSkillItems = (skills = []) =>
    skills.reduce((total, group) => total + (group.items?.length || 0), 0);

  const countMetrics = (text = '') => (text.match(/\d+/g) || []).length;

  const getDailyWins = (current) => {
    const summary = current.personal_info?.summary || '';
    const experiences = current.experiences || [];
    const skills = current.skills || [];
    const metricsCount = countMetrics(summary);

    return [
      {
        id: 'summary',
        label: 'Write a confident summary',
        done: Boolean(summary),
        hint: 'Lead with your role, impact, and signature strengths.',
      },
      {
        id: 'title',
        label: 'Add a role headline',
        done: Boolean(current.personal_info?.title),
        hint: 'Match the role you want so recruiters immediately get your direction.',
      },
      {
        id: 'experience',
        label: 'Add your first experience',
        done: experiences.length > 0,
        hint: 'Start with your most recent win and quantify it if you can.',
      },
      {
        id: 'skills',
        label: 'List at least 5 skills',
        done: countSkillItems(skills) >= 5,
        hint: 'Highlight tools, methods, and strengths recruiters search for.',
      },
      {
        id: 'metrics',
        label: 'Show 1 measurable impact',
        done: metricsCount > 0,
        hint: 'Numbers create instant credibility (%, $, time saved).',
      },
    ];
  };

  const getAiInsights = (before, after) => {
    const insights = [];
    const beforeSummary = before.personal_info?.summary || '';
    const afterSummary = after.personal_info?.summary || '';

    if (beforeSummary !== afterSummary && afterSummary) {
      insights.push({
        title: 'Sharper professional summary',
        detail: 'Refined your opening story to lead with impact and intent.',
        rationale: 'Recruiters scan the summary first—clear positioning increases relevance fast.',
      });
    }

    if (before.personal_info?.title !== after.personal_info?.title && after.personal_info?.title) {
      insights.push({
        title: 'Stronger role positioning',
        detail: 'Aligned your headline with the role you want, not just the role you had.',
        rationale: 'Clear titles map to recruiter searches and ATS matching logic.',
      });
    }

    const beforeBulletCount = countBulletPoints(before.experiences);
    const afterBulletCount = countBulletPoints(after.experiences);
    if (afterBulletCount > beforeBulletCount) {
      insights.push({
        title: 'Expanded impact bullets',
        detail: `Added ${afterBulletCount - beforeBulletCount} more impact points across roles.`,
        rationale: 'Action-oriented bullets surface measurable wins and responsibility scope.',
      });
    }

    const beforeSkillCount = countSkillItems(before.skills);
    const afterSkillCount = countSkillItems(after.skills);
    if (afterSkillCount > beforeSkillCount) {
      insights.push({
        title: 'Richer skill signal',
        detail: `Added ${afterSkillCount - beforeSkillCount} relevant skills to the grid.`,
        rationale: 'Higher keyword coverage improves ATS match and recruiter confidence.',
      });
    }

    const beforeMetrics = countMetrics(beforeSummary);
    const afterMetrics = countMetrics(afterSummary);
    if (afterMetrics > beforeMetrics) {
      insights.push({
        title: 'More quantified outcomes',
        detail: 'Introduced measurable proof points to validate performance.',
        rationale: 'Numbers make achievements credible and instantly scannable.',
      });
    }

    return insights.slice(0, 4);
  };

  const quickStartSkillMap = {
    'Software Engineer': ['React', 'API Integration', 'Testing', 'Performance Optimization', 'System Design'],
    'Product Manager': ['Roadmapping', 'Stakeholder Management', 'User Research', 'Metrics Analysis', 'Launch Planning'],
    'Designer': ['UX Research', 'UI Systems', 'Prototyping', 'Figma', 'Design Strategy'],
    'Data Analyst': ['SQL', 'Dashboarding', 'A/B Testing', 'Data Storytelling', 'Python'],
    'Marketing': ['Campaign Strategy', 'Content Planning', 'Lifecycle Marketing', 'Analytics', 'Brand Positioning'],
    'Sales': ['Pipeline Management', 'Negotiation', 'Account Strategy', 'Prospecting', 'CRM'],
    'Operations': ['Process Optimization', 'Project Management', 'Cross-team Alignment', 'SOPs', 'KPI Tracking'],
    'Customer Support': ['Customer Success', 'Issue Resolution', 'Zendesk', 'Retention', 'Empathy & Communication'],
  };

  const templateRecommendations = {
    'Software Engineer': 'tech',
    'Product Manager': 'modern',
    'Designer': 'creative',
    'Data Analyst': 'professional',
    'Marketing': 'creative',
    'Sales': 'executive',
    'Operations': 'professional',
    'Customer Support': 'minimal',
  };

  const templateOptions = [
    { id: 'professional', label: 'Professional', color: '#1e40af' },
    { id: 'modern', label: 'Modern', color: '#6366f1' },
    { id: 'minimal', label: 'Minimal', color: '#111827' },
    { id: 'executive', label: 'Executive', color: '#1c1917' },
    { id: 'tech', label: 'Tech', color: '#10b981' },
    { id: 'creative', label: 'Creative', color: '#ec4899' },
    { id: 'academic', label: 'Academic', color: '#7c3aed' },
    { id: 'compact', label: 'Compact', color: '#3b82f6' },
  ];

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
      const previousCv = cvData;
      const enhanced = await api.ai.enhanceCV(cvData);
      
      if (enhanced) {
        const nextCv = {
          ...previousCv,
          personal_info: {
            ...previousCv.personal_info,
            ...enhanced.personal_info,
          },
          experiences: enhanced.experiences || previousCv.experiences,
          skills: enhanced.skills || previousCv.skills,
        };

        setAiBaseline(previousCv);
        setCvData(nextCv);
        setAiDiffMode('after');
        setAiInsights(getAiInsights(previousCv, nextCv));
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
    setIsExporting(true);
    toast.loading('Generating your PDF...', { id: 'export-pdf' });
    try {
      const blob = await api.export.cvPdf(cvData, cvData.template_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cvData.title || 'cv'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported successfully!', { id: 'export-pdf' });
    } catch (error) {
      toast.error(error.message || 'Failed to export PDF', { id: 'export-pdf' });
    } finally {
      setIsExporting(false);
    }
  };

  const isQuickStartEligible =
    !cvId &&
    !cvData.personal_info.summary &&
    !cvData.personal_info.title &&
    cvData.experiences.length === 0 &&
    cvData.skills.length === 0;

  const handleQuickStart = () => {
    if (!quickStart.role || !quickStart.level) {
      toast.error('Add a role and level to ignite your first draft.');
      return;
    }

    const recommendedTemplate = templateRecommendations[quickStart.role] || 'professional';
    const chosenTemplate = quickStart.templateId || recommendedTemplate;
    const suggestedSkills = quickStartSkillMap[quickStart.role] || [];
    const nextSkills = cvData.skills.length
      ? cvData.skills
      : suggestedSkills.length
      ? [
          {
            category: 'Core Strengths',
            items: suggestedSkills,
          },
        ]
      : [];

    setCvData(prev => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        title: prev.personal_info.title || quickStart.role,
        summary: prev.personal_info.summary || buildQuickStartSummary(quickStart),
      },
      template_id: prev.template_id || chosenTemplate,
      skills: nextSkills,
    }));
    setHasChanges(true);
    setActiveSection('experience');
    toast.success('Your foundation is live. Add one experience to level it up.');
  };

  useEffect(() => {
    const summary = cvData.personal_info?.summary || '';
    const metricsCount = countMetrics(summary);

    if (!achievementFlags.firstSummary && summary) {
      setAchievementFlags(prev => ({ ...prev, firstSummary: true }));
      setCelebration({
        title: 'Summary Spark!',
        message: 'You just crafted the headline story recruiters look for.',
      });
    }

    if (!achievementFlags.firstExperience && cvData.experiences.length > 0) {
      setAchievementFlags(prev => ({ ...prev, firstExperience: true }));
      setCelebration({
        title: 'Experience Unlocked!',
        message: 'Your first role is live—momentum activated.',
      });
    }

    if (!achievementFlags.firstSkills && countSkillItems(cvData.skills) >= 5) {
      setAchievementFlags(prev => ({ ...prev, firstSkills: true }));
      setCelebration({
        title: 'Skill Stack Online!',
        message: 'You just signaled the tools recruiters search for.',
      });
    }

    if (!achievementFlags.firstMetric && metricsCount > 0) {
      setAchievementFlags(prev => ({ ...prev, firstMetric: true }));
      setCelebration({
        title: 'Metric Master!',
        message: 'Quantified impact detected—instant credibility boost.',
      });
    }
  }, [achievementFlags, cvData]);

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => setCelebration(null), 3500);
    return () => clearTimeout(timer);
  }, [celebration]);

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

  const dailyWins = getDailyWins(cvData);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CelebrationBurst celebration={celebration} />
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

      <AnimatePresence>
        {isQuickStartEligible && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-6"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 via-white to-purple-50">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
                      <Sparkles className="w-4 h-4" />
                      First 60 seconds magic
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      Build a magnetic first draft in under a minute.
                    </h2>
                    <p className="text-sm text-slate-600 max-w-xl">
                      Tell us who you are and where you’re headed. We’ll generate a powerful headline,
                      summary, and skill signal so you can jump straight into experiences.
                    </p>
                  </div>

                  <div className="grid gap-3 w-full lg:max-w-md">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <label className="text-xs font-semibold text-slate-600">
                        Role
                        <select
                          value={quickStart.role}
                          onChange={(event) => setQuickStart(prev => ({ ...prev, role: event.target.value }))}
                          className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          {Object.keys(quickStartSkillMap).map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </label>

                      <label className="text-xs font-semibold text-slate-600">
                        Level
                        <select
                          value={quickStart.level}
                          onChange={(event) => setQuickStart(prev => ({ ...prev, level: event.target.value }))}
                          className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          <option value="Entry">Entry</option>
                          <option value="Mid-level">Mid-level</option>
                          <option value="Senior">Senior</option>
                          <option value="Lead">Lead</option>
                          <option value="Executive">Executive</option>
                        </select>
                      </label>

                      <label className="text-xs font-semibold text-slate-600">
                        Target
                        <input
                          value={quickStart.target}
                          onChange={(event) => setQuickStart(prev => ({ ...prev, target: event.target.value }))}
                          placeholder="Company or industry"
                          className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </label>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-600">Template match</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {templateOptions.find((option) => option.id === (quickStart.templateId || templateRecommendations[quickStart.role] || 'professional'))?.label || 'Professional'}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">
                          ATS Target {quickStart.atsTarget}%
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {templateOptions.slice(0, 4).map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => setQuickStart(prev => ({ ...prev, templateId: template.id }))}
                            className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                              (quickStart.templateId || templateRecommendations[quickStart.role] || 'professional') === template.id
                                ? 'text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            style={
                              (quickStart.templateId || templateRecommendations[quickStart.role] || 'professional') === template.id
                                ? { backgroundColor: template.color }
                                : {}
                            }
                          >
                            {template.label}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <label className="text-xs font-semibold text-slate-600">
                          ATS target
                          <select
                            value={quickStart.atsTarget}
                            onChange={(event) => setQuickStart(prev => ({ ...prev, atsTarget: event.target.value }))}
                            className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="80">80% (solid)</option>
                            <option value="85">85% (strong)</option>
                            <option value="90">90% (elite)</option>
                          </select>
                        </label>
                        <div className="text-xs text-slate-500 flex items-end pb-1">
                          Aim above 85% to beat ATS filters and human skim time.
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleQuickStart}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate my first draft
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="border-0 shadow-sm mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Daily micro-wins
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {dailyWins.filter((win) => win.done).length}/{dailyWins.length} complete
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Stack small wins today and watch your CV power up fast.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3">
          {dailyWins.map((win) => (
            <div
              key={win.id}
              className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 ${
                win.done ? 'border-emerald-100 bg-emerald-50' : 'border-slate-100 bg-white'
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${win.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                  {win.label}
                </p>
                <p className="text-xs text-slate-500 mt-1">{win.hint}</p>
              </div>
              <Badge variant="secondary" className={`text-xs ${win.done ? 'bg-emerald-100 text-emerald-700' : ''}`}>
                {win.done ? 'Done' : 'Next'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`${showPreview ? 'hidden lg:block' : ''}`}>
          {aiInsights.length > 0 && (
            <Card className="border-0 shadow-sm mb-6">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Smart improvements + rationale
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-1">
                    Here’s what the AI strengthened and why it matters to hiring teams.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <TooltipProvider>
                  {aiInsights.map((insight, index) => (
                    <div
                      key={`${insight.title}-${index}`}
                      className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                          <p className="text-xs text-slate-600 mt-1">{insight.detail}</p>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 hover:text-indigo-600"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>{insight.rationale}</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </TooltipProvider>
              </CardContent>
            </Card>
          )}

          {aiBaseline && (
            <Card className="border-0 shadow-sm mb-6">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    Before/after diff mode
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={aiDiffMode === 'before' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setAiDiffMode('before')}
                    >
                      Before
                    </Button>
                    <Button
                      variant={aiDiffMode === 'after' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setAiDiffMode('after')}
                    >
                      After
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Compare how the AI refined your headline and summary.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Headline</p>
                  <p className="text-sm font-semibold text-slate-900 mt-2">
                    {aiDiffMode === 'before'
                      ? aiBaseline.personal_info?.title || 'No headline yet'
                      : cvData.personal_info?.title || 'No headline yet'}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Summary</p>
                  <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                    {highlightDiff(
                      aiBaseline.personal_info?.summary || '',
                      cvData.personal_info?.summary || '',
                      aiDiffMode
                    ).map((chunk) => (
                      <span
                        key={chunk.key}
                        className={
                          chunk.status === 'added'
                            ? 'bg-emerald-100 text-emerald-700 px-1 rounded'
                            : chunk.status === 'removed'
                            ? 'bg-rose-100 text-rose-700 line-through px-1 rounded'
                            : ''
                        }
                      >
                        {chunk.token}{' '}
                      </span>
                    ))}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportPdf}
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {isExporting ? 'Exporting...' : 'Export'}
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
              <div className="overflow-auto max-h-[calc(100vh-200px)]">
                <PagedCVPreview data={cvData} templateId={cvData.template_id} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
