import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  FileText, 
  Target, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Upload,
  Wand2,
  Download,
  LayoutTemplate,
  Shield,
  TrendingUp,
  Rocket,
  Heart,
  Award,
  Users,
  Briefcase,
  ChevronRight,
  Play,
  Quote,
  Globe,
  Clock,
  BarChart3,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const inspirationalPhrases = [
  "Your story deserves to be heard",
  "Every expert was once a beginner", 
  "Your next chapter starts now",
  "Dream jobs aren't just dreams",
  "You're closer than you think"
];

const successStats = [
  { number: "50K+", label: "Dreams Realized", icon: Rocket },
  { number: "89%", label: "Interview Success", icon: TrendingUp },
  { number: "3x", label: "More Callbacks", icon: Flame },
  { number: "4.9", label: "User Rating", icon: Star },
];

const features = [
  {
    icon: Upload,
    title: "Start Your Journey",
    description: "Upload your existing CV or start fresh. Our AI will understand your unique story and potential.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Target,
    title: "Perfect Match",
    description: "Paste any job and watch AI tailor your CV to speak directly to that opportunity.",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    icon: Wand2,
    title: "AI Magic",
    description: "Transform ordinary descriptions into compelling achievements that demand attention.",
    gradient: "from-orange-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "ATS Champion",
    description: "Beat the bots. Every CV is engineered to pass Applicant Tracking Systems with flying colors.",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: LayoutTemplate,
    title: "Stand Out",
    description: "Choose from stunning templates that balance creativity with professionalism.",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    icon: Download,
    title: "Ready to Impress",
    description: "Export polished PDFs instantly. Share your story with confidence.",
    gradient: "from-rose-500 to-red-500"
  }
];

const steps = [
  { 
    step: "01", 
    title: "Tell Your Story", 
    description: "Share your experiences, skills, and dreams",
    icon: Heart
  },
  { 
    step: "02", 
    title: "Find Your Match", 
    description: "Discover opportunities that align with your goals",
    icon: Target
  },
  { 
    step: "03", 
    title: "Let AI Work Magic", 
    description: "Watch your CV transform to speak their language",
    icon: Sparkles
  },
  { 
    step: "04", 
    title: "Land Your Dream", 
    description: "Step into interviews with confidence",
    icon: Award
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer → Google",
    content: "I was stuck in my job search for months. CVForge didn't just fix my CV—it helped me see my own worth. Now I'm at my dream company.",
    avatar: "SC",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    name: "Marcus Johnson",
    role: "Career Changer → Stripe",
    content: "Switching industries felt impossible until CVForge showed me how to translate my skills. 10% response rate became 65%.",
    avatar: "MJ",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    name: "Emma Rodriguez",
    role: "Recent Grad → Airbnb",
    content: "As a new graduate, I felt invisible. CVForge helped me highlight my potential, not just my experience. I got offers from 3 top companies!",
    avatar: "ER",
    gradient: "from-rose-500 to-pink-500"
  }
];

function FloatingParticle({ delay, duration, x, y }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 opacity-60"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, -50, -30, 0],
        x: [0, 10, -5, 15, 0],
        scale: [1, 1.2, 0.9, 1.1, 1],
        opacity: [0.6, 1, 0.8, 0.9, 0.6],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  );
}

