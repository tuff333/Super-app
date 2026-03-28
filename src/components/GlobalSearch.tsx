import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Zap, Sparkles, ArrowRight, Settings, Calendar, Lock, FileText, Globe, Cpu, Target, Plane, Wallet, Calculator, BookOpen, FileBox } from 'lucide-react';
import { cn } from '../lib/utils';
import { AppModule } from '../types';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'app' | 'setting' | 'content' | 'action';
  moduleId: AppModule;
  icon: any;
  action?: () => void;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (moduleId: AppModule) => void;
  darkMode: boolean;
}

export default function GlobalSearch({ isOpen, onClose, onNavigate, darkMode }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const apps: SearchResult[] = [
    { id: 'dashboard', title: 'Dashboard', description: 'Overview of your digital life', type: 'app', moduleId: 'dashboard', icon: Sparkles },
    { id: 'nirnay', title: 'Nirnay Calendar', description: 'Gujarati Panchang & Hindu Calendar', type: 'app', moduleId: 'nirnay', icon: Calendar },
    { id: 'vault', title: 'SecureVault', description: 'Password manager & secure storage', type: 'app', moduleId: 'vault', icon: Lock },
    { id: 'office', title: 'OfficeHub', description: 'Documents, Sheets & Slides', type: 'app', moduleId: 'office', icon: FileText },
    { id: 'browser', title: 'PureBrowse', description: 'Ad-free private browsing', type: 'app', moduleId: 'browser', icon: Globe },
    { id: 'nexus', title: 'AI Nexus', description: 'Your personal AI assistant', type: 'app', moduleId: 'nexus', icon: Cpu },
    { id: 'crm', title: 'CRM Hub', description: 'Manage contacts & sales pipeline', type: 'app', moduleId: 'crm', icon: Target },
    { id: 'globetrot', title: 'GlobeTrot', description: 'World clock & travel tools', type: 'app', moduleId: 'globetrot', icon: Plane },
    { id: 'budgeted', title: 'Budgeted', description: 'Expense tracking & subscriptions', type: 'app', moduleId: 'budgeted', icon: Wallet },
    { id: 'calculator', title: 'Calculator', description: 'Standard & scientific calculator', type: 'app', moduleId: 'calculator', icon: Calculator },
    { id: 'spiritual', title: 'Spiritual Hub', description: 'Vachanamrut & Swamini Vato', type: 'app', moduleId: 'spiritual', icon: BookOpen },
    { id: 'pdf', title: 'PDF Tools', description: 'OCR, Annotate & Convert PDFs', type: 'app', moduleId: 'pdf', icon: FileBox },
    { id: 'settings', title: 'Settings', description: 'System preferences & language', type: 'app', moduleId: 'settings', icon: Settings },
  ];

  const settings: SearchResult[] = [
    { id: 'set-dark', title: 'Dark Mode', description: 'Switch to dark theme', type: 'setting', moduleId: 'settings', icon: Settings },
    { id: 'set-lang', title: 'Language', description: 'Change system language', type: 'setting', moduleId: 'settings', icon: Settings },
    { id: 'set-security', title: 'Security', description: 'Vault & PIN settings', type: 'setting', moduleId: 'settings', icon: Lock },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults(apps.slice(0, 5));
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filteredApps = apps.filter(app => 
      app.title.toLowerCase().includes(lowerQuery) || 
      app.description.toLowerCase().includes(lowerQuery)
    );

    const filteredSettings = settings.filter(set => 
      set.title.toLowerCase().includes(lowerQuery) || 
      set.description.toLowerCase().includes(lowerQuery)
    );

    setResults([...filteredApps, ...filteredSettings]);
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (result: SearchResult) => {
    onNavigate(result.moduleId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={cn(
              "w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-slate-200 dark:border-slate-800",
              darkMode ? "dark" : ""
            )}
            onKeyDown={handleKeyDown}
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <Search className="text-indigo-500" size={24} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search apps, settings, or content..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-bold text-slate-900 dark:text-white placeholder-slate-400"
              />
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 scrollbar-hide">
              {results.length > 0 ? (
                <div className="space-y-2">
                  <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {query ? 'Search Results' : 'Suggested Apps'}
                  </p>
                  {results.map((result, i) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left group",
                        selectedIndex === i 
                          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                          : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl transition-colors",
                        selectedIndex === i ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800 text-indigo-500"
                      )}>
                        <result.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-black text-lg tracking-tight",
                          selectedIndex === i ? "text-white" : "text-slate-900 dark:text-white"
                        )}>
                          {result.title}
                        </h4>
                        <p className={cn(
                          "text-xs font-medium",
                          selectedIndex === i ? "text-indigo-100" : "text-slate-400"
                        )}>
                          {result.description}
                        </p>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        selectedIndex === i ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      )}>
                        {result.type}
                      </div>
                      <ArrowRight 
                        size={20} 
                        className={cn(
                          "transition-transform",
                          selectedIndex === i ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                        )} 
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No results found</h3>
                  <p className="text-slate-400 font-medium">Try searching for something else or browse the dashboard.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-500 shadow-sm">↑↓</kbd>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-500 shadow-sm">Enter</kbd>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-500 shadow-sm">Esc</kbd>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Close</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-indigo-500">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Powered Search</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
