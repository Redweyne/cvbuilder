import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  GripVertical,
  GraduationCap
} from 'lucide-react';

export default function EducationForm({ data = [], onChange }) {
  const [expandedId, setExpandedId] = useState(null);

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      field: '',
      institution: '',
      location: '',
      graduation_date: '',
      gpa: '',
      achievements: []
    };
    onChange([...data, newEdu]);
    setExpandedId(newEdu.id);
  };

  const updateEducation = (id, field, value) => {
    onChange(data.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  const addAchievement = (eduId) => {
    onChange(data.map(edu => 
      edu.id === eduId 
        ? { ...edu, achievements: [...(edu.achievements || []), ''] }
        : edu
    ));
  };

  const updateAchievement = (eduId, index, value) => {
    onChange(data.map(edu => 
      edu.id === eduId 
        ? { 
            ...edu, 
            achievements: edu.achievements.map((a, i) => i === index ? value : a) 
          }
        : edu
    ));
  };

  const removeAchievement = (eduId, index) => {
    onChange(data.map(edu => 
      edu.id === eduId 
        ? { ...edu, achievements: edu.achievements.filter((_, i) => i !== index) }
        : edu
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Education</h3>
          <p className="text-sm text-slate-500 mt-1">Add your academic background</p>
        </div>
        <Button onClick={addEducation} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h4 className="font-medium text-slate-900 mb-2">No education added</h4>
          <p className="text-sm text-slate-500 mb-4">Add your academic qualifications</p>
          <Button onClick={addEducation}>
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {data.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className={`border ${expandedId === edu.id ? 'border-indigo-200 shadow-md' : 'border-slate-200'}`}>
                  <CardContent className="p-4">
                    {/* Header */}
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
                    >
                      <GripVertical className="w-4 h-4 text-slate-300" />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">
                          {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {edu.institution || 'Institution'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEducation(edu.id);
                        }}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {expandedId === edu.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedId === edu.id && (
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
                                <Label>Degree</Label>
                                <Input
                                  value={edu.degree || ''}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                  placeholder="Bachelor of Science"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Field of Study</Label>
                                <Input
                                  value={edu.field || ''}
                                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                  placeholder="Computer Science"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Institution</Label>
                                <Input
                                  value={edu.institution || ''}
                                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                  placeholder="Stanford University"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                  value={edu.location || ''}
                                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                  placeholder="Stanford, CA"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Graduation Date</Label>
                                <Input
                                  type="month"
                                  value={edu.graduation_date || ''}
                                  onChange={(e) => updateEducation(edu.id, 'graduation_date', e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>GPA (Optional)</Label>
                                <Input
                                  value={edu.gpa || ''}
                                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                  placeholder="3.8/4.0"
                                />
                              </div>
                            </div>

                            {/* Achievements */}
                            <div className="space-y-3">
                              <Label>Achievements & Activities (Optional)</Label>
                              
                              {(edu.achievements || []).map((achievement, aIndex) => (
                                <div key={aIndex} className="flex gap-2">
                                  <span className="text-slate-400 mt-2.5">•</span>
                                  <Input
                                    value={achievement}
                                    onChange={(e) => updateAchievement(edu.id, aIndex, e.target.value)}
                                    placeholder="Dean's List, Cum Laude, etc."
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeAchievement(edu.id, aIndex)}
                                    className="text-slate-400 hover:text-red-500"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addAchievement(edu.id)}
                                className="w-full border-dashed"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Achievement
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