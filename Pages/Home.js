import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
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
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Upload,
    title: "Upload or Create",
    description: "Start fresh or upload your existing CV. Our AI will parse and optimize it instantly."
  },
  {
    icon: Target,
    title: "Match to Jobs",
    description: "Paste any job offer and watch AI tailor your CV to match requirements perfectly."
  },
  {
    icon: Wand2,
    title: "AI Enhancement",
    description: "Transform weak bullet points into powerful achievements with action verbs."
  },
  {
    icon: Shield,
    title: "ATS Optimized",
    description: "Every CV is optimized to pass Applicant Tracking Systems with flying colors."
  },
  {
    icon: LayoutTemplate,
    title: "Stunning Templates",
    description: "Choose from professional, creative, or minimal designs that stand out."
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Download as PDF, Word, or share via a custom URL with one click."
  }
];

const steps = [
  { step: "01", title: "Create Your Profile", description: "Enter your experience or upload existing CV" },
  { step: "02", title: "Add Job Target", description: "Paste the job description you're applying for" },
  { step: "03", title: "AI Magic", description: "Watch your CV transform to match the role" },
  { step: "04", title: "Export & Apply", description: "Download and send your perfect application" }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content: "CVForge helped me land interviews at 5 FAANG companies. The AI tailoring is incredible.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager at Stripe",
    content: "I went from 10% response rate to over 60% after using CVForge. Game changer.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    name: "Emma Rodriguez",
    role: "Marketing Director at Airbnb",
    content: "The templates are gorgeous and the ATS optimization actually works. Highly recommend.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="text-slate-900">CV</span>
                <span className="text-indigo-600">Forge</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" className="text-slate-600">
                  Sign In
                </Button>
              </Link>
              <Link to={createPageUrl('Dashboard')}>
                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 bg-indigo-50 text-indigo-700 border-indigo-100">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                AI-Powered CV Builder
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Your Dream Job is
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                One CV Away
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create stunning, ATS-optimized CVs tailored to each job application. 
              Let AI transform your experience into interview-winning content.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to={createPageUrl('Dashboard')}>
                <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/30">
                  Create Your CV
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Templates')}>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-300">
                  <LayoutTemplate className="mr-2 w-5 h-5" />
                  Browse Templates
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% ATS-friendly
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div 
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/50 bg-white">
                <div className="bg-slate-100 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                  <img 
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=600&fit=crop" 
                    alt="CV Editor Preview" 
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              className="absolute top-10 -left-4 md:left-10 bg-white rounded-xl shadow-lg p-4 border border-slate-100 hidden md:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">ATS Score</p>
                  <p className="text-xs text-green-600 font-medium">92/100</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute top-20 -right-4 md:right-10 bg-white rounded-xl shadow-lg p-4 border border-slate-100 hidden md:block"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Job Match</p>
                  <p className="text-xs text-indigo-600 font-medium">87% Match</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-100">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Everything You Need to
              <span className="text-indigo-600"> Land That Job</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Our AI-powered platform handles every aspect of creating the perfect CV
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-14 h-14 rounded-xl bg-indigo-100 group-hover:bg-indigo-600 flex items-center justify-center mb-6 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-100">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Four Simple Steps to Your
              <span className="text-indigo-600"> Perfect CV</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent" />
                )}
                <div className="relative z-10 w-24 h-24 mx-auto rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center mb-6">
                  <span className="text-3xl font-bold text-indigo-600">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-100">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Loved by
              <span className="text-indigo-600"> 50,000+ Job Seekers</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who've already transformed their careers with CVForge.
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="h-14 px-10 text-lg bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl">
                Start Building for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">CVForge</span>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm">© 2024 CVForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}