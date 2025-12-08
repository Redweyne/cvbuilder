import React from 'react';
import { Link } from 'react-router-dom';
import { DesignProvider } from '@/context/DesignContext';
import Canvas from '@/components/designer/Canvas';
import Toolbar from '@/components/designer/Toolbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Download, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function DesignerContent() {
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
              <p className="text-xs text-slate-500">Untitled Design</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="opacity-50">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button size="sm" disabled className="opacity-50 bg-gradient-to-r from-indigo-600 to-violet-600">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </header>

      <Toolbar />

      <div className="flex-1 flex overflow-hidden">
        <Canvas />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm shadow-xl flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Click elements to select, drag to move. Use toolbar to add new elements.
      </motion.div>
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
