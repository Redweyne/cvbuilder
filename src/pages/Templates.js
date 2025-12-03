import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  LayoutTemplate, 
  Check, 
  Crown,
  Sparkles,
  Eye,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const templates = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and modern design perfect for corporate roles',
    category: 'professional',
    preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop',
    color: '#4F46E5',
    isPremium: false,
    atsScore: 95,
    popular: true
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with focus on content',
    category: 'minimal',
    preview: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=500&fit=crop',
    color: '#1F2937',
    isPremium: false,
    atsScore: 98
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with unique layouts and colors',
    category: 'creative',
    preview: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=500&fit=crop',
    color: '#EC4899',
    isPremium: true,
    atsScore: 85
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior positions',
    category: 'professional',
    preview: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=500&fit=crop',
    color: '#0F172A',
    isPremium: true,
    atsScore: 94
  },
  {
    id: 'tech',
    name: 'Tech Modern',
    description: 'Perfect for developers and IT professionals',
    category: 'professional',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=500&fit=crop',
    color: '#059669',
    isPremium: false,
    atsScore: 96
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Ideal for research and academic positions',
    category: 'academic',
    preview: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=500&fit=crop',
    color: '#7C3AED',
    isPremium: false,
    atsScore: 92
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Showcase your creativity with this bold template',
    category: 'creative',
    preview: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=500&fit=crop',
    color: '#F59E0B',
    isPremium: true,
    atsScore: 80
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Fit more content in a single page',
    category: 'minimal',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    color: '#6366F1',
    isPremium: false,
    atsScore: 97
  }
];

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'professional', label: 'Professional' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'creative', label: 'Creative' },
  { id: 'academic', label: 'Academic' }
];

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Templates</h1>
        <p className="text-slate-600 mt-1">Choose from stunning, ATS-optimized CV templates</p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="bg-slate-100 p-1">
          {categories.map(cat => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.id}
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl ${
                selectedTemplate === template.id ? 'ring-2 ring-indigo-600 shadow-xl' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-0">
                {/* Preview Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img 
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {template.isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 border-0">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {template.popular && (
                      <Badge className="bg-indigo-600 border-0">
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  {/* ATS Score */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                      ATS: {template.atsScore}%
                    </Badge>
                  </div>
                  
                  {/* Selected Check */}
                  {selectedTemplate === template.id && (
                    <div className="absolute bottom-3 right-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                    <Link to={createPageUrl('CVEditor') + `?template=${template.id}`}>
                      <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Use This Template
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: template.color }}
                    />
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{template.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      {selectedTemplate && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-slate-200 p-4 shadow-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${templates.find(t => t.id === selectedTemplate)?.color}20` }}
              >
                <LayoutTemplate 
                  className="w-6 h-6"
                  style={{ color: templates.find(t => t.id === selectedTemplate)?.color }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {templates.find(t => t.id === selectedTemplate)?.name} Template
                </h3>
                <p className="text-sm text-slate-500">
                  {templates.find(t => t.id === selectedTemplate)?.isPremium ? 'Premium template' : 'Free template'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
              <Link to={createPageUrl('CVEditor') + `?template=${selectedTemplate}`}>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Create CV with this Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}