import React, { useState, useRef } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  File as FileIcon, 
  Search, 
  Plus, 
  MoreVertical, 
  Clock, 
  Star, 
  Cloud,
  HardDrive,
  FolderOpen,
  LayoutGrid,
  List as ListIcon,
  Scan,
  User,
  Shield,
  Type,
  Image as ImageIcon,
  FileCode,
  ArrowRightLeft,
  Trash2,
  Lock,
  Unlock,
  Layers,
  Zap,
  Download,
  Share2,
  ChevronLeft,
  CheckCircle2,
  Folder,
  Eye,
  Sparkles,
  Mail,
  Highlighter,
  Pencil,
  StickyNote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

type Tab = 'explorer' | 'pdf-tools' | 'shared' | 'ai-tools';

export default function OfficeHub() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<Tab>('explorer');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [hoveredFile, setHoveredFile] = useState<number | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [emailPrompt, setEmailPrompt] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);

  const [files, setFiles] = useState([
    { id: 1, name: 'Financial Report Q1.xlsx', type: 'excel', size: '2.4 MB', modified: '2 hours ago', starred: true, content: 'Q1 Revenue: $1.2M, Expenses: $800K, Net Profit: $400K. Growth: 15% YoY.' },
    { id: 2, name: 'Project Proposal.docx', type: 'word', size: '1.1 MB', modified: 'Yesterday', starred: false, content: 'Project Phoenix aims to revitalize our core infrastructure using cloud-native technologies and AI-driven automation.' },
    { id: 3, name: 'Marketing Strategy.pptx', type: 'powerpoint', size: '15.8 MB', modified: '3 days ago', starred: true, content: 'Focus on social media engagement, influencer partnerships, and targeted email campaigns for the summer launch.' },
    { id: 4, name: 'Invoice_2024_001.pdf', type: 'pdf', size: '450 KB', modified: '1 week ago', starred: false, content: 'Invoice #2024-001. Amount Due: $1,500.00. Due Date: April 15, 2024. Service: Web Development.' },
    { id: 5, name: 'Meeting Notes.txt', type: 'text', size: '12 KB', modified: '2 weeks ago', starred: false, content: 'Action Items: 1. Update roadmap. 2. Schedule sync with engineering. 3. Review budget with finance.' },
  ]);

  const [folders, setFolders] = useState([
    { id: 101, name: 'Reports', color: 'text-blue-500' },
    { id: 102, name: 'Archive', color: 'text-slate-500' },
    { id: 103, name: 'Templates', color: 'text-emerald-500' },
  ]);

  const pdfTools = [
    { name: 'Annotate PDF', icon: Pencil, description: 'Add text, highlights, and drawings', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'OCR PDF', icon: Type, description: 'Convert scanned PDF to searchable text', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Redact', icon: Shield, description: 'Permanently remove sensitive info', color: 'bg-rose-50 text-rose-600' },
    { name: 'Convert to Word', icon: FileText, description: 'PDF to editable DOCX', color: 'bg-blue-50 text-blue-600' },
    { name: 'Convert to PPT', icon: Presentation, description: 'PDF to PowerPoint slides', color: 'bg-orange-50 text-orange-600' },
    { name: 'PDF to Image', icon: ImageIcon, description: 'Extract pages as JPG/PNG', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Merge PDF', icon: Layers, description: 'Combine multiple PDFs into one', color: 'bg-purple-50 text-purple-600' },
    { name: 'Compress', icon: Zap, description: 'Reduce file size without losing quality', color: 'bg-amber-50 text-amber-600' },
  ];

  const generateSummary = async (fileContent: string) => {
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize the following document content in 3 concise bullet points:\n\n${fileContent}`,
      });
      setSummary(response.text);
    } catch (error) {
      console.error("AI Summary Error:", error);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const generateEmailDraft = async () => {
    if (!emailPrompt) return;
    setIsGeneratingEmail(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Draft a professional email based on this prompt: "${emailPrompt}". Keep it concise and polite.`,
      });
      setEmailDraft(response.text);
    } catch (error) {
      console.error("AI Email Error:", error);
      setEmailDraft("Failed to generate draft.");
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, fileId: number) => {
    e.dataTransfer.setData('fileId', fileId.toString());
  };

  const handleDrop = (e: React.DragEvent, folderId: number) => {
    e.preventDefault();
    const fileId = parseInt(e.dataTransfer.getData('fileId'));
    console.log(`Moving file ${fileId} to folder ${folderId}`);
    // In a real app, update state to reflect folder structure
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'word': return <FileText className="text-blue-600" size={24} />;
      case 'excel': return <FileSpreadsheet className="text-emerald-600" size={24} />;
      case 'powerpoint': return <Presentation className="text-orange-600" size={24} />;
      case 'pdf': return <FileIcon className="text-rose-600" size={24} />;
      default: return <FileIcon className="text-slate-400" size={24} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0 space-y-8">
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
            <Plus size={20} />
            New Document
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <Scan size={20} />
            Scan Document
          </button>
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Library</p>
          {[
            { id: 'explorer', name: 'Recent', icon: Clock },
            { id: 'pdf-tools', name: 'PDF Tools', icon: FileIcon },
            { id: 'ai-tools', name: 'AI Tools', icon: Sparkles },
            { id: 'shared', name: 'Shared', icon: User },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-bold",
                activeTab === item.id ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Storage</p>
          {[
            { name: 'Google Drive', icon: Cloud },
            { name: 'OneDrive', icon: Cloud },
            { name: 'Local NAS', icon: HardDrive },
          ].map((item) => (
            <button key={item.name} className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-sm font-bold">
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'explorer' && (
            <motion.div 
              key="explorer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col h-full"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search documents..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 font-medium dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600" : "text-slate-400")}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600" : "text-slate-400")}
                  >
                    <ListIcon size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                {/* Folders Section */}
                <div className="mb-8">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Folders</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {folders.map((folder) => (
                      <div 
                        key={folder.id}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, folder.id)}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl flex flex-col items-center gap-2 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 transition-all cursor-pointer group"
                      >
                        <Folder className={cn("w-10 h-10 transition-transform group-hover:scale-110", folder.color)} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{folder.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Recent Files</h4>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {files.map((file, i) => (
                      <motion.div 
                        key={i} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, file.id)}
                        whileHover={{ y: -5 }}
                        onMouseEnter={() => setHoveredFile(file.id)}
                        onMouseLeave={() => setHoveredFile(null)}
                        className="group p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer relative"
                      >
                        <div className="aspect-[4/3] rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          {getIcon(file.type)}
                          
                          {/* Preview Overlay */}
                          <AnimatePresence>
                            {hoveredFile === file.id && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 p-4 flex flex-col justify-center items-center text-center backdrop-blur-sm"
                              >
                                <Eye size={20} className="text-emerald-500 mb-2" />
                                <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300 line-clamp-4 italic">
                                  "{file.content}"
                                </p>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    generateSummary(file.content);
                                  }}
                                  className="mt-3 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-colors"
                                >
                                  Summarize
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-slate-800 dark:text-slate-200 truncate text-sm">{file.name}</h5>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{file.size} • {file.modified}</p>
                          </div>
                          <button className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-400 p-1">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.map((file, i) => (
                      <div 
                        key={i} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, file.id)}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                            {getIcon(file.type)}
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{file.name}</h5>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{file.size} • {file.modified}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              generateSummary(file.content);
                            }}
                            className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                            title="AI Summary"
                          >
                            <Sparkles size={16} />
                          </button>
                          {file.starred && <Star size={16} className="text-amber-400 fill-amber-400" />}
                          <button className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-400">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'pdf-tools' && (
            <motion.div 
              key="pdf-tools"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col h-full p-8"
            >
              {!selectedTool ? (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">PDF Power Tools</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Advanced redaction, OCR, and conversion suite</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {pdfTools.map((tool, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedTool(tool.name)}
                        className="flex flex-col items-start p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-xl hover:shadow-indigo-900/5 transition-all text-left group"
                      >
                        <div className={cn("p-3 rounded-2xl mb-4 transition-transform group-hover:scale-110", tool.color)}>
                          <tool.icon size={24} />
                        </div>
                        <h5 className="font-bold text-slate-900 dark:text-white mb-1">{tool.name}</h5>
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{tool.description}</p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-12 p-8 bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] text-white relative overflow-hidden group">
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="max-w-md">
                        <h4 className="text-2xl font-black mb-2">Batch Processing</h4>
                        <p className="text-slate-400 text-sm font-medium">Drop multiple files here to apply redaction or OCR to all of them at once. Secure, local, and fast.</p>
                      </div>
                      <div className="w-full md:w-auto">
                        <button className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-3">
                          <Zap size={20} />
                          Start Batch Job
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-8">
                    <button 
                      onClick={() => {
                        setSelectedTool(null);
                        setIsAnnotating(false);
                      }}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{selectedTool}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {pdfTools.find(t => t.name === selectedTool)?.description || 'Configure and run your PDF task'}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      {selectedTool === 'Annotate PDF' ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-[2rem] p-8 flex flex-col h-full min-h-[500px]">
                          <div className="flex items-center gap-4 mb-6 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-indigo-600"><Pencil size={20} /></button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-amber-500"><Highlighter size={20} /></button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-blue-500"><Type size={20} /></button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-emerald-500"><StickyNote size={20} /></button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                            <div className="flex gap-2">
                              {['bg-rose-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-amber-500'].map(c => (
                                <button key={c} className={cn("w-5 h-5 rounded-full", c)}></button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-inner flex items-center justify-center text-slate-300 relative overflow-hidden">
                            <p className="text-sm font-bold uppercase tracking-widest opacity-20">PDF Canvas Preview</p>
                            {/* Mock annotation layer */}
                            <div className="absolute top-20 left-20 p-3 bg-amber-100/50 border-l-4 border-amber-500 text-amber-900 text-xs font-medium rotate-3">
                              Important: Review Q1 figures
                            </div>
                            <div className="absolute bottom-40 right-40 w-32 h-32 border-2 border-rose-500/30 rounded-full"></div>
                          </div>

                          <div className="mt-6 flex justify-end gap-3">
                            <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Save Annotations</button>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center group hover:border-indigo-400 transition-colors cursor-pointer">
                          <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition-transform">
                            <Plus size={32} />
                          </div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Drop your PDF here</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">or click to browse your files</p>
                        </div>
                      )}

                      {!isAnnotating && selectedTool !== 'Annotate PDF' && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 space-y-4">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">Advanced Settings</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Language</label>
                              <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium p-3 dark:text-white">
                                <option>English (US)</option>
                                <option>Gujarati</option>
                                <option>Hindi</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Output Format</label>
                              <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium p-3 dark:text-white">
                                <option>Searchable PDF</option>
                                <option>Plain Text</option>
                                <option>JSON Data</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-600/20">
                        <h4 className="font-bold mb-4">Task Summary</h4>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="opacity-60">Tool</span>
                            <span className="font-bold">{selectedTool}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="opacity-60">Status</span>
                            <span className="font-bold">Ready</span>
                          </div>
                        </div>
                        <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black shadow-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                          <Zap size={18} />
                          Process File
                        </button>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Recent Activity</h4>
                        <div className="space-y-4">
                          {[1, 2].map(i => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center text-emerald-500">
                                <CheckCircle2 size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">document_{i}.pdf</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Success • 2m ago</p>
                              </div>
                              <button className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <Download size={14} className="text-slate-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'ai-tools' && (
            <motion.div 
              key="ai-tools"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col h-full p-8"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AI Office Assistant</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Smart compose, document analysis, and automated workflows</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Smart Compose */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white">Smart Email Draft</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI-Powered Composition</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <textarea 
                      value={emailPrompt}
                      onChange={(e) => setEmailPrompt(e.target.value)}
                      placeholder="e.g. Write a polite email to John asking for the Q1 report by Friday..."
                      className="w-full h-32 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 dark:text-white resize-none"
                    />
                    <button 
                      onClick={generateEmailDraft}
                      disabled={isGeneratingEmail || !emailPrompt}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isGeneratingEmail ? <Sparkles className="animate-spin" size={18} /> : <Zap size={18} />}
                      {isGeneratingEmail ? 'Drafting...' : 'Generate Draft'}
                    </button>
                  </div>

                  {emailDraft && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl relative group"
                    >
                      <button className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download size={14} className="text-indigo-600" />
                      </button>
                      <pre className="text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                        {emailDraft}
                      </pre>
                    </motion.div>
                  )}
                </div>

                {/* Document Analysis */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                      <FileCode size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white">Document Analyzer</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Insights & Summaries</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Document</p>
                      <div className="space-y-2">
                        {files.slice(0, 3).map(file => (
                          <button 
                            key={file.id}
                            onClick={() => generateSummary(file.content)}
                            className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              {getIcon(file.type)}
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{file.name}</span>
                            </div>
                            <ArrowRightLeft size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {summary && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl"
                    >
                      <h5 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles size={12} />
                        AI Summary
                      </h5>
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {summary.split('\n').map((line, i) => (
                          <p key={i} className="mb-1">{line}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {isSummarizing && (
                    <div className="p-12 text-center">
                      <Sparkles className="animate-spin mx-auto text-emerald-500 mb-2" size={32} />
                      <p className="text-sm font-bold text-slate-400">Analyzing document...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary Modal */}
      <AnimatePresence>
        {summary && activeTab !== 'ai-tools' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white">AI Summary</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Insights</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSummary(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                  >
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {summary}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black hover:bg-slate-200 transition-all">Copy Text</button>
                  <button 
                    onClick={() => setSummary(null)}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
