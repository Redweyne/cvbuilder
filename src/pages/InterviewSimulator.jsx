import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { api } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  Star,
  Trophy,
  Target,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Award,
  FileText,
  Briefcase,
  Clock,
  Brain,
  Lightbulb,
  ThumbsUp,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

function ScoreRing({ score, size = 120, strokeWidth = 8, color = "#6366f1" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-2xl font-bold text-slate-900"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
      </div>
    </div>
  );
}

function InterviewerAvatar({ isThinking }) {
  return (
    <motion.div 
      className="relative"
      animate={isThinking ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1.5, repeat: isThinking ? Infinity : 0 }}
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-xl">
        <Brain className="w-10 h-10 text-white" />
      </div>
      {isThinking && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <Loader2 className="w-3 h-3 text-white animate-spin" />
        </motion.div>
      )}
    </motion.div>
  );
}

function FeedbackCard({ feedback, isVisible }) {
  if (!feedback || !isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-6"
    >
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Feedback on Your Answer</h3>
              {feedback.score && (
                <Badge className={`mt-1 ${
                  feedback.score >= 8 ? 'bg-emerald-100 text-emerald-700' :
                  feedback.score >= 6 ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  Score: {feedback.score}/10
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-slate-700 mb-4">{feedback.feedback_on_answer}</p>
          
          {feedback.what_worked_well?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-emerald-600 mb-2 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" /> What Worked Well
              </h4>
              <ul className="space-y-1">
                {feedback.what_worked_well.map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.areas_to_improve?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-amber-600 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> Areas to Strengthen
              </h4>
              <ul className="space-y-1">
                {feedback.areas_to_improve.map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.confidence_boost && (
            <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
              <p className="text-sm text-violet-700 italic">"{feedback.confidence_boost}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InterviewSummaryView({ summary, onRestart, onExit }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className={`w-24 h-24 mx-auto rounded-3xl ${
            summary.overall_score >= 80 ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
            summary.overall_score >= 60 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
            'bg-gradient-to-br from-indigo-400 to-violet-500'
          } flex items-center justify-center shadow-2xl mb-6`}
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Interview Complete!</h2>
        <p className="text-lg text-slate-600">{summary.performance_summary}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Overall Score", value: summary.overall_score, color: "#6366f1" },
          { label: "Confidence", value: summary.confidence_rating * 10, color: "#8b5cf6" },
          { label: "Communication", value: summary.communication_rating * 10, color: "#06b6d4" },
          { label: "Relevance", value: summary.relevance_rating * 10, color: "#10b981" },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Card className="border-0 shadow-lg text-center p-4">
              <div className="flex justify-center mb-2">
                <ScoreRing score={metric.value} size={80} strokeWidth={6} color={metric.color} />
              </div>
              <p className="text-sm font-medium text-slate-600">{metric.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-amber-500" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {summary.key_strengths_demonstrated?.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-violet-500" />
              Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {summary.growth_opportunities?.map((opp, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <Target className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                  {opp}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-indigo-500" />
            Your Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {summary.personalized_action_plan?.map((action, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-700">{action}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl overflow-hidden mb-8 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white">
        <CardContent className="p-6">
          <p className="text-lg opacity-90 italic">"{summary.encouragement_message}"</p>
          <div className="mt-4 flex items-center gap-3">
            <Badge className={`${summary.ready_for_real_interview ? 'bg-emerald-400' : 'bg-amber-400'} text-slate-900`}>
              {summary.ready_for_real_interview ? "Ready for Real Interview!" : `${summary.days_of_practice_recommended} more days of practice recommended`}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onRestart} size="lg">
          <RotateCcw className="w-4 h-4 mr-2" />
          Practice Again
        </Button>
        <Button onClick={onExit} size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600">
          <Sparkles className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </motion.div>
  );
}

export default function InterviewSimulator() {
  const navigate = useNavigate();
  const [selectedCV, setSelectedCV] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [summary, setSummary] = useState(null);
  const textareaRef = useRef(null);

  const { data: cvs = [], isLoading: loadingCVs } = useQuery({
    queryKey: ['cvs'],
    queryFn: () => api.cvs.list(),
  });

  const { data: jobs = [], isLoading: loadingJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.jobs.list(),
  });

  const selectedCVData = cvs.find(c => c.id === selectedCV);
  const selectedJobData = jobs.find(j => j.id === selectedJob);

  const startInterview = async () => {
    if (!selectedCV || !selectedJob) {
      toast.error('Please select both a CV and a job');
      return;
    }
    
    setInterviewStarted(true);
    setIsThinking(true);
    
    try {
      const result = await api.ai.mockInterview(selectedCVData, selectedJobData, null, 0);
      setCurrentQuestion(result.next_question);
      setFeedback(result);
      setQuestionIndex(1);
    } catch (error) {
      toast.error(error.message || 'Failed to start interview');
      setInterviewStarted(false);
    } finally {
      setIsThinking(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }
    
    setIsThinking(true);
    setShowFeedback(false);
    
    const historyEntry = {
      question: currentQuestion,
      answer: userAnswer,
      questionIndex: questionIndex
    };
    
    try {
      const result = await api.ai.mockInterview(
        selectedCVData, 
        selectedJobData, 
        userAnswer, 
        questionIndex
      );
      
      setFeedback(result);
      setShowFeedback(true);
      setInterviewHistory(prev => [...prev, { ...historyEntry, feedback: result }]);
      
      if (questionIndex >= 5) {
        setTimeout(() => finishInterview([...interviewHistory, { ...historyEntry, feedback: result }]), 2000);
      } else {
        setCurrentQuestion(result.next_question);
        setQuestionIndex(prev => prev + 1);
        setUserAnswer('');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to get feedback');
    } finally {
      setIsThinking(false);
    }
  };

  const finishInterview = async (history) => {
    setIsThinking(true);
    try {
      const summaryResult = await api.ai.interviewSummary(selectedCVData, selectedJobData, history);
      setSummary(summaryResult);
      setInterviewComplete(true);
    } catch (error) {
      toast.error(error.message || 'Failed to generate summary');
    } finally {
      setIsThinking(false);
    }
  };

  const restartInterview = () => {
    setInterviewStarted(false);
    setInterviewComplete(false);
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setShowFeedback(false);
    setInterviewHistory([]);
    setSummary(null);
  };

  if (interviewComplete && summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4">
        <InterviewSummaryView 
          summary={summary} 
          onRestart={restartInterview}
          onExit={() => navigate('/Dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" size="icon" className="hover:bg-white/80">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Interview Simulator</h1>
              <p className="text-slate-600">Practice with AI and build your confidence</p>
            </div>
          </div>
        </motion.div>

        {!interviewStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-xl overflow-hidden mb-8">
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mb-4">
                    <Brain className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Prepare for Your Interview</h2>
                  <p className="text-slate-600 max-w-lg mx-auto">
                    Our AI will conduct a realistic mock interview based on the job you're applying for. 
                    You'll get instant feedback and coaching to improve.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Select Your CV
                    </label>
                    <Select value={selectedCV} onValueChange={setSelectedCV}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choose a CV..." />
                      </SelectTrigger>
                      <SelectContent>
                        {cvs.map(cv => (
                          <SelectItem key={cv.id} value={cv.id}>
                            {cv.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Select Target Job
                    </label>
                    <Select value={selectedJob} onValueChange={setSelectedJob}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choose a job..." />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title} at {job.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: MessageSquare, title: "5 Questions", desc: "Behavioral & technical" },
                    { icon: Lightbulb, title: "Instant Feedback", desc: "After each answer" },
                    { icon: Trophy, title: "Full Report", desc: "With action plan" }
                  ].map((item, i) => (
                    <div key={i} className="text-center p-4 bg-slate-50 rounded-xl">
                      <item.icon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={startInterview}
                    disabled={!selectedCV || !selectedJob}
                    className="h-14 px-10 text-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Badge variant="outline" className="px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Question {questionIndex} of 5
              </Badge>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i < questionIndex - 1 ? 'bg-emerald-500' :
                      i === questionIndex - 1 ? 'bg-indigo-500 scale-125' :
                      'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Card className="border-0 shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start gap-6 mb-8">
                  <InterviewerAvatar isThinking={isThinking} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">AI Interviewer</h3>
                      <Badge className="bg-indigo-100 text-indigo-700 border-0">
                        {feedback?.question_type || 'Question'}
                      </Badge>
                    </div>
                    
                    {isThinking && !currentQuestion ? (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Preparing your question...
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className="text-xl text-slate-800 leading-relaxed">{currentQuestion}</p>
                        {feedback?.tips_for_next && !showFeedback && (
                          <p className="mt-3 text-sm text-violet-600 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            {feedback.tips_for_next}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Textarea
                    ref={textareaRef}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here... Take your time and be specific."
                    className="min-h-[150px] text-lg border-slate-200 focus:border-indigo-400 resize-none"
                    disabled={isThinking}
                  />
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Tip: Use the STAR method (Situation, Task, Action, Result)
                    </p>
                    <Button
                      onClick={submitAnswer}
                      disabled={!userAnswer.trim() || isThinking}
                      className="bg-gradient-to-r from-indigo-600 to-violet-600"
                    >
                      {isThinking ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Submit Answer
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  <FeedbackCard feedback={feedback} isVisible={showFeedback} />
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
