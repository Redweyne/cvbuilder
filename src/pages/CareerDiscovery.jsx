import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { api } from '@/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  Rocket,
  Compass,
  Lightbulb,
  Target,
  Award,
  Flame,
  Zap,
  ChevronRight,
  Loader2,
  Trophy,
  CheckCircle,
  Quote,
  Brain,
  Gem,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const reflectionQuestions = [
  {
    id: 'proudest_moment',
    question: "What's a moment in your career where you felt truly proud of yourself?",
    subtext: "Think about a time when you thought, 'I did that.' What happened?",
    icon: Trophy,
    gradient: "from-amber-500 to-orange-500",
    placeholder: "Describe the situation, what you did, and why it made you proud..."
  },
  {
    id: 'natural_strengths',
    question: "What do people always come to you for help with?",
    subtext: "Those things that feel easy to you but others find impressive or difficult.",
    icon: Lightbulb,
    gradient: "from-violet-500 to-purple-500",
    placeholder: "Think about the advice you give, problems you solve, skills people admire..."
  },
  {
    id: 'challenge_overcome',
    question: "What's the hardest challenge you've faced professionally, and how did you grow from it?",
    subtext: "Challenges reveal our true character. What did you discover about yourself?",
    icon: Flame,
    gradient: "from-rose-500 to-red-500",
    placeholder: "Describe the challenge, how you approached it, and what you learned..."
  },
  {
    id: 'dream_impact',
    question: "If you could make any impact in the world through your work, what would it be?",
    subtext: "Don't hold back - what kind of mark do you want to leave?",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    placeholder: "Think big - what change do you want to create? Who do you want to help?"
  },
  {
    id: 'unique_combination',
    question: "What unusual combination of experiences, skills, or interests do you have?",
    subtext: "Your unique mix is your superpower. What makes your perspective different?",
    icon: Gem,
    gradient: "from-cyan-500 to-blue-500",
    placeholder: "Think about your background, hobbies, experiences that most people in your field don't have..."
  }
];

function FloatingOrb({ delay, size, color, x, y }) {
  return (
    <motion.div
      className={`absolute rounded-full ${size} ${color} blur-xl opacity-30`}
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -20, 0, 20, 0],
        x: [0, 15, 0, -15, 0],
        scale: [1, 1.2, 1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  );
}

