import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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
  Zap
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

export default function Dashboard() {
  const { user } = useAuth();

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
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to export PDF');
    }
  };

  const stats = [
    { 
      label: 'Total CVs', 
      value: cvs.length, 
      icon: FileText, 
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    { 
      label: 'Job Applications', 
      value: jobs.filter(j => j.status === 'applied' || j.status === 'interviewing').length, 
      icon: Briefcase, 
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      label: 'Avg. Match Score', 
      value: cvs.length > 0 ? Math.round(cvs.reduce((acc, cv) => acc + (cv.job_match_score || 0), 0) / cvs.length) + '%' : 'N/A', 
      icon: Target, 
      color: 'bg-violet-500',
      lightColor: 'bg-violet-50',
      textColor: 'text-violet-600'
    },
    { 
      label: 'AI Credits', 
      value: `${(subscription?.ai_credits_limit || 5) - (subscription?.ai_credits_used || 0)}`, 
      icon: Sparkles, 
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-slate-600 mt-1">
            Here's what's happening with your job search
          </p>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to={createPageUrl('CVEditor')}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white cursor-pointer shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Create New CV</h3>
            <p className="text-indigo-100 text-sm mt-1">Start from scratch</p>
          </motion.div>
        </Link>

        <Link to={createPageUrl('CVEditor') + '?upload=true'}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900">Upload CV</h3>
            <p className="text-slate-500 text-sm mt-1">Import existing file</p>
          </motion.div>
        </Link>

        <Link to={createPageUrl('JobOffers') + '?new=true'}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 cursor-pointer hover:border-emerald-300 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900">Add Job</h3>
            <p className="text-slate-500 text-sm mt-1">Track applications</p>
          </motion.div>
        </Link>

        <Link to={createPageUrl('TailorCV')}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 cursor-pointer hover:border-violet-300 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="font-semibold text-lg text-slate-900">AI Tailor</h3>
            <p className="text-slate-500 text-sm mt-1">Optimize for job</p>
          </motion.div>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.lightColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Recent CVs</CardTitle>
              <Link to={createPageUrl('MyCVs')}>
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
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
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">No CVs yet</h3>
                  <p className="text-slate-500 text-sm mb-4">Create your first CV to get started</p>
                  <Link to={createPageUrl('CVEditor')}>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create CV
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cvs.slice(0, 4).map((cv, index) => (
                    <motion.div
                      key={cv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                    >
                      <div className="w-14 h-18 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">{cv.title || 'Untitled CV'}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {cv.template_id || 'Professional'}
                          </Badge>
                          {cv.ats_score && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              ATS: {cv.ats_score}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={createPageUrl('CVEditor') + `?id=${cv.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExportPdf(cv)}>
                              <Download className="w-4 h-4 mr-2" />
                              Export PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={createPageUrl('TailorCV') + `?cv=${cv.id}`}>
                                <Target className="w-4 h-4 mr-2" />
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
              <CardTitle className="text-lg font-semibold">Your Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Plan</span>
                <Badge className={subscription?.plan === 'pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}>
                  {subscription?.plan?.toUpperCase() || 'FREE'}
                </Badge>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">AI Credits</span>
                  <span className="font-medium text-slate-900">
                    {subscription?.ai_credits_used || 0}/{subscription?.ai_credits_limit || 5}
                  </span>
                </div>
                <Progress 
                  value={((subscription?.ai_credits_used || 0) / (subscription?.ai_credits_limit || 5)) * 100} 
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">PDF Exports</span>
                  <span className="font-medium text-slate-900">
                    {subscription?.exports_used || 0}/{subscription?.exports_limit || 3}
                  </span>
                </div>
                <Progress 
                  value={((subscription?.exports_used || 0) / (subscription?.exports_limit || 3)) * 100} 
                  className="h-2"
                />
              </div>
              {subscription?.plan === 'free' && (
                <Link to={createPageUrl('Billing')}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 mt-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Recent Jobs</CardTitle>
              <Link to={createPageUrl('JobOffers')}>
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 text-sm mb-3">No jobs tracked yet</p>
                  <Link to={createPageUrl('JobOffers') + '?new=true'}>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Job
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 4).map(job => (
                    <div key={job.id} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <h4 className="font-medium text-slate-900 text-sm truncate">{job.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{job.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            job.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                            job.status === 'interviewing' ? 'bg-emerald-100 text-emerald-700' :
                            job.status === 'offer' ? 'bg-green-100 text-green-700' :
                            job.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {job.status?.replace('_', ' ') || 'Active'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
