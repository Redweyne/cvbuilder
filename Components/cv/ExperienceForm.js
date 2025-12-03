import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  GripVertical,
  Briefcase,
  Wand2,
  Loader2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ExperienceForm({ data = [], onChange }) {
  const [expandedId, setExpandedId] = useState(null);
  const [enhancingId, setEnhancingId] = useState(null);

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      job_title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      bullet_points: ['']
    };
    onChange([...data, newExp]);
    setExpandedId(newExp.id);
  };

  const updateExperience = (id, field, value) => {
    onChange(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const addBulletPoint = (expId) => {
    onChange(data.map(exp => 
      exp.id === expId 
        ? { ...exp, bullet_points: [...(exp.bullet_points || []), ''] }
        : exp
    ));
  };

  const updateBulletPoint = (expId, index, value) => {
    onChange(data.map(exp => 
      exp.id === expId 
        ? { 
            ...exp, 
            bullet_points: exp.bullet_points.map((bp, i) => i === index ? value : bp) 
          }
        : exp
    ));
  };

  const removeBulletPoint = (expId, index) => {
    onChange(data.map(exp => 
      exp.id === expId 
        ? { ...exp, bullet_points: exp.bullet_points.filter((_, i) => i !== index) }
        : exp
    ));
  };

  const enhanceBulletPoints = async (expId) => {
    setEnhancingId(expId);
    const exp = data.find(e => e.id === expId);
    
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `
        Improve these bullet points for a ${exp.job_title} role at ${exp.company}. 
        Use strong action verbs and include quantifiable achievements where possible.
        Make them ATS-friendly and impactful.
        
        Current bullet points:
        ${exp.bullet_points.join('\n')}
        
        Return exactly the same number of improved bullet points.
      `,
      response_json_schema: {
        type: "object",
        properties: {
          bullet_points: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });
    
    if (response?.bullet_points) {
      updateExperience(expId, 'bullet_points', response.bullet_points);
    }
    
    setEnhancingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Work Experience</h3>
          <p className="text-sm text-slate-500 mt-1">Add your professional experience</p>
        </div>
        <Button onClick={addExperience} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h4 className="font-medium text-slate-900 mb-2">No experience added</h4>
          <p className="text-sm text-slate-500 mb-4">Add your work history to showcase your career</p>
          <Button onClick={addExperience}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {data.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className={`border ${expandedId === exp.id ? 'border-indigo-200 shadow-md' : 'border-slate-200'}`}>
                  <CardContent className="p-4">
                    {/* Header */}
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                    >
                      <GripVertical className="w-4 h-4 text-slate-300" />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">
                          {exp.job_title || 'Job Title'}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {exp.company || 'Company'} {exp.location && `• ${exp.location}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExperience(exp.id);
                        }}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {expandedId === exp.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedId === exp.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-slate-100 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input
                                  value={exp.job_title || ''}
                                  onChange={(e) => updateExperience(exp.id, 'job_title', e.target.value)}
                                  placeholder="Senior Software Engineer"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Company</Label>
                                <Input
                                  value={exp.company || ''}
                                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                  placeholder="Google"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                  value={exp.location || ''}
                                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                  placeholder="Mountain View, CA"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                  <Label>Start Date</Label>
                                  <Input
                                    type="month"
                                    value={exp.start_date || ''}
                                    onChange={(e) => updateExperience(exp.id, 'start_date', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>End Date</Label>
                                  <Input
                                    type="month"
                                    value={exp.end_date || ''}
                                    onChange={(e) => updateExperience(exp.id, 'end_date', e.target.value)}
                                    disabled={exp.is_current}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Switch
                                checked={exp.is_current || false}
                                onCheckedChange={(checked) => updateExperience(exp.id, 'is_current', checked)}
                              />
                              <Label className="text-sm text-slate-600">I currently work here</Label>
                            </div>

                            {/* Bullet Points */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Responsibilities & Achievements</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => enhanceBulletPoints(exp.id)}
                                  disabled={enhancingId === exp.id}
                                  className="text-indigo-600 hover:text-indigo-700"
                                >
                                  {enhancingId === exp.id ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                    <Wand2 className="w-4 h-4 mr-2" />
                                  )}
                                  Enhance with AI
                                </Button>
                              </div>
                              
                              {(exp.bullet_points || []).map((bp, bpIndex) => (
                                <div key={bpIndex} className="flex gap-2">
                                  <span className="text-slate-400 mt-2.5">•</span>
                                  <Textarea
                                    value={bp}
                                    onChange={(e) => updateBulletPoint(exp.id, bpIndex, e.target.value)}
                                    placeholder="Describe your achievement or responsibility..."
                                    className="flex-1 min-h-[60px] resize-none"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeBulletPoint(exp.id, bpIndex)}
                                    className="text-slate-400 hover:text-red-500 mt-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addBulletPoint(exp.id)}
                                className="w-full border-dashed"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Bullet Point
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}