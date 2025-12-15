import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DesignProvider, useDesign } from '@/context/DesignContext';
import Canvas from '@/components/designer/Canvas';
import Toolbar from '@/components/designer/Toolbar';
import PropertiesPanel from '@/components/designer/PropertiesPanel';
import TemplatePreview from '@/components/designer/TemplatePreview';
import PageNavigator from '@/components/designer/PageNavigator';
import PageSettings from '@/components/designer/PageSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Save, Loader2, Check, Sparkles, Crown, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { CV_TEMPLATES, getTemplateById } from '@/data/cvTemplates';

const DISPLAY_TEMPLATES = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and modern design perfect for corporate roles',
    color: '#4F46E5',
    isPremium: false,
    atsScore: 95
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with focus on content',
    color: '#1F2937',
    isPremium: false,
    atsScore: 98
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with unique layouts and colors',
    color: '#EC4899',
    isPremium: true,
    atsScore: 85
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior positions',
    color: '#0F172A',
    isPremium: true,
    atsScore: 94
  },
  {
    id: 'tech',
    name: 'Tech Modern',
    description: 'Perfect for developers and IT professionals',
    color: '#059669',
    isPremium: false,
    atsScore: 96
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Ideal for research and academic positions',
    color: '#7C3AED',
    isPremium: false,
    atsScore: 92
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Showcase your creativity with this bold template',
    color: '#F59E0B',
    isPremium: true,
    atsScore: 80
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Fit more content in a single page',
    color: '#6366F1',
    isPremium: false,
    atsScore: 97
  }
];

function DesignerContent() {
  const [searchParams] = useSearchParams();
  const { elements, documentName, setDocumentName, loadTemplate, clearCanvas, A4_WIDTH_PX, A4_HEIGHT_PX } = useDesign();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [showTemplates, setShowTemplates] = useState(true);

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId && !templateLoaded) {
      handleLoadTemplate(templateId);
      setTemplateLoaded(true);
    } else if (!templateLoaded && !templateId) {
      handleLoadTemplate('professional');
      setTemplateLoaded(true);
    }
  }, [searchParams, templateLoaded]);

  const handleLoadTemplate = (templateId) => {
    const template = getTemplateById(templateId);
    if (template && loadTemplate) {
      clearCanvas();
      setTimeout(() => {
        loadTemplate(template.elements);
        setDocumentName(template.name + ' CV');
        setSelectedTemplateId(templateId);
        toast.success(`${template.name} template loaded! Customize it freely.`);
      }, 50);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: documentName,
          elements: elements,
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX
        })
      });
      
      if (response.ok) {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
        toast.success('Design saved!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save design');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/design-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          elements: elements,
          name: documentName,
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${documentName || 'cv-design'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        toast.success('PDF exported!');
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/Dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <Input
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="h-7 w-48 text-sm font-medium border-transparent hover:border-slate-300 focus:border-indigo-500"
                placeholder="Untitled Design"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PageSettings 
            trigger={
              <Button variant="ghost" size="icon" className="h-9 w-9" title="Page Settings">
                <Settings2 className="w-4 h-4" />
              </Button>
            }
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : showSaved ? (
              <Check className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {showSaved ? 'Saved!' : 'Save'}
          </Button>
          <Button 
            size="sm" 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </header>

      <Toolbar />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-52 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <button 
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center justify-between px-4 py-3 border-b border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-medium text-slate-700">Templates</span>
            {showTemplates ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>
          
          {showTemplates && (
            <div className="flex-1 overflow-y-auto p-2 space-y-3">
              {DISPLAY_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.id)}
                  className={`w-full rounded-lg text-left transition-all overflow-hidden ${
                    selectedTemplateId === template.id
                      ? 'ring-2 ring-indigo-500'
                      : 'hover:ring-2 hover:ring-slate-300'
                  }`}
                >
                  <div className="w-full">
                    <TemplatePreview 
                      templateId={template.id} 
                      scale={0.22}
                      showShadow={false}
                      className="w-full"
                    />
                  </div>
                  <div className="p-2 bg-white border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-medium text-slate-900">{template.name}</p>
                        {template.isPremium && (
                          <Crown className="w-3 h-3 text-amber-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-10 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${template.atsScore}%`,
                              backgroundColor: template.atsScore >= 95 ? '#22c55e' : template.atsScore >= 90 ? '#84cc16' : '#eab308'
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">{template.atsScore}%</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {!showTemplates && (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Click to show templates
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <Canvas />
          </div>
          <PageNavigator />
        </div>
        
        <PropertiesPanel />
      </div>
    </div>
  );
}

export default function CVDesigner() {
  return (
    <DesignProvider>
      <DesignerContent />
    </DesignProvider>
  );
}