function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {[...Array(totalSteps)].map((_, i) => (
        <motion.div
          key={i}
          className={`h-2 rounded-full transition-all duration-500 ${
            i < currentStep 
              ? 'bg-gradient-to-r from-indigo-500 to-violet-500 w-8' 
              : i === currentStep 
                ? 'bg-gradient-to-r from-indigo-400 to-violet-400 w-12' 
                : 'bg-slate-200 w-4'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

function StoryReveal({ story, onComplete }) {
  const [revealPhase, setRevealPhase] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (revealPhase < 5) {
        setRevealPhase(prev => prev + 1);
      }
    }, revealPhase === 0 ? 1500 : 2500);
    return () => clearTimeout(timer);
  }, [revealPhase]);

  const phases = [
    { key: 'loading', component: (
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-2xl mb-6"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Brain className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Discovering Your Story...</h2>
        <p className="text-slate-600">Our AI is uncovering your unique career narrative</p>
      </motion.div>
    )},
    { key: 'golden_thread', component: (
      <motion.div 
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg mb-6">
          <Compass className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-indigo-600 mb-2">Your Golden Thread</h3>
        <p className="text-2xl font-bold text-slate-900 leading-relaxed">{story.golden_thread}</p>
      </motion.div>
    )},
    { key: 'identity', component: (
      <motion.div 
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg mb-6">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-violet-600 mb-2">Your Professional Identity</h3>
        <p className="text-2xl font-bold text-slate-900 leading-relaxed">{story.professional_identity}</p>
      </motion.div>
    )},
    { key: 'superpowers', component: (
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-emerald-600 mb-2">Your Hidden Superpowers</h3>
          <p className="text-slate-600">Strengths you may not even recognize in yourself</p>
        </div>
        <div className="grid gap-3">
          {story.hidden_superpowers?.map((power, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-medium text-slate-800">{power}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )},
    { key: 'origin', component: (
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-rose-600 mb-2">Your Origin Story</h3>
        </div>
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-violet-500" />
          <CardContent className="p-8">
            <Quote className="w-8 h-8 text-rose-200 mb-4" />
            <p className="text-xl text-slate-800 leading-relaxed italic">{story.origin_story}</p>
          </CardContent>
        </Card>
      </motion.div>
    )},
    { key: 'complete', component: (
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center mb-10">
          <motion.div
            className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-2xl mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Story Has Been Discovered</h2>
          <p className="text-lg text-slate-600">Here's how you should see yourself from now on</p>
        </div>

        <Card className="border-0 shadow-2xl overflow-hidden mb-8">
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Your Unique Value Proposition</h3>
            <p className="text-2xl font-bold text-slate-900 mb-8">{story.unique_value_proposition}</p>
            
            <h3 className="text-xl font-semibold text-violet-600 mb-4">Breakthrough Insights</h3>
            <div className="space-y-3 mb-8">
              {story.breakthrough_insights?.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-violet-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-violet-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-800">{insight}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Your Transformation
              </h3>
              <p className="text-lg opacity-90">{story.transformation_statement}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={onComplete}
            className="h-14 px-8 text-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 shadow-xl shadow-indigo-500/30"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Use This to Build My CV
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    )}
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <AnimatePresence mode="wait">
        <motion.div key={revealPhase} className="w-full">
          {phases[revealPhase]?.component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function CareerDiscovery() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [discoveredStory, setDiscoveredStory] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < reflectionQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      analyzeStory();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const analyzeStory = async () => {
    setIsAnalyzing(true);
    try {
      const story = await api.ai.discoverStory(responses);
      setDiscoveredStory(story);
    } catch (error) {
      toast.error(error.message || 'Failed to analyze your story. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('cvforge_career_story', JSON.stringify(discoveredStory));
    navigate('/CVEditor?from=discovery');
  };

  const currentQ = reflectionQuestions[currentQuestion];
  const currentResponse = responses[currentQ?.id] || '';
  const canProceed = currentResponse.length >= 50;

  if (showIntro) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <FloatingOrb delay={0} size="w-64 h-64" color="bg-indigo-400" x={10} y={20} />
        <FloatingOrb delay={2} size="w-48 h-48" color="bg-violet-400" x={80} y={10} />
        <FloatingOrb delay={4} size="w-56 h-56" color="bg-purple-400" x={70} y={60} />
        <FloatingOrb delay={1} size="w-40 h-40" color="bg-pink-400" x={20} y={70} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-2xl mb-8"
              animate={{ 
                boxShadow: [
                  "0 25px 50px -12px rgba(99, 102, 241, 0.3)",
                  "0 25px 50px -12px rgba(139, 92, 246, 0.5)",
                  "0 25px 50px -12px rgba(99, 102, 241, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Compass className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                Career Story
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              In the next 5 minutes, you'll uncover the unique narrative that makes you 
              extraordinary. This isn't about listing skills—it's about discovering who you really are.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              {[
                { icon: Lightbulb, title: "Uncover Hidden Strengths", desc: "Discover superpowers you didn't know you had" },
                { icon: Heart, title: "Find Your Purpose", desc: "Connect with what truly drives you" },
                { icon: Sparkles, title: "Craft Your Narrative", desc: "Get a compelling story that opens doors" }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    i === 0 ? 'from-amber-400 to-orange-500' :
                    i === 1 ? 'from-rose-400 to-pink-500' :
                    'from-violet-400 to-purple-500'
                  } flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                onClick={() => setShowIntro(false)}
                className="h-16 px-10 text-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Begin Your Discovery
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-slate-500 mt-4">Takes about 5 minutes. Your responses are private.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
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
            <Brain className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Discovering Your Story...</h2>
          <p className="text-slate-600">Our AI is analyzing your reflections to uncover your unique narrative</p>
        </motion.div>
      </div>
    );
  }

  if (discoveredStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4">
        <StoryReveal story={discoveredStory} onComplete={handleComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4">
      <FloatingOrb delay={0} size="w-48 h-48" color="bg-indigo-300" x={5} y={30} />
      <FloatingOrb delay={2} size="w-32 h-32" color="bg-violet-300" x={85} y={20} />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          className="mb-8 flex items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" size="icon" className="hover:bg-white/80">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Career Story Discovery</h1>
            <p className="text-slate-600">Question {currentQuestion + 1} of {reflectionQuestions.length}</p>
          </div>
        </motion.div>

        <ProgressIndicator currentStep={currentQuestion} totalSteps={reflectionQuestions.length} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${currentQ.gradient}`} />
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentQ.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <currentQ.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentQ.question}</h2>
                    <p className="text-slate-600">{currentQ.subtext}</p>
                  </div>
                </div>

                <Textarea
                  value={currentResponse}
                  onChange={(e) => handleResponseChange(currentQ.id, e.target.value)}
                  placeholder={currentQ.placeholder}
                  className="min-h-[200px] text-lg border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 resize-none"
                />

                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-slate-500">
                    {currentResponse.length < 50 ? (
                      <span>Write at least {50 - currentResponse.length} more characters</span>
                    ) : (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Great depth!
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {currentQuestion > 0 && (
                      <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed}
                      className={`bg-gradient-to-r ${currentQ.gradient} hover:opacity-90 shadow-lg`}
                    >
                      {currentQuestion === reflectionQuestions.length - 1 ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Discover My Story
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
