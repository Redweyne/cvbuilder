import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
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
  Flame,
  Brain,
  Compass,
  MessageSquare,
  Trophy,
  Gem,
  Crown,
  Lightbulb,
  Eye,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const transformationStories = [
  "Your story deserves to be heard",
  "Every setback is a setup for a comeback",
  "You are one CV away from changing everything", 
  "Dream jobs aren't just dreams",
  "The world needs what only you can offer",
  "Your potential is limitless",
  "Today's application is tomorrow's career"
];

const impactStats = [
  { number: "127,000+", label: "Lives Transformed", icon: Heart, description: "Real people, real career breakthroughs" },
  { number: "94%", label: "Interview Success", icon: TrendingUp, description: "Our users land more interviews" },
  { number: "3.2x", label: "More Callbacks", icon: Flame, description: "Average increase in recruiter responses" },
  { number: "48hrs", label: "Average Time to Interview", icon: Clock, description: "From application to callback" },
];

const journeyPhases = [
  {
    phase: "01",
    title: "Discover Your Story",
    headline: "Uncover What Makes You Remarkable",
    description: "Through guided AI conversations, we help you discover strengths you didn't know you had. Your experiences become powerful narratives that captivate employers.",
    icon: Compass,
    color: "from-rose-500 via-pink-500 to-fuchsia-500",
    features: ["AI Career Discovery", "Strength Analysis", "Story Mining"]
  },
  {
    phase: "02", 
    title: "Craft Your Weapon",
    headline: "Build a CV That Opens Doors",
    description: "Transform your story into a precision-crafted document. Our AI ensures every word resonates with recruiters and passes through any ATS system.",
    icon: Wand2,
    color: "from-violet-500 via-purple-500 to-indigo-500",
    features: ["AI Enhancement", "ATS Optimization", "Industry Templates"]
  },
  {
    phase: "03",
    title: "Target Your Dream",
    headline: "Perfect Match, Every Time",
    description: "Paste any job description and watch your CV transform to speak directly to that opportunity. Increase your match rate from average to exceptional.",
    icon: Target,
    color: "from-blue-500 via-cyan-500 to-teal-500",
    features: ["Smart Tailoring", "Keyword Matching", "Gap Analysis"]
  },
  {
    phase: "04",
    title: "Conquer Your Interview",
    headline: "Walk In With Unstoppable Confidence",
    description: "Practice with our AI interviewer that simulates real pressure. Get feedback, refine your answers, and transform anxiety into anticipation.",
    icon: MessageSquare,
    color: "from-emerald-500 via-green-500 to-lime-500",
    features: ["Mock Interviews", "Real-time Feedback", "Confidence Training"]
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    journey: "Career Changer",
    content: "I was a teacher for 8 years, terrified I was stuck forever. CVForge didn't just help me write a CV—it helped me see that my classroom experience was actually my superpower in tech. Now I'm at Google, and I still pinch myself.",
    avatar: "SC",
    gradient: "from-blue-500 to-indigo-600",
    metric: "300%",
    metricLabel: "salary increase"
  },
  {
    name: "Marcus Johnson",
    role: "Product Lead",
    company: "Stripe",
    journey: "Industry Switch",
    content: "6 months of rejection had crushed my confidence. The Career Discovery feature helped me articulate my value in ways I never could before. Within weeks, I had 4 offers. I chose Stripe.",
    avatar: "MJ",
    gradient: "from-violet-500 to-purple-600",
    metric: "4",
    metricLabel: "job offers"
  },
  {
    name: "Emma Rodriguez",
    role: "UX Designer",
    company: "Airbnb",
    journey: "Fresh Graduate",
    content: "Everyone told me I needed 'experience' to get experience. CVForge helped me showcase my projects and passion in a way that made companies fight over me. I'm now designing products used by millions.",
    avatar: "ER",
    gradient: "from-rose-500 to-pink-600",
    metric: "First",
    metricLabel: "choice company"
  },
  {
    name: "David Kim",
    role: "Engineering Manager",
    company: "Meta",
    journey: "Career Advancement",
    content: "I'd been passed over for promotion 3 times. Using the Success Roadmap, I identified exactly what was holding me back. 6 months later, I wasn't just promoted—I got recruited by Meta as a manager.",
    avatar: "DK",
    gradient: "from-amber-500 to-orange-600",
    metric: "2x",
    metricLabel: "responsibility"
  }
];

