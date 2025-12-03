import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { api } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Target,
  Rocket,
  Flag,
  CheckCircle,
  Circle,
  Star,
  Trophy,
  Zap,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
  Flame,
  Heart,
  Lightbulb,
  MapPin,
  Milestone,
  PartyPopper
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const goalSuggestions = [
  "Land a job at a top tech company",
  "Transition into a new career field",
  "Get promoted to a leadership role",
  "Find a remote-friendly position",
  "Increase my salary by 20%",
  "Start working in my dream industry",
];

function RoadmapTimeline({ roadmap }) {
  const [expandedPhase, setExpandedPhase] = useState(0);
  
  return (
    <div className="space-y-6">
      {roadmap.phases?.map((phase, phaseIndex) => (
        <motion.div
          key={phaseIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: phaseIndex * 0.2 }}
        >
          <Card 
            className={`border-0 shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${
              expandedPhase === phaseIndex ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
            }`}
            onClick={() => setExpandedPhase(expandedPhase === phaseIndex ? -1 : phaseIndex)}
          >
            <div className={`h-1.5 bg-gradient-to-r ${
              phaseIndex === 0 ? 'from-emerald-400 to-teal-500' :
              phaseIndex === 1 ? 'from-blue-400 to-indigo-500' :
              phaseIndex === 2 ? 'from-violet-400 to-purple-500' :
              'from-amber-400 to-orange-500'
            }`} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    phaseIndex === 0 ? 'from-emerald-400 to-teal-500' :
                    phaseIndex === 1 ? 'from-blue-400 to-indigo-500' :
                    phaseIndex === 2 ? 'from-violet-400 to-purple-500' :
                    'from-amber-400 to-orange-500'
                  } flex items-center justify-center shadow-lg`}>
                    <span className="text-xl font-bold text-white">{phase.phase_number}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{phase.phase_name}</CardTitle>
                    <p className="text-sm text-slate-500">{phase.theme}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {phase.duration_weeks} weeks
                  </Badge>
                  <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedPhase === phaseIndex ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>
            </CardHeader>
            
            <AnimatePresence>
              {expandedPhase === phaseIndex && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4 text-indigo-500" />
                          Milestones to Complete
                        </h4>
                        <div className="space-y-3">
                          {phase.milestones?.map((milestone, mIndex) => (
                            <motion.div
                              key={mIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: mIndex * 0.1 }}
                              className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl"
                            >
                              <div className="mt-0.5">
                                <Circle className="w-5 h-5 text-slate-300" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-slate-900">{milestone.title}</h5>
                                <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    ~{milestone.estimated_hours}h
                                  </span>
                                  <Badge className={`${
                                    milestone.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                                    milestone.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                                    'bg-rose-100 text-rose-700'
                                  }`}>
                                    {milestone.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                          <h4 className="text-sm font-semibold text-violet-700 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Skills to Develop
                          </h4>
                          <ul className="space-y-1">
                            {phase.skills_to_develop?.map((skill, i) => (
                              <li key={i} className="text-sm text-violet-600 flex items-center gap-2">
                                <Star className="w-3 h-3" />
                                {skill}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                          <h4 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Watch Out For
                          </h4>
                          <ul className="space-y-1">
                            {phase.potential_challenges?.map((challenge, i) => (
                              <li key={i} className="text-sm text-amber-600 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3" />
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl text-white">
                        <p className="flex items-center gap-2">
                          <Heart className="w-5 h-5 flex-shrink-0" />
                          <span className="italic">{phase.motivation_tip}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default function SuccessRoadmap() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('input');
  const [goalDescription, setGoalDescription] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const { data: cvs = [] } = useQuery({
    queryKey: ['cvs'],
    queryFn: () => api.cvs.list(),
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.jobs.list(),
  });

  const generateRoadmap = async () => {
    if (!goalDescription.trim()) {
      toast.error('Please describe your career goal');
      return;
    }
    
    setIsGenerating(true);
    setStep('generating');
    
    try {
      const userData = {
        name: user?.full_name,
        cvs: cvs.slice(0, 2),
        jobs_interested: jobs.slice(0, 3),
      };
      
      const goals = {
        main_goal: goalDescription,
        preferred_timeline: timeline || 'flexible',
      };
      
      const result = await api.ai.successRoadmap(userData, goals);
      setRoadmap(result);
      setStep('roadmap');
    } catch (error) {
      toast.error(error.message || 'Failed to generate roadmap');
      setStep('input');
    } finally {
      setIsGenerating(false);
    }
  };

  if (step === 'generating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-2xl mb-6"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MapPin className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Creating Your Success Roadmap...</h2>
          <p className="text-slate-600">Mapping out your personalized journey to success</p>
        </motion.div>
      </div>
    );
  }

  if (step === 'roadmap' && roadmap) {
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
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Your Success Roadmap</h1>
              <p className="text-slate-600">A personalized journey to your dream career</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-xl overflow-hidden mb-8 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Flag className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{roadmap.vision_statement}</h2>
                    <div className="flex items-center gap-4 text-white/80">
                      <Badge className="bg-white/20 text-white border-0">
                        <Calendar className="w-3 h-3 mr-1" />
                        ~{roadmap.timeline_weeks} weeks
                      </Badge>
                      <Badge className="bg-white/20 text-white border-0">
                        <Milestone className="w-3 h-3 mr-1" />
                        {roadmap.phases?.length} phases
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Start Today - Quick Wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-3">
                  {roadmap.quick_wins?.map((win, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-4 bg-amber-50 rounded-xl border border-amber-100"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-400 text-white flex items-center justify-center font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-amber-800">{win}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <RoadmapTimeline roadmap={roadmap} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PartyPopper className="w-5 h-5 text-rose-500" />
                  Celebrate These Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {roadmap.celebration_milestones?.map((milestone, i) => (
                    <Badge key={i} className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border-0 px-4 py-2">
                      <Trophy className="w-3 h-3 mr-1" />
                      {milestone}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <CardContent className="p-8">
                <p className="text-xl italic opacity-90">"{roadmap.inspiring_closing}"</p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={() => setStep('input')} size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Create New Roadmap
            </Button>
            <Button onClick={() => navigate('/Dashboard')} size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600">
              <Rocket className="w-4 h-4 mr-2" />
              Start My Journey
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
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
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Success Roadmap</h1>
              <p className="text-slate-600">Create your personalized path to success</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mb-4">
                  <Rocket className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Where Do You Want to Go?</h2>
                <p className="text-slate-600 max-w-lg mx-auto">
                  Describe your dream career goal, and we'll create a personalized roadmap with clear milestones to get you there.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Describe your career goal
                  </label>
                  <Textarea
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                    placeholder="E.g., I want to become a product manager at a tech company, or I want to transition from marketing to UX design..."
                    className="min-h-[120px] text-base border-slate-200 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-3">
                    Or choose a common goal
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {goalSuggestions.map((suggestion, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => setGoalDescription(suggestion)}
                        className={`${
                          goalDescription === suggestion 
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                            : ''
                        }`}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred timeline (optional)
                  </label>
                  <Input
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="E.g., 3 months, 6 months, 1 year, or flexible"
                    className="border-slate-200 focus:border-indigo-400"
                  />
                </div>

                <Button
                  onClick={generateRoadmap}
                  disabled={!goalDescription.trim() || isGenerating}
                  className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 shadow-xl"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5 mr-2" />
                  )}
                  Create My Success Roadmap
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
