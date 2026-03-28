import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileBox, Merge, SplitSquareHorizontal, FileImage, Lock, Unlock, FileText, UploadCloud, FileSignature } from 'lucide-react';
import { cn } from '../lib/utils';

type Tool = {
  id: string;
  name: string;
  desc: string;
  icon: any;
  color: string;
  bg: string;
};

export default function PDFTools() {
  const tools: Tool[] = [
    { id: 'merge', name: 'Merge PDF', desc: 'Combine multiple PDFs into one unified document.', icon: Merge, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' },
    { id: 'split', name: 'Split PDF', desc: 'Separate one page or a whole set for easy conversion.', icon: SplitSquareHorizontal, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { id: 'compress', name: 'Compress PDF', desc: 'Reduce file size while optimizing for maximal quality.', icon: FileBox, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { id: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Convert each PDF page into a JPG or extract all images.', icon: FileImage, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'protect', name: 'Protect PDF', desc: 'Encrypt your PDF with a password to prevent unauthorized access.', icon: Lock, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { id: 'unlock', name: 'Unlock PDF', desc: 'Remove PDF password security, giving you the freedom to use your PDFs.', icon: Unlock, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { id: 'word-to-pdf', name: 'Word to PDF', desc: 'Make DOC and DOCX files easy to read by converting them to PDF.', icon: FileText, color: 'text-cyan-600', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
    { id: 'sign', name: 'Sign PDF', desc: 'Add a signature to your PDF document.', icon: FileSignature, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ];

  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-8">
      <div className="text-center max-w-2xl mx-auto mt-8">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Every tool you need to work with PDFs in one place</h1>
        <p className="text-lg text-slate-500 font-medium">
          All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
        </p>
      </div>

      {activeTool ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 max-w-3xl mx-auto w-full"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl", activeTool.bg, activeTool.color)}>
                <activeTool.icon size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{activeTool.name}</h2>
                <p className="text-slate-500 font-medium">{activeTool.desc}</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTool(null)}
              className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              Back to Tools
            </button>
          </div>

          <div className="border-2 border-dashed border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/10 rounded-3xl p-16 flex flex-col items-center justify-center text-center hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/50 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-rose-200/50 dark:shadow-none">
              <UploadCloud size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Select PDF files</h3>
            <p className="text-slate-500 font-medium mb-8">or drop PDFs here</p>
            <button className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-700 transition-colors shadow-xl shadow-rose-600/20">
              Select PDF files
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              whileHover={{ y: -5 }}
              onClick={() => setActiveTool(tool)}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 text-left hover:shadow-xl hover:border-rose-200 dark:hover:border-rose-900/50 transition-all group"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", tool.bg, tool.color)}>
                <tool.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{tool.name}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