const aiFeatures = [
  {
    icon: Brain,
    title: "Career Discovery AI",
    description: "Deep conversations that reveal your hidden strengths and unique value",
    gradient: "from-violet-500 to-purple-600"
  },
  {
    icon: Wand2,
    title: "Smart Enhancement",
    description: "Transform ordinary descriptions into compelling achievements",
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    icon: Target,
    title: "Precision Tailoring",
    description: "Customize your CV for any job with surgical accuracy",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    icon: MessageSquare,
    title: "Interview Simulator",
    description: "Practice with AI that challenges and prepares you",
    gradient: "from-rose-500 to-pink-600"
  },
  {
    icon: MapPin,
    title: "Success Roadmap",
    description: "A personalized journey to your dream career",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    icon: Shield,
    title: "ATS Mastery",
    description: "Beat the bots and reach human eyes every time",
    gradient: "from-indigo-500 to-blue-600"
  }
];

function ParticleField() {
  const particles = React.useMemo(() => 
    [...Array(12)].map((_, i) => ({
      id: i,
      width: 3 + (i % 3),
      height: 3 + (i % 3),
      left: `${(i * 8.5) % 100}%`,
      top: `${(i * 12) % 100}%`,
      delay: i * 0.8,
      duration: 8 + (i % 4) * 2,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-indigo-400/30 animate-float-slow"
          style={{
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent)' }}
      />
    </div>
  );
}

function TypewriterEffect({ phrases }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 30 : 50);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, phrases]);

  return (
    <span className="inline-block min-h-[1.5em]">
      {displayText}
      <motion.span
        className="inline-block w-[3px] h-[1em] ml-1 bg-indigo-500 rounded-full"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    </span>
  );
}

function CountUpNumber({ end, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    const numericEnd = parseFloat(end.replace(/[^0-9.]/g, ''));
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(numericEnd * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  const prefix = end.match(/^[^0-9]*/)?.[0] || '';
  const endSuffix = end.match(/[^0-9.]*$/)?.[0] || '';

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{endSuffix}{suffix}
    </span>
  );
}

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
      <div className="relative bg-white rounded-3xl p-8 h-full border border-slate-200/50 shadow-lg group-hover:shadow-2xl transition-all duration-500">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
          <feature.icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
          {feature.title}
        </h3>
        <p className="text-slate-600 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

function JourneyPhase({ phase, index, isActive, onClick }) {
  return (
    <motion.div
      className={`cursor-pointer transition-all duration-500 ${isActive ? 'scale-100' : 'scale-95 opacity-70'}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`relative overflow-hidden rounded-3xl p-8 ${isActive ? 'bg-white shadow-2xl' : 'bg-white/50'} transition-all duration-500`}>
        {isActive && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-5`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
          />
        )}
        <div className="flex items-start gap-6">
          <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg ${isActive ? 'animate-pulse-glow' : ''}`}>
            <phase.icon className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-sm font-bold bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                PHASE {phase.phase}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-sm text-slate-500">{phase.title}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {phase.headline}
            </h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              {phase.description}
            </p>
            {isActive && (
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {phase.features.map((feature, i) => (
                  <Badge key={i} className={`bg-gradient-to-r ${phase.color} text-white border-0`}>
                    {feature}
                  </Badge>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ testimonial, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500" />
      <div className="relative bg-white rounded-3xl p-8 h-full border border-slate-200 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {testimonial.avatar}
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
            <p className="text-sm text-slate-500">{testimonial.role} at {testimonial.company}</p>
            <Badge variant="secondary" className="mt-1 text-xs">{testimonial.journey}</Badge>
          </div>
        </div>
        
        <div className="relative mb-6">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-indigo-100" />
          <p className="text-slate-600 leading-relaxed pl-6 italic">
            "{testimonial.content}"
          </p>
        </div>
        
        <div className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${testimonial.gradient} bg-opacity-10`}>
          <div className={`text-3xl font-bold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}>
            {testimonial.metric}
          </div>
          <div className="text-sm text-slate-600">
            {testimonial.metricLabel}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <span className="text-sm font-medium">Scroll to explore</span>
      <ChevronDown className="w-5 h-5" />
    </motion.div>
  );
}

export default function Home() {
  const [activePhase, setActivePhase] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % journeyPhases.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg animate-pulse-glow">
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
              <a href="#journey" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How It Works</a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
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

      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center hero-gradient-immersive overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <AuroraBackground />
        <ParticleField />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-8 px-6 py-2.5 bg-white/80 backdrop-blur-sm text-indigo-700 border border-indigo-200/50 text-sm font-medium shadow-xl">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="font-semibold">127,000+ career transformations</span>
                <span className="text-slate-400">and counting</span>
              </span>
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="block text-slate-900">Your Career</span>
            <span className="block mt-2 text-gradient-aurora glow-text-intense">
              Transformation
            </span>
            <motion.span 
              className="block mt-6 text-2xl sm:text-3xl md:text-4xl font-medium text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TypewriterEffect phrases={transformationStories} />
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="mt-10 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            This isn't just a CV builder. It's a <span className="font-semibold text-indigo-600">career transformation engine</span> powered by AI that understands your unique story and helps you tell it in ways that 
            <span className="font-semibold text-violet-600"> open doors you never thought possible</span>.
          </motion.p>
          
          <motion.div 
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to={createPageUrl('Register')}>
              <Button 
                size="lg" 
                className="h-16 px-12 text-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-500 group animate-pulse-glow-intense magnetic-button"
              >
                <Rocket className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                Begin Your Transformation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Link to={createPageUrl('CareerDiscovery')}>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 px-10 text-lg border-2 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 group magnetic-button"
              >
                <Compass className="mr-2 w-5 h-5 text-indigo-600 group-hover:rotate-45 transition-transform" />
                Discover Your Story
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                    <CountUpNumber end={stat.number} />
                  </div>
                  <div className="text-sm font-semibold text-slate-700">{stat.label}</div>
                  <div className="text-xs text-slate-500 mt-1 hidden md:block">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <ScrollIndicator />
      </motion.section>

      <section id="journey" className="py-32 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 px-5 py-2 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 border-0 text-sm font-medium">
              <Compass className="w-4 h-4 mr-2" />
              The Journey
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              Four Phases to
              <span className="block text-gradient mt-2">Transform Your Career</span>
            </h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
              A proven path from where you are to where you dream of being
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-1 gap-6 max-w-4xl mx-auto">
            {journeyPhases.map((phase, index) => (
              <JourneyPhase
                key={phase.phase}
                phase={phase}
                index={index}
                isActive={activePhase === index}
                onClick={() => setActivePhase(index)}
              />
            ))}
          </div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to={createPageUrl('Register')}>
              <Button 
                size="lg"
                className="h-14 px-10 text-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-500/30"
              >
                Start Your Journey Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-indigo-100/30 via-violet-100/20 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 px-5 py-2 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-0 text-sm font-medium">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              Everything You Need to
              <span className="block text-gradient mt-2">Win Your Dream Career</span>
            </h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
              Powered by AI that truly understands what success looks like in your industry
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 px-5 py-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border-0 text-sm font-medium">
              <Heart className="w-4 h-4 mr-2" />
              Real Stories, Real Transformations
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              They Did It.
              <span className="block text-gradient mt-2">So Can You.</span>
            </h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands who've transformed their careers with CVForge
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        </div>
        <ParticleField />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Your Dream Career is
              <span className="block mt-2">Closer Than You Think</span>
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Stop wondering "what if" and start building your future today. 
              The first step is always the hardest—we're here to make it easy.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl('Register')}>
                <Button 
                  size="lg" 
                  className="h-16 px-12 text-lg bg-white text-indigo-600 hover:bg-slate-100 shadow-2xl shadow-black/20 group"
                >
                  <Rocket className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Start Your Transformation — Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-white/60 text-sm">
              No credit card required. Start transforming your career in minutes.
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                CV<span className="text-indigo-400">Forge</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Transforming careers, one story at a time.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-rose-500 animate-heartbeat" />
              <span>for dreamers everywhere</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
