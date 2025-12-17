import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DesignProvider, useDesign } from '@/context/DesignContext';
import Canvas from '@/components/designer/Canvas';
import Toolbar from '@/components/designer/Toolbar';
import PropertiesPanel from '@/components/designer/PropertiesPanel';
import LayersPanel from '@/components/designer/LayersPanel';
import TemplatePreview from '@/components/designer/TemplatePreview';
import PageNavigator from '@/components/designer/PageNavigator';
import PageSettings from '@/components/designer/PageSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Save, Loader2, Check, Sparkles, Crown, ChevronDown, ChevronUp, Settings2, FileText, Image, FileImage, Eye, Layers, X, PanelRightClose, PanelRight } from 'lucide-react';
import PrintPreview from '@/components/designer/PrintPreview';
import { AnimatePresence, motion } from 'framer-motion';
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

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showProperties, setShowProperties] = useState(true);

  const handleExport = async (format = 'pdf', quality = 'high') => {
    setIsExporting(true);
    setShowExportMenu(false);
    
    const dpi = quality === 'high' ? 3 : quality === 'medium' ? 2 : 1;
    
    try {
      const endpoint = format === 'pdf' ? '/api/export/design-pdf' : '/api/export/design-image';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          elements: elements,
          name: documentName,
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          format: format,
          dpi: dpi,
          quality: 90
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = format === 'pdf' ? 'pdf' : format === 'jpeg' ? 'jpg' : 'png';
        a.download = `${documentName || 'cv-design'}.${ext}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        toast.success(`${format.toUpperCase()} exported!`);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
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
            variant="ghost"
            size="sm"
            onClick={() => setShowPrintPreview(true)}
            title="Print Preview"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
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
          <div className="relative">
            <Button 
              size="sm" 
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export'}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <button
                  onClick={() => handleExport('pdf', 'high')}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  <div>
                    <div className="font-medium">PDF (High Quality)</div>
                    <div className="text-xs text-slate-400">Best for printing</div>
                  </div>
                </button>
                <button
                  onClick={() => handleExport('png', 'high')}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <Image className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-medium">PNG Image</div>
                    <div className="text-xs text-slate-400">Transparent background</div>
                  </div>
                </button>
                <button
                  onClick={() => handleExport('jpeg', 'high')}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileImage className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="font-medium">JPEG Image</div>
                    <div className="text-xs text-slate-400">Smaller file size</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Toolbar />

      <div className="flex-1 flex overflow-hidden bg-slate-200">
        {/* Left Sidebar - Templates */}
        <div className="w-48 bg-white/95 backdrop-blur-sm border-r border-slate-200 flex flex-col overflow-hidden shadow-sm">
          <button 
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Templates</span>
            {showTemplates ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
          
          {showTemplates && (
            <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
              {DISPLAY_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.id)}
                  className={`w-full rounded-lg text-left transition-all overflow-hidden ${
                    selectedTemplateId === template.id
                      ? 'ring-2 ring-indigo-500 bg-indigo-50 shadow-sm'
                      : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 p-1.5">
                    <div className="shrink-0 rounded border border-slate-200 overflow-hidden bg-white shadow-sm">
                      <TemplatePreview 
                        templateId={template.id} 
                        scale={0.055}
                        showShadow={false}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-[11px] font-medium text-slate-700 truncate">{template.name}</p>
                        {template.isPremium && (
                          <Crown className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[9px] text-slate-400">ATS {template.atsScore}%</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {!showTemplates && (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-4 text-center">
              Click above to browse templates
            </div>
          )}
        </div>
        
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
            <Canvas />
          </div>
          <PageNavigator />
          
          {/* Floating Layers Toggle Button */}
          <button
            onClick={() => setShowLayers(!showLayers)}
            className={`absolute top-4 right-4 p-2 rounded-lg shadow-lg transition-all ${
              showLayers 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white/95 backdrop-blur-sm text-slate-600 hover:bg-white hover:text-indigo-600'
            }`}
            title="Toggle Layers Panel"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
        
        {/* Right Side - Properties Panel (conditionally show layers overlay) */}
        <AnimatePresence>
          {showLayers && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-56 top-[104px] bottom-12 w-52 bg-white/98 backdrop-blur-sm shadow-xl rounded-l-xl border-l border-y border-slate-200 z-40 overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Layers</span>
                </div>
                <button
                  onClick={() => setShowLayers(false)}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100% - 40px)' }}>
                <LayersPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Properties Panel */}
        <div className="w-56 bg-white/98 backdrop-blur-sm border-l border-slate-200 shadow-sm overflow-hidden">
          <PropertiesPanel />
        </div>
      </div>

      {showPrintPreview && (
        <PrintPreview 
          onClose={() => setShowPrintPreview(false)}
          onExport={() => {
            setShowPrintPreview(false);
            handleExport('pdf', 'high');
          }}
        />
      )}
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
