import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { api } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Send,
  Loader2,
  Sparkles,
  Heart,
  Lightbulb,
  Target,
  MessageCircle,
  Brain,
  User,
  ChevronRight,
  BookOpen,
  Rocket,
  Shield,
  TrendingUp,
  Coffee,
  Zap,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const quickPrompts = [
  { icon: Target, text: "How do I stand out in my job applications?", category: "strategy" },
  { icon: Brain, text: "I'm feeling overwhelmed with my job search", category: "support" },
  { icon: TrendingUp, text: "How can I negotiate a better salary?", category: "negotiation" },
  { icon: Shield, text: "How do I overcome imposter syndrome?", category: "confidence" },
  { icon: Rocket, text: "I want to transition to a new career", category: "transition" },
  { icon: Coffee, text: "I'm burned out from job hunting", category: "wellbeing" },
];

const mentorGreetings = [
  "Welcome! I'm here to guide you through your career journey. What's on your mind today?",
  "Hello! Think of me as your personal career coach. What can I help you with?",
  "Great to see you! Whether you need strategy, support, or just someone to brainstorm with - I'm here. What would you like to discuss?",
];

function MentorAvatar({ isThinking }) {
  return (
    <motion.div 
      className="relative flex-shrink-0"
      animate={isThinking ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1.5, repeat: isThinking ? Infinity : 0 }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
        <Brain className="w-6 h-6 text-white" />
      </div>
      {isThinking && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <Loader2 className="w-3 h-3 text-white animate-spin" />
        </motion.div>
      )}
    </motion.div>
  );
}

function UserAvatar() {
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
      <User className="w-6 h-6 text-slate-600" />
    </div>
  );
}

function MessageBubble({ message, isUser, isTyping }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {isUser ? <UserAvatar /> : <MentorAvatar isThinking={isTyping} />}
      
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl p-4 ${
          isUser 
            ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white' 
            : 'bg-white shadow-md border border-slate-100'
        }`}>
          {isTyping ? (
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo-400"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          ) : (
            <>
              <p className={`leading-relaxed ${isUser ? 'text-white' : 'text-slate-800'}`}>
                {message.content}
              </p>
              
              {!isUser && message.action_items?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-indigo-600 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Action Items
                  </h4>
                  <ul className="space-y-1">
                    {message.action_items.map((item, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {!isUser && message.encouragement && (
                <div className="mt-4 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
                  <p className="text-sm text-violet-700 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    {message.encouragement}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        {!isUser && !isTyping && message.topic_tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.topic_tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-white">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CareerMentor() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { data: cvs = [] } = useQuery({
    queryKey: ['cvs'],
    queryFn: () => api.cvs.list(),
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.jobs.list(),
  });

  useEffect(() => {
    const greeting = mentorGreetings[Math.floor(Math.random() * mentorGreetings.length)];
    setMessages([{
      id: 'greeting',
      role: 'mentor',
      content: greeting,
      encouragement: "Remember: every step forward counts, no matter how small.",
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildContext = () => ({
    user: {
      name: user?.full_name,
      email: user?.email,
    },
    cvs_count: cvs.length,
    jobs_tracked: jobs.length,
    latest_cv: cvs[0] || null,
    latest_job: jobs[0] || null,
  });

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    
    setShowQuickPrompts(false);
    setInputValue('');
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);
    
    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      
      const response = await api.ai.mentorChat(
        messageText,
        buildContext(),
        conversationHistory
      );
      
      const mentorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'mentor',
        content: response.response,
        action_items: response.action_items,
        encouragement: response.encouragement,
        topic_tags: response.topic_tags,
        follow_up: response.follow_up_question,
      };
      
      setMessages(prev => [...prev, mentorMessage]);
    } catch (error) {
      toast.error(error.message || 'Failed to get response');
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickPrompt = (prompt) => {
    sendMessage(prompt.text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
      <div className="flex-shrink-0 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Career Mentor</h1>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online and ready to help
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isUser={message.role === 'user'}
                  isTyping={false}
                />
              ))}
              
              {isThinking && (
                <MessageBubble
                  key="typing"
                  message={{}}
                  isUser={false}
                  isTyping={true}
                />
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>

          {showQuickPrompts && messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <h3 className="text-sm font-medium text-slate-500 mb-4 text-center">
                Or start with one of these topics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickPrompts.map((prompt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 text-left group"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mb-3 group-hover:from-indigo-200 group-hover:to-violet-200 transition-colors">
                      <prompt.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-sm text-slate-700 leading-snug">{prompt.text}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Share what's on your mind..."
                className="min-h-[52px] max-h-[150px] resize-none pr-4 text-base border-slate-200 focus:border-indigo-400 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={isThinking}
              />
            </div>
            <Button
              type="submit"
              disabled={!inputValue.trim() || isThinking}
              className="h-[52px] w-[52px] rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg"
            >
              {isThinking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
          <p className="text-xs text-slate-400 text-center mt-2">
            Your conversations are private and help personalize your experience
          </p>
        </div>
      </div>
    </div>
  );
}
