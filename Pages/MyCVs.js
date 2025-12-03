import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Download,
  Copy,
  Trash2,
  Target,
  TrendingUp,
  Calendar,
  Star,
  StarOff,
  Grid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export default function MyCVs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [deleteId, setDeleteId] = useState(null);

  const queryClient = useQueryClient();

  const { data: cvs = [], isLoading } = useQuery({
    queryKey: ['cvs'],
    queryFn: () => base44.entities.CVDocument.list('-updated_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CVDocument.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
      setDeleteId(null);
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (cv) => {
      const { id, created_date, updated_date, created_by, ...cvData } = cv;
      return base44.entities.CVDocument.create({
        ...cvData,
        title: `${cv.title} (Copy)`,
        is_base_cv: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });

  const toggleBaseCVMutation = useMutation({
    mutationFn: async (cv) => {
      // First, unset any existing base CV
      const baseCvs = cvs.filter(c => c.is_base_cv && c.id !== cv.id);
      for (const baseCv of baseCvs) {
        await base44.entities.CVDocument.update(baseCv.id, { is_base_cv: false });
      }
      // Then toggle the current one
      return base44.entities.CVDocument.update(cv.id, { is_base_cv: !cv.is_base_cv });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });

  const filteredCVs = cvs.filter(cv => {
    const matchesSearch = cv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cv.personal_info?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My CVs</h1>
          <p className="text-slate-600 mt-1">Manage and organize all your CVs</p>
        </div>
        <Link to={createPageUrl('CVEditor')}>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25">
            <Plus className="w-4 h-4 mr-2" />
            Create New CV
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search CVs..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex border rounded-lg overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* CV List */}
      {isLoading ? (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-slate-200 rounded-lg mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCVs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No CVs found' : 'No CVs yet'}
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first CV and start applying for your dream jobs'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link to={createPageUrl('CVEditor')}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First CV
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}
          >
            {filteredCVs.map((cv, index) => (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-indigo-200 overflow-hidden">
                  <CardContent className={`p-0 ${viewMode === 'list' ? 'flex items-center' : ''}`}>
                    {/* Preview Area */}
                    <div className={`relative ${viewMode === 'list' ? 'w-24 h-24' : 'h-40'} bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center`}>
                      <FileText className="w-12 h-12 text-slate-300" />
                      
                      {cv.is_base_cv && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                            <Star className="w-3 h-3 mr-1 fill-amber-500" />
                            Master
                          </Badge>
                        </div>
                      )}
                      
                      {cv.ats_score && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                            <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
                            {cv.ats_score}%
                          </Badge>
                        </div>
                      )}
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Link to={createPageUrl('CVEditor') + `?id=${cv.id}`}>
                          <Button size="sm" variant="secondary">
                            <Eye className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`${viewMode === 'list' ? 'flex-1 flex items-center justify-between' : ''} p-4`}>
                      <div className={viewMode === 'list' ? 'flex-1' : ''}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{cv.title || 'Untitled CV'}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">
                              {cv.template_id || 'Professional'} template
                            </p>
                          </div>
                          {viewMode !== 'list' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toggleBaseCVMutation.mutate(cv)}>
                                  {cv.is_base_cv ? (
                                    <>
                                      <StarOff className="w-4 h-4 mr-2" />
                                      Remove as Master
                                    </>
                                  ) : (
                                    <>
                                      <Star className="w-4 h-4 mr-2" />
                                      Set as Master
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => duplicateMutation.mutate(cv)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="w-4 h-4 mr-2" />
                                  Export PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Target className="w-4 h-4 mr-2" />
                                  Tailor for Job
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => setDeleteId(cv.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'mt-1' : 'mt-3'}`}>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              cv.status === 'complete' ? 'bg-green-100 text-green-700' :
                              cv.status === 'archived' ? 'bg-slate-100 text-slate-600' :
                              'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {cv.status || 'Draft'}
                          </Badge>
                          {cv.job_match_score && (
                            <span className="text-xs text-slate-500 flex items-center">
                              <Target className="w-3 h-3 mr-1" />
                              {cv.job_match_score}% match
                            </span>
                          )}
                        </div>
                        
                        {viewMode !== 'list' && (
                          <div className="flex items-center text-xs text-slate-400 mt-3">
                            <Calendar className="w-3 h-3 mr-1" />
                            {cv.updated_date ? format(new Date(cv.updated_date), 'MMM d, yyyy') : 'Recently'}
                          </div>
                        )}
                      </div>
                      
                      {viewMode === 'list' && (
                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-xs text-slate-400 hidden sm:block">
                            {cv.updated_date ? format(new Date(cv.updated_date), 'MMM d, yyyy') : 'Recently'}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleBaseCVMutation.mutate(cv)}>
                                {cv.is_base_cv ? <StarOff className="w-4 h-4 mr-2" /> : <Star className="w-4 h-4 mr-2" />}
                                {cv.is_base_cv ? 'Remove as Master' : 'Set as Master'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => duplicateMutation.mutate(cv)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Export PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => setDeleteId(cv.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this CV?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your CV and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDelete(deleteId)}
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