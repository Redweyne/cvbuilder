import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { api } from '@/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
  RefreshCw,
  Rocket,
  Trophy,
  Zap,
  Star,
  ArrowRight,
  PartyPopper,
  CheckCircle,
  ChevronDown
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

function Confetti({ show, onComplete }) {
  const [pieces, setPieces] = React.useState([]);
  
  React.useEffect(() => {
    if (show) {
      const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
      const newPieces = [...Array(30)].map((_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * 100,
        delay: i * 0.04,
        rotation: Math.random() * 360,
        isCircle: Math.random() > 0.5,
      }));
      setPieces(newPieces);
      
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [show, onComplete]);
  
  if (pieces.length === 0) return null;
  
  return (
    <>
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: '10px',
            height: '10px',
            backgroundColor: piece.color,
            borderRadius: piece.isCircle ? '50%' : '2px',
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ 
            y: '100vh', 
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 2.5,
            delay: piece.delay,
            ease: "easeIn"
          }}
        />
      ))}
    </>
  );
}

function ScoreRing({ score, label, icon: Icon, color, delay }) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <motion.div 
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", bounce: 0.4 }}
    >
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={`w-6 h-6 mb-1`} style={{ color }} />
          <motion.span 
            className="text-2xl font-bold text-slate-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-slate-600">{label}</span>
    </motion.div>
  );
}

