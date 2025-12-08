import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DesignProvider, useDesign, A4_WIDTH_PX, A4_HEIGHT_PX } from '@/context/DesignContext';
import Canvas from '@/components/designer/Canvas';
import Toolbar from '@/components/designer/Toolbar';
import TemplatesSidebar from '@/components/designer/TemplatesSidebar';
import PropertiesPanel from '@/components/designer/PropertiesPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Download, Sparkles, Loader2, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

function DesignerContent() {
  const { documentName, setDocumentName, elements, clearCanvas } = useDesign();
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(documentName);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const designData = {
        name: documentName,
        elements: elements,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('cvforge_design_' + documentName, JSON.stringify(designData));
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
      toast.success('Design saved successfully!');
    } catch (error) {
      toast.error('Failed to save design');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const canvas = document.getElementById('cv-canvas');
      if (!canvas) {
        throw new Error('Canvas not found');
      }

      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      const scale = 2;
      const canvasImage = await html2canvas(canvas, {
        scale: scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvasImage.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${documentName || 'cv-design'}.pdf`);

      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNameSubmit = () => {
    setDocumentName(tempName || 'Untitled Design');
    setIsEditingName(false);
  };

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
      clearCanvas();
      toast.success('Canvas cleared');
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">CV Designer</h1>
              {isEditingName ? (
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleNameSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                  className="h-5 text-xs py-0 px-1 w-32"
                  autoFocus
                />
              ) : (
                <p 
                  className="text-xs text-slate-500 cursor-pointer hover:text-slate-700"
                  onClick={() => {
                    setTempName(documentName);
                    setIsEditingName(true);
                  }}
                >
                  {documentName}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClearCanvas}
            className="text-slate-500 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
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
          <Button 
            size="sm" 
            onClick={handleExportPDF}
            disabled={isExporting || elements.length === 0}
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
        <Canvas />
        <PropertiesPanel />
      </div>

      <AnimatePresence>
        {elements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm shadow-xl flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Start by selecting a template or adding elements from the left panel
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {elements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white px-3 py-1.5 rounded-full text-xs shadow-xl flex items-center gap-2"
          >
            <span className="text-slate-400">Double-click text to edit</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Drag corners to resize</span>
          </motion.div>
        )}
      </AnimatePresence>
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
