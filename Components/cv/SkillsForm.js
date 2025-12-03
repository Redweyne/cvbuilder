import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  X,
  Award,
  Wand2,
  Loader2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SkillsForm({ data = [], onChange }) {
  const [newCategory, setNewCategory] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addCategory = () => {
    if (!newCategory.trim()) return;
    onChange([...data, { category: newCategory, items: [] }]);
    setNewCategory('');
  };

  const removeCategory = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addSkill = (categoryIndex) => {
    if (!newSkill.trim()) return;
    const updated = [...data];
    updated[categoryIndex].items = [...(updated[categoryIndex].items || []), newSkill];
    onChange(updated);
    setNewSkill('');
  };

  const removeSkill = (categoryIndex, skillIndex) => {
    const updated = [...data];
    updated[categoryIndex].items = updated[categoryIndex].items.filter((_, i) => i !== skillIndex);
    onChange(updated);
  };

  const suggestSkills = async () => {
    setIsGenerating(true);
    
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `
        Suggest professional skill categories and skills for a CV.
        Include categories like: Technical Skills, Soft Skills, Tools & Technologies, Languages.
        Return 4-5 categories with 5-8 skills each.
      `,
      response_json_schema: {
        type: "object",
        properties: {
          categories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: { type: "string" },
                items: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    });
    
    if (response?.categories) {
      onChange(response.categories);
    }
    
    setIsGenerating(false);
  };

  const predefinedCategories = [
    'Technical Skills',
    'Programming Languages',
    'Tools & Software',
    'Soft Skills',
    'Languages',
    'Certifications'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
          <p className="text-sm text-slate-500 mt-1">Showcase your abilities and expertise</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={suggestSkills}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4 mr-2" />
          )}
          Suggest Skills
        </Button>
      </div>

      {/* Quick Add Categories */}
      <div className="flex flex-wrap gap-2">
        {predefinedCategories.filter(cat => !data.find(d => d.category === cat)).map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            onClick={() => onChange([...data, { category: cat, items: [] }])}
            className="text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            {cat}
          </Button>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h4 className="font-medium text-slate-900 mb-2">No skills added</h4>
          <p className="text-sm text-slate-500 mb-4">Add skill categories to showcase your expertise</p>
          <div className="flex items-center justify-center gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name..."
              className="max-w-xs"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <Button onClick={addCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {data.map((category, catIndex) => (
              <motion.div
                key={catIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900">{category.category}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCategory(catIndex)}
                        className="text-slate-400 hover:text-red-500 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(category.items || []).map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="secondary"
                          className="pl-3 pr-1 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(catIndex, skillIndex)}
                            className="ml-2 hover:bg-indigo-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Add Skill */}
                    {activeCategory === catIndex ? (
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add skill..."
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addSkill(catIndex);
                            }
                          }}
                          autoFocus
                        />
                        <Button 
                          size="sm" 
                          onClick={() => {
                            addSkill(catIndex);
                          }}
                        >
                          Add
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setActiveCategory(null);
                            setNewSkill('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveCategory(catIndex)}
                        className="border-dashed w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add New Category */}
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <Button onClick={addCategory} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}