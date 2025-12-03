import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Briefcase, 
  Plus, 
  TrendingUp, 
  Target, 
  ArrowRight,
  Sparkles,
  Upload,
  Eye,
  Download,
  MoreHorizontal,
  Zap,
  Flame,
  Trophy,
  Star,
  Rocket,
  Heart,
  Calendar,
  Clock,
  ChevronRight,
  Award,
  CheckCircle,
  PartyPopper,
  Lightbulb,
  Quote,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const motivationalQuotes = [
  { quote: "Every expert was once a beginner. Keep going.", author: "Helen Hayes" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
];

const achievements = [
  { id: 'first_cv', title: 'First Steps', description: 'Created your first CV', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { id: 'ai_enhanced', title: 'AI Powered', description: 'Used AI to enhance your CV', icon: Sparkles, color: 'from-violet-500 to-purple-500' },
  { id: 'job_match', title: 'Perfect Match', description: 'Achieved 80%+ job match', icon: Target, color: 'from-emerald-500 to-teal-500' },
  { id: 'five_applications', title: 'Go Getter', description: 'Tracked 5 job applications', icon: Rocket, color: 'from-orange-500 to-red-500' },
  { id: 'ats_champion', title: 'ATS Champion', description: 'Scored 90+ on ATS', icon: Trophy, color: 'from-amber-500 to-yellow-500' },
];

function Confetti({ show, onComplete }) {
  const [pieces, setPieces] = useState([]);
  
  useEffect(() => {
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

function MomentumBar({ cvs, jobs, subscription }) {
  const totalActions = cvs.length + jobs.length;
  const maxMomentum = 10;
  const momentumPercentage = Math.min((totalActions / maxMomentum) * 100, 100);
  
  const getMomentumLevel = () => {
    if (momentumPercentage >= 80) return { label: 'On Fire!', color: 'from-orange-500 to-red-500', icon: Flame };
    if (momentumPercentage >= 60) return { label: 'Great Progress', color: 'from-emerald-500 to-teal-500', icon: TrendingUp };
    if (momentumPercentage >= 40) return { label: 'Building Momentum', color: 'from-blue-500 to-indigo-500', icon: Rocket };
    if (momentumPercentage >= 20) return { label: 'Getting Started', color: 'from-violet-500 to-purple-500', icon: Sparkles };
    return { label: 'Ready to Begin', color: 'from-slate-400 to-slate-500', icon: Star };
  };
  
  const level = getMomentumLevel();
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg`}>
              {React.createElement(level.icon, { className: "w-6 h-6 text-white" })}
            </div>
            <div>
              <h3 className="font-bold text-lg">Career Momentum</h3>
              <p className="text-slate-400 text-sm">{level.label}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round(momentumPercentage)}%</div>
            <div className="text-xs text-slate-400">of your goal</div>
          </div>
        </div>
        
        <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div 
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${level.color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${momentumPercentage}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
        
        <div className="flex justify-between mt-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>{cvs.length} CVs created</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>{jobs.length} jobs tracked</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{(subscription?.ai_credits_limit || 5) - (subscription?.ai_credits_used || 0)} AI credits</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DailyMotivation() {
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 p-6 border border-violet-100"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Quote className="absolute top-4 left-4 w-8 h-8 text-violet-200" />
      <div className="relative z-10 pl-8">
        <p className="text-lg text-slate-700 italic leading-relaxed">"{quote.quote}"</p>
        <p className="text-sm text-violet-600 font-medium mt-3">— {quote.author}</p>
      </div>
      <Lightbulb className="absolute bottom-4 right-4 w-6 h-6 text-amber-400" />
    </motion.div>
  );
}

function AchievementCard({ achievement, unlocked, index }) {
  return (
    <motion.div 
      className={`relative p-4 rounded-xl border ${unlocked ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100'} transition-all duration-300 ${unlocked ? 'hover:shadow-lg hover:-translate-y-1' : 'opacity-50'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${unlocked ? achievement.color : 'from-slate-300 to-slate-400'} flex items-center justify-center shadow-md`}>
          <achievement.icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 text-sm">{achievement.title}</h4>
          <p className="text-xs text-slate-500">{achievement.description}</p>
        </div>
        {unlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-emerald-500"
          >
            <CheckCircle className="w-5 h-5" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);

  const { data: cvs = [], isLoading: cvsLoading } = useQuery({
    queryKey: ['cvs'],
    queryFn: () => api.cvs.list(),
    enabled: !!user,
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.jobs.list(),
    enabled: !!user,
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.subscription.get(),
    enabled: !!user,
  });

  const handleExportPdf = async (cv) => {
    try {
      const blob = await api.export.cvPdf(cv, cv.template_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cv.title || 'cv'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported successfully!', {
        icon: <PartyPopper className="w-5 h-5 text-amber-500" />,
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      toast.error(error.message || 'Failed to export PDF');
    }
  };

  const getUnlockedAchievements = () => {
    const unlocked = new Set();
    if (cvs.length >= 1) unlocked.add('first_cv');
    if (cvs.some(cv => cv.ai_enhanced)) unlocked.add('ai_enhanced');
    if (cvs.some(cv => cv.job_match_score >= 80)) unlocked.add('job_match');
    if (jobs.length >= 5) unlocked.add('five_applications');
    if (cvs.some(cv => cv.ats_score >= 90)) unlocked.add('ats_champion');
    return unlocked;
  };

  const unlockedAchievements = getUnlockedAchievements();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { 
      label: 'CVs Created', 
      value: cvs.length, 
      icon: FileText, 
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    { 
      label: 'Jobs Tracked', 
      value: jobs.length, 
      icon: Briefcase, 
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    { 
      label: 'Avg Match Score', 
      value: cvs.length > 0 ? Math.round(cvs.reduce((acc, cv) => acc + (cv.job_match_score || 75), 0) / cvs.length) + '%' : '—', 
      icon: Target, 
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50'
    },
    { 
      label: 'AI Credits Left', 
      value: (subscription?.ai_credits_limit || 5) - (subscription?.ai_credits_used || 0), 
      icon: Sparkles, 
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            {getGreeting()}, <span className="text-gradient">{user?.full_name?.split(' ')[0] || 'there'}</span>!
          </h1>
          <p className="text-slate-600 mt-2 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Let's make today count towards your dream career
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 border-0 px-4 py-2">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Badge>
        </div>
      </motion.div>

      <MomentumBar cvs={cvs} jobs={jobs} subscription={subscription} />

      <div className="grid lg:grid-cols-4 gap-4">
        <Link to={createPageUrl('CVEditor')} className="lg:col-span-1">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-6 text-white cursor-pointer shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                <Plus className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl">Create New CV</h3>
              <p className="text-indigo-100 text-sm mt-2">Start your next chapter</p>
              <div className="mt-4 flex items-center text-sm font-medium">
                Get Started <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </motion.div>
        </Link>

        <Link to={createPageUrl('CVEditor') + '?upload=true'} className="lg:col-span-1">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-white rounded-2xl p-6 border border-slate-200 cursor-pointer hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Upload CV</h3>
            <p className="text-slate-500 text-sm mt-2">Import and enhance</p>
          </motion.div>
        </Link>

        <Link to={createPageUrl('JobOffers') + '?new=true'} className="lg:col-span-1">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-white rounded-2xl p-6 border border-slate-200 cursor-pointer hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center mb-4">
              <Briefcase className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Track Job</h3>
            <p className="text-slate-500 text-sm mt-2">Stay organized</p>
          </motion.div>
        </Link>

        <Link to={createPageUrl('TailorCV')} className="lg:col-span-1">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-white rounded-2xl p-6 border border-slate-200 cursor-pointer hover:border-violet-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-violet-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">AI Tailor</h3>
            <p className="text-slate-500 text-sm mt-2">Perfect your match</p>
          </motion.div>
        </Link>
      </div>

      <DailyMotivation />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${stat.bgGradient} overflow-hidden relative group`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Your CVs
              </CardTitle>
              <Link to={createPageUrl('MyCVs')}>
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {cvsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-16 h-20 bg-slate-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : cvs.length === 0 ? (
                <div className="text-center py-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mx-auto mb-6"
                  >
                    <Rocket className="w-10 h-10 text-indigo-600" />
                  </motion.div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Ready to Launch Your Career?</h3>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto">Create your first CV and let our AI help you stand out from the crowd</p>
                  <Link to={createPageUrl('CVEditor')}>
                    <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Your First CV
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {cvs.slice(0, 4).map((cv, index) => (
                    <motion.div
                      key={cv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-300 group border border-transparent hover:border-slate-200"
                    >
                      <div className="w-14 h-18 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate">{cv.title || 'Untitled CV'}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <Badge variant="secondary" className="text-xs bg-slate-100">
                            {cv.template_id || 'Professional'}
                          </Badge>
                          {cv.ats_score && (
                            <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                              <TrendingUp className="w-3 h-3" />
                              ATS: {cv.ats_score}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={createPageUrl('CVEditor') + `?id=${cv.id}`}>
                          <Button size="sm" variant="ghost" className="hover:bg-indigo-50 hover:text-indigo-600">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="hover:bg-slate-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleExportPdf(cv)} className="cursor-pointer">
                              <Download className="w-4 h-4 mr-2 text-indigo-600" />
                              Export PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={createPageUrl('TailorCV') + `?cv=${cv.id}`} className="flex items-center">
                                <Target className="w-4 h-4 mr-2 text-violet-600" />
                                Tailor for Job
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.slice(0, 4).map((achievement, index) => (
                <AchievementCard 
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlockedAchievements.has(achievement.id)}
                  index={index}
                />
              ))}
              <div className="text-center pt-2">
                <p className="text-sm text-slate-500">
                  {unlockedAchievements.size} of {achievements.length} unlocked
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-violet-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Your Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Current Plan</span>
                <Badge className={`${subscription?.plan === 'pro' ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white' : 'bg-slate-100 text-slate-700'} border-0`}>
                  {subscription?.plan?.toUpperCase() || 'FREE'}
                </Badge>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Credits
                  </span>
                  <span className="font-semibold text-slate-900">
                    {subscription?.ai_credits_used || 0}/{subscription?.ai_credits_limit || 5}
                  </span>
                </div>
                <div className="relative h-2 bg-white rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((subscription?.ai_credits_used || 0) / (subscription?.ai_credits_limit || 5)) * 100}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Download className="w-4 h-4 text-indigo-500" />
                    PDF Exports
                  </span>
                  <span className="font-semibold text-slate-900">
                    {subscription?.exports_used || 0}/{subscription?.exports_limit || 3}
                  </span>
                </div>
                <div className="relative h-2 bg-white rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((subscription?.exports_used || 0) / (subscription?.exports_limit || 3)) * 100}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
              {subscription?.plan === 'free' && (
                <Link to={createPageUrl('Billing')}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 mt-2">
                    <Rocket className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