function TypeWriter({ phrases }) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        setIsVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [phrases]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentPhrase}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="inline-block"
      >
        {phrases[currentPhrase]}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg animate-pulse-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="text-slate-900">CV</span>
                <span className="text-gradient">Forge</span>
              </span>
            </motion.div>
            <motion.div 
              className="hidden md:flex items-center gap-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
              <a href="#stories" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Success Stories</a>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to={createPageUrl('Login')}>
                <Button variant="ghost" className="text-slate-600 hover:text-indigo-600">
                  Sign In
                </Button>
              </Link>
              <Link to={createPageUrl('Register')}>
                <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300">
                  Start Free
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 hero-gradient overflow-hidden noise-overlay">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`
          }}
        />
        
        {[...Array(12)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            duration={5 + (i % 3)}
            x={10 + (i * 7) % 80}
            y={20 + (i * 11) % 60}
          />
        ))}

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 px-5 py-2 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 border-0 text-sm font-medium shadow-lg">
                <Flame className="w-4 h-4 mr-2 text-orange-500" />
                Join 50,000+ job seekers who found their path
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 tracking-tight leading-[1.05]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="block">Your Career</span>
              <span className="block mt-2 text-gradient glow-text animate-gradient bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                Transformation
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-4 font-medium text-slate-600">
                <TypeWriter phrases={inspirationalPhrases} />
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-8 text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Don't just apply—<span className="font-semibold text-indigo-600">stand out</span>. 
              Our AI transforms your experience into compelling stories that 
              <span className="font-semibold text-violet-600"> open doors</span>.
            </motion.p>
            
            <motion.div 
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to={createPageUrl('Register')}>
                <Button 
                  size="lg" 
                  className="h-16 px-10 text-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-500 group animate-pulse-glow"
                >
                  <Rocket className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                  Begin Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={createPageUrl('Templates')}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-16 px-10 text-lg border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 group"
                >
                  <Play className="mr-2 w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  See Examples
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {successStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                  <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.number}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            className="mt-24 relative"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/80 backdrop-blur-xl">
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-inner" />
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-inner" />
                    <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-inner" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm text-slate-500 font-medium">CVForge Editor</span>
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="h-8 bg-gradient-to-r from-indigo-200 to-violet-200 rounded-lg w-2/3 animate-pulse" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-5/6" />
                      <div className="h-4 bg-slate-200 rounded w-4/5" />
                      <div className="mt-6 h-6 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-lg w-1/3 animate-pulse" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">AI Assistant</div>
                          <div className="text-xs text-emerald-600 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Enhancing your CV...
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                          <span className="text-slate-700">Added 3 power verbs</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                          <span className="text-slate-700">ATS score: 85% → 94%</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-violet-50 rounded-lg border border-violet-100">
                          <Target className="w-4 h-4 text-violet-600 mt-0.5" />
                          <span className="text-slate-700">Job match improved to 92%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="absolute top-16 -left-8 md:left-4"
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-5 border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">ATS Score</p>
                    <p className="text-2xl font-bold text-emerald-600">94/100</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute top-32 -right-8 md:right-4"
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-5 border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Job Match</p>
                    <p className="text-2xl font-bold text-violet-600">92%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100/50 via-violet-100/30 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 px-4 py-1.5 bg-indigo-50 text-indigo-700 border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              Everything You Need to
              <span className="block text-gradient mt-2">Win Your Dream Job</span>
            </h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
              Powered by AI that understands what recruiters want and helps you deliver it
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 card-hover overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-32 bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 px-4 py-1.5 bg-violet-50 text-violet-700 border-0">
              <Zap className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              Four Steps to
              <span className="block text-gradient mt-2">Your New Career</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-violet-200 to-purple-200 -translate-y-1/2" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="relative z-10 w-28 h-28 mx-auto rounded-3xl bg-white shadow-xl border border-slate-100 flex flex-col items-center justify-center mb-8 group hover:shadow-2xl transition-all duration-500 card-hover">
                    <step.icon className="w-8 h-8 text-indigo-600 mb-1" />
                    <span className="text-2xl font-bold text-gradient">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="stories" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 px-4 py-1.5 bg-rose-50 text-rose-700 border-0">
              <Heart className="w-4 h-4 mr-2" />
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              Real People,
              <span className="block text-gradient mt-2">Real Transformations</span>
            </h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands who've already changed their careers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="relative bg-white rounded-3xl p-8 border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Quote className="w-10 h-10 text-slate-200 mb-4" />
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-lg text-slate-700 mb-8 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-indigo-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-8"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Rocket className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Dream Job Is
              <span className="block mt-2">Waiting For You</span>
            </h2>
            <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
              Stop applying. Start getting hired. Join the thousands who've transformed their careers with CVForge.
            </p>
            <Link to={createPageUrl('Register')}>
              <Button 
                size="lg" 
                className="h-16 px-12 text-lg bg-white text-indigo-600 hover:bg-indigo-50 shadow-2xl hover:shadow-white/30 transition-all duration-500 group"
              >
                <Sparkles className="mr-2 w-5 h-5 group-hover:animate-spin" />
                Start Your Transformation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <p className="mt-6 text-indigo-200 text-sm">
              Free to start • No credit card needed • 2-minute setup
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl text-white">CVForge</span>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
            </div>
            <p className="text-sm">Made with <Heart className="w-4 h-4 inline text-rose-500" /> for job seekers everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
