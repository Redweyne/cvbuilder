import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
  BarChart3,
  Compass,
  MessageSquare,
  Brain,
  MapPin,
  Crown,
  Gem,
  Shield,
  Play,
  Sun,
  Moon,
  Sunrise,
  Edit
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

const powerQuotes = [
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", icon: Rocket },
  { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", icon: Star },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins", icon: Compass },
  { quote: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer", icon: Heart },
  { quote: "Your career is your business. It's time for you to manage it as a CEO.", author: "Dorit Sher", icon: Crown },
  { quote: "Every master was once a disaster.", author: "T. Harv Eker", icon: Trophy },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", icon: Flame },
  { quote: "Don't wait for opportunity. Create it.", author: "George Bernard Shaw", icon: Sparkles },
];

const achievements = [
  { id: 'first_cv', title: 'Pioneer', description: 'Created your first CV', icon: FileText, color: 'from-blue-500 to-cyan-500', xp: 100 },
  { id: 'ai_enhanced', title: 'AI Alchemist', description: 'Used AI to enhance your CV', icon: Sparkles, color: 'from-violet-500 to-purple-500', xp: 150 },
  { id: 'job_match', title: 'Perfect Match', description: 'Achieved 80%+ job match score', icon: Target, color: 'from-emerald-500 to-teal-500', xp: 200 },
  { id: 'five_applications', title: 'Go Getter', description: 'Tracked 5 job applications', icon: Rocket, color: 'from-orange-500 to-red-500', xp: 250 },
  { id: 'ats_champion', title: 'ATS Champion', description: 'Scored 90+ on ATS optimization', icon: Trophy, color: 'from-amber-500 to-yellow-500', xp: 300 },
  { id: 'story_discovered', title: 'Self-Aware', description: 'Completed Career Discovery', icon: Compass, color: 'from-rose-500 to-pink-500', xp: 250 },
  { id: 'interview_ready', title: 'Interview Ready', description: 'Completed 3 mock interviews', icon: MessageSquare, color: 'from-indigo-500 to-blue-500', xp: 300 },
  { id: 'roadmap_created', title: 'Visionary', description: 'Created your Success Roadmap', icon: MapPin, color: 'from-teal-500 to-cyan-500', xp: 200 },
];

const aiTools = [
  {
    id: 'discovery',
    title: 'Soul Discovery',
    subtitle: 'Find Your Story',
    description: 'Uncover the unique narrative that makes you extraordinary',
    icon: Compass,
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    hoverBorder: 'hover:border-amber-400',
    link: '/CareerDiscovery',
    badge: 'Transformative',
    badgeColor: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'simulator',
    title: 'Interview Theater',
    subtitle: 'Practice Under Pressure',
    description: 'Master any interview with AI-powered simulations',
    icon: MessageSquare,
    gradient: 'from-blue-400 via-indigo-500 to-violet-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    link: '/InterviewSimulator',
    badge: 'High Impact',
    badgeColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'mentor',
    title: 'AI Mentor',
    subtitle: 'Your Career Guide',
    description: '24/7 personalized career coaching and advice',
    icon: Brain,
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    bgGradient: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    hoverBorder: 'hover:border-violet-400',
    link: '/CareerMentor',
    badge: 'Popular',
    badgeColor: 'bg-violet-100 text-violet-700'
  },
  {
    id: 'roadmap',
    title: 'Destiny Map',
    subtitle: 'Your Success Path',
    description: 'A personalized roadmap to your dream career',
    icon: MapPin,
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-500',
    bgGradient: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    hoverBorder: 'hover:border-rose-400',
    link: '/SuccessRoadmap',
    badge: 'Strategic',
    badgeColor: 'bg-rose-100 text-rose-700'
  }
];

function CelebrationEffect({ show }) {
  const [particles, setParticles] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    if (show) {
      setAnimationKey(prev => prev + 1);
      const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
      const newParticles = [...Array(50)].map((_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        rotation: Math.random() * 720,
        size: 8 + Math.random() * 8,
        isCircle: Math.random() > 0.5,
      }));
      setParticles(newParticles);
    }
  }, [show]);
  
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => setParticles([]), 3500);
      return () => clearTimeout(timer);
    }
  }, [animationKey]);
  
  if (particles.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: particle.isCircle ? '50%' : '2px',
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ 
            y: '110vh', 
            rotate: particle.rotation,
            opacity: [1, 1, 0.8, 0]
          }}
          transition={{ 
            duration: 3,
            delay: particle.delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}
    </div>
  );
}

