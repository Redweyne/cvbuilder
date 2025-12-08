import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DesignProvider, useDesign } from '@/context/DesignContext';
import Canvas from '@/components/designer/Canvas';
import Toolbar from '@/components/designer/Toolbar';
import PropertiesPanel from '@/components/designer/PropertiesPanel';
import TemplatesSidebar from '@/components/designer/TemplatesSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Save, Loader2, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

function DesignerContent() {
  const { elements, documentName, setDocumentName, A4_WIDTH_PX, A4_HEIGHT_PX } = useDesign();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

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
        <TemplatesSidebar />
        <div className="flex-1 overflow-auto">
          <Canvas />
        </div>
        <PropertiesPanel />
      </div>
    </div>
  );
}

export default function FreeformDesigner() {
  return (
    <DesignProvider>
      <DesignerContent />
    </DesignProvider>
  );
}