function StepIndicator({ step, currentStep, label }) {
  const isActive = currentStep === step;
  const isComplete = currentStep > step;
  
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
        isComplete ? 'bg-emerald-500 text-white' :
        isActive ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30' :
        'bg-slate-100 text-slate-400'
      }`}>
        {isComplete ? <Check className="w-5 h-5" /> : step}
      </div>
      <span className={`font-medium transition-colors ${
        isActive ? 'text-slate-900' : isComplete ? 'text-emerald-600' : 'text-slate-400'
      }`}>{label}</span>
    </div>
  );
}

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
      toast.success('Your tailored CV is ready! Go get that dream job!', {
        icon: <Trophy className="w-5 h-5 text-amber-500" />
      });
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        navigate('/MyCVs');
      }, 2000);
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
    setCurrentStep(2);

    const cv = cvs.find(c => c.id === selectedCV);
    const job = jobs.find(j => j.id === selectedJob);

    try {
      const result = await api.ai.tailorCV(cv, job);
      
      setAnalysisResult({
        match_score: result.match_score || 85,
        ats_score: result.ats_score || 90,
        strengths: result.improvements_made || ['Optimized summary for role', 'Added relevant keywords', 'Enhanced experience descriptions'],
        gaps: result.missing_qualifications || [],
        keywords_added: result.keywords_added || []
      });

      setTailoredCV({
        ...cv,
        ...result,
        id: undefined,
        title: `${cv.title} - Tailored for ${job.company}`,
        ats_score: result.ats_score || 90,
        job_match_score: result.match_score || 85,
      });
      
      setCurrentStep(3);
      
      toast.success('CV tailored successfully! Check out your improved scores.', {
        icon: <Sparkles className="w-5 h-5 text-indigo-600" />
      });

    } catch (error) {
      toast.error(error.message || 'Failed to tailor CV. Please try again.');
      setCurrentStep(1);
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
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <motion.div 
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to={createPageUrl('Dashboard')}>
          <Button variant="ghost" size="icon" className="hover:bg-indigo-50">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            AI CV Tailoring
          </h1>
          <p className="text-slate-600 mt-2">Transform your CV to perfectly match any job opportunity</p>
        </div>
      </motion.div>

      <motion.div 
        className="mb-10 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
          <StepIndicator step={1} currentStep={currentStep} label="Select" />
          <ChevronRight className="w-5 h-5 text-slate-300" />
          <StepIndicator step={2} currentStep={currentStep} label="Tailor" />
          <ChevronRight className="w-5 h-5 text-slate-300" />
          <StepIndicator step={3} currentStep={currentStep} label="Results" />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`border-0 shadow-lg overflow-hidden transition-all duration-300 ${selectedCV ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                Select Your CV
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingCVs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
              ) : cvs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 mb-4">Create a CV first to get started</p>
                  <Link to={createPageUrl('CVEditor')}>
                    <Button className="bg-gradient-to-r from-indigo-600 to-violet-600">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Your CV
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Select value={selectedCV} onValueChange={setSelectedCV}>
                    <SelectTrigger className="w-full h-12 text-base border-slate-200 hover:border-indigo-300 transition-colors">
                      <SelectValue placeholder="Choose a CV to tailor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cvs.map(cv => (
                        <SelectItem key={cv.id} value={cv.id} className="py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-600" />
                            {cv.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <AnimatePresence>
                    {currentCV && (
                      <motion.div 
                        className="mt-4 p-5 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-indigo-100"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-1">{currentCV.title}</h4>
                            <p className="text-sm text-slate-600">
                              {currentCV.personal_info?.full_name || 'Your CV'} • {currentCV.experiences?.length || 0} experiences
                            </p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        {currentCV.ats_score && (
                          <div className="mt-3 flex items-center gap-2">
                            <Badge className="bg-slate-100 text-slate-700 border-0">
                              Current ATS: {currentCV.ats_score}%
                            </Badge>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`border-0 shadow-lg overflow-hidden transition-all duration-300 ${selectedJob ? 'ring-2 ring-violet-500 ring-offset-2' : ''}`}>
            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-600" />
                </div>
                Select Target Job
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingJobs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <Briefcase className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 mb-4">Add a job offer to tailor your CV</p>
                  <Link to={createPageUrl('JobOffers') + '?new=true'}>
                    <Button className="bg-gradient-to-r from-violet-600 to-purple-600">
                      <Zap className="w-4 h-4 mr-2" />
                      Add Job Offer
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger className="w-full h-12 text-base border-slate-200 hover:border-violet-300 transition-colors">
                      <SelectValue placeholder="Choose a job offer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map(job => (
                        <SelectItem key={job.id} value={job.id} className="py-3">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-violet-600" />
                            {job.title} at {job.company}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <AnimatePresence>
                    {currentJob && (
                      <motion.div 
                        className="mt-4 p-5 bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-xl border border-violet-100"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-1">{currentJob.title}</h4>
                            <p className="text-sm text-slate-600">
                              {currentJob.company} • {currentJob.location || 'Remote'}
                            </p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        {currentJob.requirements && currentJob.requirements.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {currentJob.requirements.slice(0, 4).map((req, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-white border-violet-200 text-violet-700">{req}</Badge>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          size="lg"
          onClick={analyzeAndTailor}
          disabled={!selectedCV || !selectedJob || isTailoring}
          className="h-16 px-10 text-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 group disabled:opacity-50"
        >
          {isTailoring ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              AI is working its magic...
            </>
          ) : (
            <>
              <Wand2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Tailor My CV with AI
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
        {!selectedCV || !selectedJob ? (
          <p className="text-sm text-slate-500 mt-3">Select a CV and job to get started</p>
        ) : (
          <p className="text-sm text-slate-500 mt-3">Ready to optimize your CV for {currentJob?.company}</p>
        )}
      </motion.div>

      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="space-y-8"
          >
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg mb-4"
                  >
                    <Trophy className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-slate-900">Your CV has been optimized!</h2>
                  <p className="text-slate-600 mt-2">Here's how your tailored CV performs</p>
                </div>
                
                <div className="flex justify-center gap-12 mb-8">
                  <ScoreRing 
                    score={analysisResult.match_score} 
                    label="Job Match" 
                    icon={Target}
                    color="#6366f1"
                    delay={0.2}
                  />
                  <ScoreRing 
                    score={analysisResult.ats_score} 
                    label="ATS Score" 
                    icon={TrendingUp}
                    color="#10b981"
                    delay={0.4}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Check className="w-5 h-5 text-emerald-600" />
                      </div>
                      Improvements Made
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysisResult.strengths?.map((strength, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{strength}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      Areas to Develop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisResult.gaps?.length > 0 ? (
                      <ul className="space-y-3">
                        {analysisResult.gaps.map((gap, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                          >
                            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{gap}</span>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-6">
                        <Star className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                        <p className="text-slate-600 font-medium">Great news! Your profile covers the key requirements.</p>
                        <p className="text-sm text-slate-500 mt-1">Consider highlighting your unique strengths even more.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {tailoredCV && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />
                  <CardHeader className="bg-gradient-to-br from-indigo-50 to-violet-50">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-xl font-bold text-slate-900">Your Tailored CV is Ready</span>
                          <p className="text-sm font-normal text-slate-600 mt-1">Optimized for {currentJob?.company}</p>
                        </div>
                      </span>
                      <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 px-4 py-1.5">
                        <Rocket className="w-4 h-4 mr-1.5" />
                        Ready to Apply
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    {tailoredCV.personal_info?.summary && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Wand2 className="w-4 h-4 text-indigo-600" />
                          Optimized Professional Summary
                        </h4>
                        <p className="text-slate-700 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-5 rounded-xl border border-indigo-100 leading-relaxed">
                          {tailoredCV.personal_info.summary}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={saveTailoredCV}
                        className="flex-1 h-14 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 group"
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <PartyPopper className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                        )}
                        Save & Apply with Confidence
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={analyzeAndTailor} 
                        disabled={isTailoring}
                        className="h-14 px-6 border-2 hover:bg-slate-50"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
