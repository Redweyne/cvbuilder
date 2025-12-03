import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  ExternalLink,
  MapPin,
  Building2,
  Clock,
  Target,
  Wand2,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusConfig = {
  active: { label: 'Active', color: 'bg-blue-100 text-blue-700' },
  applied: { label: 'Applied', color: 'bg-indigo-100 text-indigo-700' },
  interviewing: { label: 'Interviewing', color: 'bg-purple-100 text-purple-700' },
  offer: { label: 'Offer', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  archived: { label: 'Archived', color: 'bg-slate-100 text-slate-600' }
};

export default function JobOffers() {
  const urlParams = new URLSearchParams(window.location.search);
  const showNew = urlParams.get('new') === 'true';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(showNew);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => base44.entities.JobOffer.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.JobOffer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsAddDialogOpen(false);
      setEditingJob(null);
      setJobDescription('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.JobOffer.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setEditingJob(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.JobOffer.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setDeleteId(null);
    },
  });

  const parseJobDescription = async () => {
    if (!jobDescription.trim()) return;
    setIsParsing(true);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `
        Parse this job description and extract structured information.
        
        Job Description:
        ${jobDescription}
        
        Extract the following:
        - Job title
        - Company name
        - Location (or "Remote" if remote)
        - Job type (full-time, part-time, contract, freelance, internship)
        - Remote type (onsite, remote, hybrid)
        - Experience level (entry, mid, senior, lead, executive)
        - Required skills (as array)
        - Key requirements (as array of strings)
        - Preferred qualifications (as array of strings)
        - ATS keywords (important keywords for resume matching)
        - Company tone/culture (corporate, startup, creative, academic)
      `,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          company: { type: "string" },
          location: { type: "string" },
          job_type: { type: "string" },
          remote_type: { type: "string" },
          experience_level: { type: "string" },
          required_skills: { type: "array", items: { type: "string" } },
          requirements: { type: "array", items: { type: "string" } },
          preferred_qualifications: { type: "array", items: { type: "string" } },
          keywords: { type: "array", items: { type: "string" } },
          tone: { type: "string" }
        }
      }
    });

    if (response) {
      setEditingJob({
        title: response.title || '',
        company: response.company || '',
        location: response.location || '',
        job_type: response.job_type || 'full-time',
        remote_type: response.remote_type || 'onsite',
        experience_level: response.experience_level || 'mid',
        required_skills: response.required_skills || [],
        requirements: response.requirements || [],
        preferred_qualifications: response.preferred_qualifications || [],
        keywords: response.keywords || [],
        tone: response.tone || 'corporate',
        description: jobDescription,
        status: 'active'
      });
    }

    setIsParsing(false);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveJob = () => {
    if (editingJob?.id) {
      updateMutation.mutate({ id: editingJob.id, data: editingJob });
    } else {
      createMutation.mutate(editingJob);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Job Offers</h1>
          <p className="text-slate-600 mt-1">Track and manage your job applications</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusConfig).slice(0, 4).map(([key, config]) => {
          const count = jobs.filter(j => j.status === key).length;
          return (
            <Card key={key} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Badge className={`${config.color} font-medium`}>
                    {config.label}
                  </Badge>
                  <span className="text-2xl font-bold text-slate-900">{count}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded w-20" />
                  <div className="h-6 bg-slate-200 rounded w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No jobs found' : 'No jobs tracked yet'}
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Start tracking your job applications to stay organized'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Job
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 truncate">
                            {job.title}
                          </h3>
                          <Badge className={statusConfig[job.status]?.color || 'bg-slate-100'}>
                            {statusConfig[job.status]?.label || 'Active'}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {job.company}
                          </span>
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                          )}
                          {job.created_date && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Added {format(new Date(job.created_date), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>

                        {job.required_skills && job.required_skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.required_skills.slice(0, 5).map((skill, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.required_skills.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.required_skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link to={createPageUrl('TailorCV') + `?job=${job.id}`}>
                          <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Target className="w-4 h-4 mr-2" />
                            Tailor CV
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingJob(job)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateMutation.mutate({ id: job.id, data: { status: 'applied' } })}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Applied
                            </DropdownMenuItem>
                            {job.source_url && (
                              <DropdownMenuItem asChild>
                                <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Original
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => setDeleteId(job.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Job Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Job Offer</DialogTitle>
          </DialogHeader>

          {!editingJob ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Paste Job Description</Label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here and we'll extract the important details..."
                  className="min-h-[200px]"
                />
              </div>
              <Button 
                onClick={parseJobDescription}
                disabled={isParsing || !jobDescription.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isParsing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                Parse with AI
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or add manually</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setEditingJob({
                  title: '',
                  company: '',
                  location: '',
                  job_type: 'full-time',
                  remote_type: 'onsite',
                  status: 'active'
                })}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Manually
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={editingJob.title || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={editingJob.company || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                    placeholder="Google"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={editingJob.location || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select
                    value={editingJob.job_type || 'full-time'}
                    onValueChange={(value) => setEditingJob({ ...editingJob, job_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Work Type</Label>
                  <Select
                    value={editingJob.remote_type || 'onsite'}
                    onValueChange={(value) => setEditingJob({ ...editingJob, remote_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingJob.status || 'active'}
                    onValueChange={(value) => setEditingJob({ ...editingJob, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Source URL (Optional)</Label>
                <Input
                  value={editingJob.source_url || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, source_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={editingJob.notes || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, notes: e.target.value })}
                  placeholder="Any notes about this application..."
                  className="min-h-[80px]"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setEditingJob(null);
                  setIsAddDialogOpen(false);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveJob} className="bg-indigo-600 hover:bg-indigo-700">
                  {editingJob.id ? 'Update' : 'Save'} Job
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingJob && !isAddDialogOpen} onOpenChange={() => setEditingJob(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Job Offer</DialogTitle>
          </DialogHeader>
          {editingJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={editingJob.title || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={editingJob.company || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={editingJob.location || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingJob.status || 'active'}
                    onValueChange={(value) => setEditingJob({ ...editingJob, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingJob(null)}>Cancel</Button>
                <Button onClick={handleSaveJob} className="bg-indigo-600 hover:bg-indigo-700">
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this job offer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}