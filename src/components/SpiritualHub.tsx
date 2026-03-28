import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Headphones, Search, Bookmark, ChevronRight, PlayCircle, Upload, Plus, X, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

type Tab = 'vachanamrut' | 'swaminivato' | 'my_documents';

interface UploadedDoc {
  id: string;
  title: string;
  type: 'pdf' | 'text' | 'audio';
  date: string;
  content?: string;
}

export default function SpiritualHub() {
  const [activeTab, setActiveTab] = useState<Tab>('vachanamrut');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [viewingDoc, setViewingDoc] = useState<UploadedDoc | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const vachanamruts = [
    { id: 'v1', section: 'Gadhada Pratham', number: 1, title: 'Nirvikalp Nischay', duration: '12:45', content: 'This is the text of Gadhada Pratham 1...' },
    { id: 'v2', section: 'Gadhada Pratham', number: 2, title: 'Bhagwanna Swarupno Nischay', duration: '08:30', content: 'This is the text of Gadhada Pratham 2...' },
    { id: 'v3', section: 'Gadhada Pratham', number: 3, title: 'Kalyanno Upay', duration: '15:20', content: 'This is the text of Gadhada Pratham 3...' },
  ];

  const swaminiVatos = [
    { id: 's1', chapter: 1, number: 1, title: 'Koti tap karine...', duration: '05:10', content: 'Koti tap karine je kalyan thavanu hoy...' },
    { id: 's2', chapter: 1, number: 2, title: 'Bhagwan bhajva ethi...', duration: '03:45', content: 'Bhagwan bhajva ethi moti koi vat nathi...' },
    { id: 's3', chapter: 1, number: 3, title: 'Kalyan to ek...', duration: '06:20', content: 'Kalyan to ek Bhagwanne ashire chhe...' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newDoc: UploadedDoc = {
          id: Math.random().toString(36).substr(2, 9),
          title: file.name,
          type: file.type.includes('audio') ? 'audio' : file.type.includes('pdf') ? 'pdf' : 'text',
          date: new Date().toLocaleDateString(),
          content: content
        };
        setUploadedDocs([...uploadedDocs, newDoc]);
      };
      
      if (file.type.includes('audio') || file.type.includes('pdf')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  const renderContent = () => {
    if (viewingDoc) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800"
        >
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{viewingDoc.title}</h2>
            <button onClick={() => setViewingDoc(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={24} className="text-slate-500" />
            </button>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {viewingDoc.type === 'audio' ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mb-4">
                  <Headphones size={48} />
                </div>
                {viewingDoc.content && viewingDoc.content.startsWith('data:audio') ? (
                  <audio controls src={viewingDoc.content} className="w-full max-w-md" />
                ) : (
                  <>
                    <p className="text-slate-500 font-medium">Audio Player Placeholder</p>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                  </>
                )}
              </div>
            ) : viewingDoc.type === 'pdf' ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-4">
                {viewingDoc.content && viewingDoc.content.startsWith('data:application/pdf') ? (
                  <iframe src={viewingDoc.content} className="w-full h-[600px] rounded-xl border border-slate-200 dark:border-slate-800" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center">
                      <FileText size={48} />
                    </div>
                    <p className="text-slate-500 font-medium">PDF Viewer Placeholder</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {viewingDoc.content}
              </p>
            )}
          </div>
        </motion.div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Daily Reading Card */}
          <div className="col-span-1 md:col-span-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-orange-200" />
              <span className="text-sm font-bold uppercase tracking-widest text-orange-200">Daily Reading</span>
            </div>
            <h2 className="text-2xl font-black mb-2">
              {activeTab === 'vachanamrut' ? 'Gadhada Pratham 1' : activeTab === 'swaminivato' ? 'Prakaran 1, Vato 1' : 'Your Latest Document'}
            </h2>
            <p className="text-orange-100 font-medium max-w-xl mb-6">
              Continue your daily spiritual journey. Listen to the audio or read the transcript.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setViewingDoc({ id: 'daily', title: 'Daily Audio', type: 'audio', date: '', content: 'Audio playing...' })}
                className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-50 transition-colors"
              >
                <PlayCircle size={20} />
                Play Audio
              </button>
              <button 
                onClick={() => setViewingDoc({ id: 'daily-text', title: 'Daily Reading', type: 'text', date: '', content: 'This is the daily reading text...' })}
                className="bg-orange-700/50 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors"
              >
                <BookOpen size={20} />
                Read Text
              </button>
            </div>
          </div>

          {/* List */}
          <div className="col-span-1 md:col-span-3 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white">
                {activeTab === 'my_documents' ? 'My Uploads' : 'Index'}
              </h3>
              {activeTab === 'my_documents' && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                >
                  <Upload size={16} />
                  Upload
                </button>
              )}
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeTab === 'my_documents' ? (
                uploadedDocs.length > 0 ? (
                  uploadedDocs.map((doc) => (
                    <div 
                      key={doc.id} 
                      onClick={() => setViewingDoc(doc)}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-4 cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center font-black">
                        {doc.type === 'audio' ? <Headphones size={20} /> : <FileText size={20} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-orange-600 transition-colors">
                          {doc.title}
                        </h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {doc.date} • {doc.type.toUpperCase()}
                        </p>
                      </div>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Upload size={24} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium mb-4">No documents uploaded yet</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors"
                    >
                      Upload First Document
                    </button>
                  </div>
                )
              ) : (
                (activeTab === 'vachanamrut' ? vachanamruts : swaminiVatos)
                  .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => setViewingDoc({ id: item.id, title: item.title, type: 'text', date: '', content: item.content })}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center font-black">
                      {item.number}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {'section' in item ? item.section : `Chapter ${item.chapter}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-400">{item.duration}</span>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col space-y-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.txt,.mp3,.wav"
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Spiritual Study</h1>
          <p className="text-slate-500 mt-1">Daily reading and audio</p>
        </div>
        <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => { setActiveTab('vachanamrut'); setViewingDoc(null); }}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'vachanamrut' ? "bg-white dark:bg-slate-700 text-orange-600 shadow-sm" : "text-slate-500")}
          >
            Vachanamrut
          </button>
          <button 
            onClick={() => { setActiveTab('swaminivato'); setViewingDoc(null); }}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'swaminivato' ? "bg-white dark:bg-slate-700 text-orange-600 shadow-sm" : "text-slate-500")}
          >
            Swamini Vato
          </button>
          <button 
            onClick={() => { setActiveTab('my_documents'); setViewingDoc(null); }}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'my_documents' ? "bg-white dark:bg-slate-700 text-orange-600 shadow-sm" : "text-slate-500")}
          >
            My Docs
          </button>
        </div>
      </div>

      {!viewingDoc && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === 'vachanamrut' ? 'Vachanamrut' : activeTab === 'swaminivato' ? 'Swamini Vato' : 'My Documents'}...`}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900 dark:text-white font-medium"
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}