function MomentumOrbit({ percentage, level }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-slate-200"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#momentumGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="momentumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gradient">{Math.round(percentage)}%</span>
        <span className="text-xs text-slate-500">{level.label}</span>
      </div>
    </div>
  );
}

function CommandCenter({ cvs, jobs, subscription }) {
  const cvActions = Math.min(cvs.length, 5) * 10;
  const jobActions = Math.min(jobs.length, 10) * 5;
  const aiEnhanced = cvs.filter(cv => cv.ai_enhanced).length * 5;
  const highMatchBonus = cvs.filter(cv => (cv.job_match_score || 0) >= 80).length * 5;
  const momentumPercentage = Math.min(cvActions + jobActions + aiEnhanced + highMatchBonus, 100);
  
  const getMomentumLevel = () => {
    if (momentumPercentage >= 90) return { label: 'Legendary', color: 'from-amber-500 to-yellow-400', icon: Crown, tier: 5 };
    if (momentumPercentage >= 70) return { label: 'On Fire', color: 'from-orange-500 to-red-500', icon: Flame, tier: 4 };
    if (momentumPercentage >= 50) return { label: 'Rising Star', color: 'from-emerald-500 to-teal-500', icon: TrendingUp, tier: 3 };
    if (momentumPercentage >= 30) return { label: 'Accelerating', color: 'from-blue-500 to-indigo-500', icon: Rocket, tier: 2 };
    if (momentumPercentage >= 10) return { label: 'Building', color: 'from-violet-500 to-purple-500', icon: Sparkles, tier: 1 };
    return { label: 'Starting', color: 'from-slate-400 to-slate-500', icon: Star, tier: 0 };
  };
  
  const level = getMomentumLevel();
  const aiCreditsLeft = (subscription?.ai_credits_limit || 5) - (subscription?.ai_credits_used || 0);
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/15 to-transparent rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <MomentumOrbit percentage={momentumPercentage} level={level} />
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg animate-pulse-glow`}>
                  {React.createElement(level.icon, { className: "w-5 h-5 text-white" })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Career Momentum</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                      {level.label}
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="text-sm text-slate-400">Tier {level.tier}/5</span>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm max-w-md mt-2">
                {level.tier < 3 
                  ? "Keep building momentum! Every action brings you closer to your dream career."
                  : "You're making incredible progress! Your dedication is paying off."}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-blue-500/20 mb-2">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold">{cvs.length}</div>
              <div className="text-xs text-slate-400">CVs Created</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 mb-2">
                <Briefcase className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold">{jobs.length}</div>
              <div className="text-xs text-slate-400">Jobs Tracked</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-amber-500/20 mb-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-2xl font-bold">{aiCreditsLeft}</div>
              <div className="text-xs text-slate-400">AI Credits</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-slate-400">
                <Target className="w-4 h-4 text-violet-400" />
                Avg Match: <span className="text-white font-medium">
                  {cvs.length > 0 ? Math.round(cvs.reduce((acc, cv) => acc + (cv.job_match_score || 75), 0) / cvs.length) : 0}%
                </span>
              </span>
              <span className="flex items-center gap-2 text-slate-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                Avg ATS: <span className="text-white font-medium">
                  {cvs.length > 0 ? Math.round(cvs.reduce((acc, cv) => acc + (cv.ats_score || 80), 0) / cvs.length) : 0}%
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((tier) => (
                <div
                  key={tier}
                  className={`w-3 h-3 rounded-full ${tier <= level.tier ? 'bg-gradient-to-r from-indigo-400 to-violet-400' : 'bg-slate-700'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InspirationCard() {
  const [quote, setQuote] = useState(powerQuotes[0]);
  const [isChanging, setIsChanging] = useState(false);
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * powerQuotes.length);
    setQuote(powerQuotes[randomIndex]);
  }, []);
  
  const changeQuote = () => {
    setIsChanging(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * powerQuotes.length);
      setQuote(powerQuotes[randomIndex]);
      setIsChanging(false);
    }, 200);
  };
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 p-6 border border-indigo-100 cursor-pointer group"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      onClick={changeQuote}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      <motion.div
        className="relative z-10"
        animate={{ opacity: isChanging ? 0 : 1, y: isChanging ? 10 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg flex-shrink-0">
            {React.createElement(quote.icon, { className: "w-6 h-6 text-white" })}
          </div>
          <div className="flex-1">
            <Quote className="w-6 h-6 text-indigo-200 mb-2" />
            <p className="text-lg text-slate-800 leading-relaxed italic mb-3">"{quote.quote}"</p>
            <p className="text-sm font-medium text-indigo-600">— {quote.author}</p>
          </div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-4 right-4 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Click for inspiration
      </div>
    </motion.div>
  );
}

