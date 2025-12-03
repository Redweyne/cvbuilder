import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, CheckCircle, ArrowRight, Rocket, Star, Zap, Target, Trophy, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

function FloatingOrb({ delay, size, x, y, color }) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} blur-3xl opacity-30`}
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -30, 20, -10, 0],
        scale: [1, 1.2, 0.9, 1.1, 1],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  );
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(email, password, fullName);
      toast.success('Welcome to CVForge! Your journey starts now.', {
        icon: <Rocket className="w-5 h-5 text-indigo-600" />,
      });
      navigate('/Dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Sparkles, text: 'AI-powered optimization', color: 'text-violet-600' },
    { icon: Target, text: 'Perfect job matching', color: 'text-emerald-600' },
    { icon: Trophy, text: 'ATS-winning templates', color: 'text-amber-600' },
    { icon: Zap, text: 'Instant PDF export', color: 'text-blue-600' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      <div className="absolute inset-0 hero-gradient" />
      
      <FloatingOrb delay={0} size="400px" x={5} y={30} color="bg-violet-400" />
      <FloatingOrb delay={4} size="350px" x={75} y={50} color="bg-indigo-400" />
      <FloatingOrb delay={8} size="200px" x={60} y={5} color="bg-purple-400" />
      
      <div className="absolute inset-0 noise-overlay" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link to="/" className="inline-flex items-center gap-3 group">
            <motion.div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-3xl font-bold">
              <span className="text-slate-900">CV</span>
              <span className="text-gradient">Forge</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-2xl shadow-slate-900/10 backdrop-blur-xl bg-white/80 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
            <CardHeader className="text-center pb-2 pt-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg"
              >
                <Rocket className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-slate-900">Begin Your Journey</CardTitle>
              <CardDescription className="text-slate-600">Join 50,000+ who've transformed their careers</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8 px-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-700 font-medium">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-12 h-12 text-base border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 input-focus-glow transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 text-base border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 input-focus-glow transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 text-base border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 input-focus-glow transition-all"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">At least 6 characters</p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating your account...
                    </>
                  ) : (
                    <>
                      Start Your Transformation
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <motion.div 
                className="mt-8 pt-6 border-t border-slate-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xs text-slate-500 text-center mb-4 font-medium">What you'll get:</p>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={feature.text} 
                      className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <feature.icon className={`w-4 h-4 ${feature.color}`} />
                      <span className="text-xs font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="mt-8 text-center">
                <p className="text-slate-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.p 
          className="text-center text-sm text-slate-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Free to start • No credit card needed • Join in 30 seconds
        </motion.p>
      </motion.div>
    </div>
  );
}
