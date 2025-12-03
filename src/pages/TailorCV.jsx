import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { api } from '@/api/client';
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
import { toast } from 'sonner';

export default function TailorCV() {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('job');
  const cvIdParam = urlParams.get('cv');
  const navigate = useNavigate();

  const [selectedCV, setSelectedCV] = useState(cvIdParam || '');
  const [selectedJob, setSelectedJob] = useState(jobId || '');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoredCV, setTailoredCV] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const queryClient = useQueryClient();

  const { data: cvs = [], isLoading: loadingCVs } = useQuery({
    queryKey: ['cvs'],
    queryFn: () => api.cvs.list(),
  });

  const { data: jobs = [], isLoading: loadingJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.jobs.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.cvs.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
      toast.success('Tailored CV saved successfully!');
      navigate('/MyCVs');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save tailored CV');
    }
  });

  const analyzeAndTailor = async () => {
    if (!selectedCV || !selectedJob) {
      toast.error('Please select both a CV and a job');
      return;
    }
    
    setIsTailoring(true);
    setAnalysisResult(null);
    setTailoredCV(null);

    const cv = cvs.find(c => c.id === selectedCV);
    const job = jobs.find(j => j.id === selectedJob);

    try {
      const result = await api.ai.tailorCV(cv, job);
      
      setAnalysisResult({
        match_score: result.match_score || 75,
        ats_score: result.ats_score || 80,
        strengths: result.improvements_made || [],
        gaps: result.missing_qualifications || [],
        keywords_to_add: result.keywords_to_add || []
      });

      setTailoredCV({
        ...cv,
        ...result,
        id: undefined,
        title: `${cv.title} - Tailored for ${job.company}`,
        ats_score: result.ats_score || 80,
        job_match_score: result.match_score || 75,
      });

    } catch (error) {
      toast.error(error.message || 'Failed to tailor CV. Please try again.');
    } finally {
      setIsTailoring(false);
    }
  };

  const saveTailoredCV = async () => {
    if (!tailoredCV) return;
    const { id, created_at, updated_at, user_id, ...cvData } = tailoredCV;
    await createMutation.mutateAsync(cvData);
  };

  const currentCV = cvs.find(c => c.id === selectedCV);
  const currentJob = jobs.find(j => j.id === selectedJob);

  return (
    <div className="max-w-6xl mx-auto">
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

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-indigo-600" />
              Select Your CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCVs ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : cvs.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-slate-500 mb-3">No CVs found</p>
                <Link to={createPageUrl('CVEditor')}>
                  <Button size="sm">Create a CV first</Button>
                </Link>
              </div>
            ) : (
              <>
                <Select value={selectedCV} onValueChange={setSelectedCV}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a CV to tailor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cvs.map(cv => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {currentCV && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">{currentCV.title}</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      {currentCV.personal_info?.full_name || 'No name'} - 
                      {currentCV.experiences?.length || 0} experiences
                    </p>
                    {currentCV.ats_score && (
                      <Badge variant="secondary">Current ATS: {currentCV.ats_score}%</Badge>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Select Target Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingJobs ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-slate-500 mb-3">No jobs found</p>
                <Link to={createPageUrl('JobOffers') + '?new=true'}>
                  <Button size="sm">Add a job first</Button>
                </Link>
              </div>
            ) : (
              <>
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
                      {currentJob.company} - {currentJob.location || 'Remote'}
                    </p>
                    {currentJob.requirements && currentJob.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {currentJob.requirements.slice(0, 4).map((req, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{req}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

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

      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
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

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  Improvements Made
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.strengths?.length > 0 ? (
                    analysisResult.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{strength}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500">CV content has been optimized for the job</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Missing Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.gaps?.length > 0 ? (
                    analysisResult.gaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{gap}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500">Your profile covers most requirements!</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

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
                  {tailoredCV.personal_info?.summary && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Optimized Summary</h4>
                      <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                        {tailoredCV.personal_info.summary}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={saveTailoredCV}
                      className="bg-indigo-600 hover:bg-indigo-700"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Save Tailored CV
                    </Button>
                    <Button variant="ghost" onClick={analyzeAndTailor} disabled={isTailoring}>
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
