import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Wand2,
  Target,
  FileText,
  Briefcase,
  ChevronRight,
  Check,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TailorCV() {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('job');

  const [selectedCV, setSelectedCV] = useState('');
  const [selectedJob, setSelectedJob] = useState(jobId || '');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoredCV, setTailoredCV] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const queryClient = useQueryClient();

  const { data: cvs = [], isLoading: loadingCVs } = useQuery({
    queryKey: ['cvs'],
    queryFn: () => base44.entities.CVDocument.list('-updated_date'),
  });

  const { data: jobs = [], isLoading: loadingJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => base44.entities.JobOffer.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CVDocument.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });

  const analyzeAndTailor = async () => {
    if (!selectedCV || !selectedJob) return;
    setIsTailoring(true);
    setAnalysisResult(null);

    const cv = cvs.find(c => c.id === selectedCV);
    const job = jobs.find(j => j.id === selectedJob);

    // First analyze the match
    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `
        Analyze how well this CV matches the job requirements and provide specific recommendations.
        
        CV Data:
        ${JSON.stringify(cv, null, 2)}
        
        Job Description:
        Title: ${job.title}
        Company: ${job.company}
        Requirements: ${job.requirements?.join(', ') || 'Not specified'}
        Required Skills: ${job.required_skills?.join(', ') || 'Not specified'}
        Description: ${job.description || 'Not specified'}
        
        Provide:
        1. Overall match score (0-100)
        2. Key strengths (skills/experience that match well)
        3. Gaps (missing skills or experience)
        4. ATS keyword suggestions to add
        5. Specific improvements for bullet points
      `,
      response_json_schema: {
        type: "object",
        properties: {
          match_score: { type: "number" },
          ats_score: { type: "number" },
          strengths: { type: "array", items: { type: "string" } },
          gaps: { type: "array", items: { type: "string" } },
          keywords_to_add: { type: "array", items: { type: "string" } },
          summary_recommendation: { type: "string" },
          experience_improvements: {
            type: "array",
            items: {
              type: "object",
              properties: {
                original: { type: "string" },
                improved: { type: "string" }
              }
            }
          }
        }
      }
    });

    setAnalysisResult(analysis);

    // Now generate tailored CV
    const tailored = await base44.integrations.Core.InvokeLLM({
      prompt: `
        Rewrite this CV to be perfectly tailored for the target job. 
        Keep the same structure but:
        - Optimize the professional summary for this specific role
        - Rewrite bullet points to highlight relevant experience using strong action verbs
        - Include ATS-friendly keywords from the job description
        - Quantify achievements where possible
        - Adjust tone to match company culture (${job.tone || 'professional'})
        
        Original CV:
        ${JSON.stringify(cv, null, 2)}
        
        Target Job:
        Title: ${job.title}
        Company: ${job.company}
        Requirements: ${job.requirements?.join(', ')}
        Skills: ${job.required_skills?.join(', ')}
        
        Return the complete tailored CV in the same JSON structure.
      `,
      response_json_schema: {
        type: "object",
        properties: {
          personal_info: {
            type: "object",
            properties: {
              full_name: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              location: { type: "string" },
              linkedin: { type: "string" },
              website: { type: "string" },
              summary: { type: "string" }
            }
          },
          experiences: {
            type: "array",
            items: {
              type: "object",
              properties: {
                job_title: { type: "string" },
                company: { type: "string" },
                location: { type: "string" },
                start_date: { type: "string" },
                end_date: { type: "string" },
                is_current: { type: "boolean" },
                bullet_points: { type: "array", items: { type: "string" } }
              }
            }
          },
          skills: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: { type: "string" },
                items: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    });

    setTailoredCV({
      ...cv,
      ...tailored,
      title: `${cv.title} - Tailored for ${job.company}`,
      target_job_id: job.id,
      ats_score: analysis.ats_score,
      job_match_score: analysis.match_score,
      is_base_cv: false
    });

    setIsTailoring(false);
  };

  const saveTailoredCV = async () => {
    if (!tailoredCV) return;
    const { id, created_date, updated_date, created_by, ...cvData } = tailoredCV;
    await createMutation.mutateAsync(cvData);
    window.location.href = createPageUrl('MyCVs');
  };

  const currentCV = cvs.find(c => c.id === selectedCV);
  const currentJob = jobs.find(j => j.id === selectedJob);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to={createPageUrl('Dashboard')}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tailor Your CV</h1>
          <p className="text-slate-600 mt-1">AI-powered CV optimization for specific job offers</p>
        </div>
      </div>

      {/* Selection Step */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Select CV */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-indigo-600" />
              Select Your CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCV} onValueChange={setSelectedCV}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a CV to tailor..." />
              </SelectTrigger>
              <SelectContent>
                {cvs.map(cv => (
                  <SelectItem key={cv.id} value={cv.id}>
                    <div className="flex items-center gap-2">
                      <span>{cv.title}</span>
                      {cv.is_base_cv && (
                        <Badge variant="secondary" className="text-xs">Master</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {currentCV && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">{currentCV.title}</h4>
                <p className="text-sm text-slate-600 mb-2">
                  {currentCV.personal_info?.full_name || 'No name'} • 
                  {currentCV.experiences?.length || 0} experiences
                </p>
                {currentCV.ats_score && (
                  <Badge variant="secondary">Current ATS: {currentCV.ats_score}%</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Select Job */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Select Target Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a job offer..." />
              </SelectTrigger>
              <SelectContent>
                {jobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} at {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {currentJob && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">{currentJob.title}</h4>
                <p className="text-sm text-slate-600 mb-2">
                  {currentJob.company} • {currentJob.location || 'Remote'}
                </p>
                {currentJob.required_skills && currentJob.required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {currentJob.required_skills.slice(0, 4).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tailor Button */}
      <div className="text-center mb-8">
        <Button
          size="lg"
          onClick={analyzeAndTailor}
          disabled={!selectedCV || !selectedJob || isTailoring}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-500/30"
        >
          {isTailoring ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Tailoring Your CV...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Tailor CV with AI
            </>
          )}
        </Button>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Scores */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-slate-900">Job Match Score</span>
                  </div>
                  <span className="text-3xl font-bold text-indigo-600">{analysisResult.match_score}%</span>
                </div>
                <Progress value={analysisResult.match_score} className="h-3" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-slate-900">ATS Score</span>
                  </div>
                  <span className="text-3xl font-bold text-emerald-600">{analysisResult.ats_score}%</span>
                </div>
                <Progress value={analysisResult.ats_score} className="h-3 bg-emerald-100 [&>div]:bg-emerald-500" />
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Gaps */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.strengths?.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.gaps?.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{gap}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Keywords to Add */}
          {analysisResult.keywords_to_add && analysisResult.keywords_to_add.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  ATS Keywords Added
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords_to_add.map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="bg-violet-50 text-violet-700">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tailored CV Preview */}
          {tailoredCV && (
            <Card className="border-0 shadow-sm border-t-4 border-t-indigo-600">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Tailored CV Ready
                  </span>
                  <Badge className="bg-indigo-100 text-indigo-700">
                    Optimized for {currentJob?.company}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Summary Preview */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Optimized Summary</h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                      {tailoredCV.personal_info?.summary}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={saveTailoredCV}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save Tailored CV
                    </Button>
                    <Link to={createPageUrl('CVEditor') + `?id=${tailoredCV.id || ''}`}>
                      <Button variant="outline">
                        Edit Before Saving
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={analyzeAndTailor}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}