function AchievementShowcase({ unlockedAchievements, totalXP }) {
  const unlockedCount = unlockedAchievements.size;
  
  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Achievements</CardTitle>
              <p className="text-sm text-slate-500">{unlockedCount}/{achievements.length} unlocked</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient">{totalXP}</div>
            <div className="text-xs text-slate-500">Total XP</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-4 gap-3">
          {achievements.slice(0, 8).map((achievement, index) => {
            const isUnlocked = unlockedAchievements.has(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                className={`relative group ${isUnlocked ? 'cursor-pointer' : 'opacity-40'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={isUnlocked ? { scale: 1.1 } : {}}
              >
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${isUnlocked ? achievement.color : 'from-slate-300 to-slate-400'} flex items-center justify-center shadow-md ${isUnlocked ? 'animate-pulse-glow' : ''}`}>
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                {isUnlocked && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <CheckCircle className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {achievement.title}
                  {isUnlocked && <span className="ml-1 text-amber-400">+{achievement.xp} XP</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function AIToolCard({ tool, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <Link to={tool.link}>
      <motion.div
        ref={ref}
        className={`relative h-full bg-gradient-to-br ${tool.bgGradient} rounded-2xl p-6 border ${tool.borderColor} ${tool.hoverBorder} hover:shadow-2xl transition-all duration-500 group overflow-hidden`}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
              <tool.icon className="w-7 h-7 text-white" />
            </div>
            <Badge className={`${tool.badgeColor} border-0 text-xs font-medium`}>
              {tool.badge}
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-1">{tool.title}</h3>
          <p className="text-sm font-medium text-slate-500 mb-2">{tool.subtitle}</p>
          <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
          
          <div className="flex items-center text-sm font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-violet-600 transition-all">
            Launch Experience
            <ChevronRight className="w-4 h-4 ml-1 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function QuickActionCard({ icon: Icon, title, subtitle, gradient, bgGradient, link, isPrimary }) {
  return (
    <Link to={link}>
      <motion.div
        className={`h-full rounded-2xl p-6 cursor-pointer transition-all duration-500 relative overflow-hidden ${
          isPrimary 
            ? `bg-gradient-to-br ${gradient} text-white shadow-xl hover:shadow-2xl` 
            : `bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl`
        }`}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isPrimary && (
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        )}
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-xl ${isPrimary ? 'bg-white/20 backdrop-blur-sm' : `bg-gradient-to-br ${bgGradient}`} flex items-center justify-center mb-4 shadow-lg`}>
            <Icon className={`w-7 h-7 ${isPrimary ? 'text-white' : 'text-slate-700'}`} />
          </div>
          <h3 className={`font-bold text-lg ${isPrimary ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
          <p className={`text-sm mt-1 ${isPrimary ? 'text-white/80' : 'text-slate-500'}`}>{subtitle}</p>
          <div className={`mt-4 flex items-center text-sm font-medium ${isPrimary ? 'text-white' : 'text-indigo-600'}`}>
            Get Started <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function CVCard({ cv, onExport }) {
  return (
    <motion.div
      className="group relative bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {cv.title || 'Untitled CV'}
            </h4>
            <p className="text-sm text-slate-500">
              Updated {new Date(cv.updated_at || cv.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/CVEditor?id=${cv.id}`} className="flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/CVEditor?id=${cv.id}&preview=true`} className="flex items-center gap-2">
                <Eye className="w-4 h-4" /> Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport(cv)} className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center gap-3 mt-4">
        {cv.ats_score && (
          <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
            ATS: {cv.ats_score}%
          </Badge>
        )}
        {cv.job_match_score && (
          <Badge variant="secondary" className="text-xs bg-violet-50 text-violet-700 border-violet-200">
            Match: {cv.job_match_score}%
          </Badge>
        )}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [showCelebration, setShowCelebration] = useState(false);

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
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3500);
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
  const totalXP = [...unlockedAchievements].reduce((total, id) => {
    const achievement = achievements.find(a => a.id === id);
    return total + (achievement?.xp || 0);
  }, 0);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sunrise };
    if (hour < 18) return { text: 'Good afternoon', icon: Sun };
    return { text: 'Good evening', icon: Moon };
  };

  const greeting = getGreeting();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <CelebrationEffect show={showCelebration} />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              {React.createElement(greeting.icon, { className: "w-5 h-5 text-white" })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              {greeting.text}, <span className="text-gradient">{user?.full_name?.split(' ')[0] || 'Champion'}</span>
            </h1>
          </div>
          <p className="text-slate-600 flex items-center gap-2 ml-13">
            <Sparkles className="w-4 h-4 text-violet-500" />
            Your career transformation journey continues today
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 border-0 px-4 py-2 shadow-md">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </Badge>
      </motion.div>

      <CommandCenter cvs={cvs} jobs={jobs} subscription={subscription} />

      <div className="grid lg:grid-cols-4 gap-4">
        <QuickActionCard
          icon={Plus}
          title="Create New CV"
          subtitle="Start your next chapter"
          gradient="from-indigo-600 via-violet-600 to-purple-600"
          link={createPageUrl('CVEditor')}
          isPrimary={true}
        />
        <QuickActionCard
          icon={Upload}
          title="Upload CV"
          subtitle="Import and enhance"
          bgGradient="from-blue-50 to-indigo-50"
          link={createPageUrl('CVEditor') + '?upload=true'}
        />
        <QuickActionCard
          icon={Briefcase}
          title="Track Job"
          subtitle="Stay organized"
          bgGradient="from-emerald-50 to-teal-50"
          link={createPageUrl('JobOffers') + '?new=true'}
        />
        <QuickActionCard
          icon={Zap}
          title="AI Tailor"
          subtitle="Perfect your match"
          bgGradient="from-violet-50 to-purple-50"
          link={createPageUrl('TailorCV')}
        />
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">AI Career Transformation</h2>
            <p className="text-sm text-slate-500">Revolutionary tools to unlock your potential</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {aiTools.map((tool, index) => (
            <AIToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <InspirationCard />
        <AchievementShowcase unlockedAchievements={unlockedAchievements} totalXP={totalXP} />
      </div>

      {cvs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Your CVs</h2>
                <p className="text-sm text-slate-500">{cvs.length} document{cvs.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <Link to={createPageUrl('MyCVs')}>
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvs.slice(0, 3).map((cv, index) => (
              <CVCard key={cv.id} cv={cv} onExport={handleExportPdf} />
            ))}
          </div>
        </div>
      )}

      {cvs.length === 0 && !cvsLoading && (
        <motion.div
          className="text-center py-16 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-2xl mb-6">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Transform Your Career?</h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Create your first CV and unlock the power of AI-driven career transformation
          </p>
          <Link to={createPageUrl('CVEditor')}>
            <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-500/30">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First CV
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
