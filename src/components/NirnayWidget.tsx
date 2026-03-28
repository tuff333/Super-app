import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  Plus, 
  Edit3, 
  Cloud, 
  Sun, 
  Users, 
  Heart,
  ArrowUpRight,
  Mic,
  MicOff,
  X,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { getPanchangForDate } from '../services/panchangService';
import { fetchWeather, DailyForecast, HourlyForecast, getWeatherIcon } from '../services/weatherService';
import { GoogleGenAI } from "@google/genai";
import { getLocalPanchangSummary } from '../services/localAiService';
import DrawingCanvas from './DrawingCanvas';

interface NirnayWidgetProps {
  onNavigate?: (module: string) => void;
}

export default function NirnayWidget({ onNavigate }: NirnayWidgetProps) {
  const [currentDate] = useState(new Date());
  const panchang = getPanchangForDate(currentDate);
  const [isFamilyMode, setIsFamilyMode] = useState(false);
  const [isTempleMode, setIsTempleMode] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [weather, setWeather] = useState<DailyForecast | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const savedLocations = localStorage.getItem('nirnay_locations');
    if (savedLocations) {
      const locations = JSON.parse(savedLocations);
      const active = locations.find((l: any) => l.enabled);
      if (active) {
        fetchWeather(active.lat, active.lng).then(data => {
          if (data.daily && data.daily.length > 0) {
            setWeather(data.daily[0]);
          }
        });
      }
    }
  }, []);

  const generateAiSummary = async () => {
    setIsGenerating(true);
    try {
      if (navigator.onLine && process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Provide a very short, 1-sentence spiritual summary for today's Gujarati Panchang: ${panchang.paksha} ${panchang.tithiNum}, Festival: ${panchang.festival || 'None'}. Make it inspiring.`,
        });
        setAiSummary(response.text || getLocalPanchangSummary(panchang));
      } else {
        setAiSummary(getLocalPanchangSummary(panchang));
      }
    } catch (error) {
      setAiSummary(getLocalPanchangSummary(panchang));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    const savedNotes = localStorage.getItem('nirnay_notes');
    const notes = savedNotes ? JSON.parse(savedNotes) : [];
    const newNote = {
      id: Math.random().toString(36).substr(2, 9),
      date: format(currentDate, 'yyyy-MM-dd'),
      text: noteText,
      color: 'bg-indigo-500',
      type: 'event'
    };
    localStorage.setItem('nirnay_notes', JSON.stringify([...notes, newNote]));
    setNoteText('');
    setIsAddingNote(false);
  };

  const handleSaveDrawing = (data: string) => {
    const savedDrawings = localStorage.getItem('nirnay_drawings');
    const drawings = savedDrawings ? JSON.parse(savedDrawings) : {};
    drawings[format(currentDate, 'yyyy-MM-dd')] = data;
    localStorage.setItem('nirnay_drawings', JSON.stringify(drawings));
    setIsDrawingMode(false);
  };

  const toggleSpeech = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNoteText(transcript);
      setIsAddingNote(true);
    };

    recognition.start();
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden h-full flex flex-col group transition-all hover:shadow-2xl hover:border-orange-200">
      {/* Header */}
      <div className="bg-orange-600 p-5 text-white flex items-center justify-between relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-md">
            <Calendar size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-black text-sm tracking-tight">Nirnay Pro</h4>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{format(currentDate, 'MMMM yyyy')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button 
            onClick={() => setIsFamilyMode(!isFamilyMode)}
            className={cn("p-2 rounded-xl transition-all", isFamilyMode ? "bg-white text-orange-600" : "bg-white/10 text-white hover:bg-white/20")}
            title="Family Mode"
          >
            <Users size={16} />
          </button>
          <button 
            onClick={() => setIsTempleMode(!isTempleMode)}
            className={cn("p-2 rounded-xl transition-all", isTempleMode ? "bg-white text-orange-600" : "bg-white/10 text-white hover:bg-white/20")}
            title="Temple Mode"
          >
            <Heart size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800 tracking-tighter">{panchang.paksha} {panchang.tithiNum}</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{panchang.tithi}</span>
            </div>
            {panchang.festival && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[11px] font-bold border border-orange-100">
                <Sparkles size={12} />
                {panchang.festival}
              </div>
            )}
          </div>
          {weather && (
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-slate-800">
                <span className="text-xl font-black">{Math.round(weather.temp.day)}°</span>
                {getWeatherIcon(weather.weather[0].main)}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{weather.weather[0].description}</p>
            </div>
          )}
        </div>

        {/* AI Summary Section */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">AI Daily Insight</span>
            </div>
            {!aiSummary && !isGenerating && (
              <button 
                onClick={generateAiSummary}
                className="text-[10px] font-bold text-indigo-600 hover:underline"
              >
                Generate
              </button>
            )}
          </div>
          {isGenerating ? (
            <div className="flex items-center gap-2 text-slate-400 italic text-xs">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles size={12} />
              </motion.div>
              Analyzing cosmic alignments...
            </div>
          ) : aiSummary ? (
            <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"{aiSummary}"</p>
          ) : (
            <p className="text-[11px] text-slate-400 italic">Get your personalized spiritual guidance for today.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button 
            onClick={() => setIsAddingNote(true)}
            className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
          >
            <Plus size={16} />
            Quick Note
          </button>
          <button 
            onClick={() => setIsDrawingMode(true)}
            className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10"
          >
            <Edit3 size={16} />
            S-Pen Draw
          </button>
        </div>

        <button 
          onClick={() => onNavigate?.('nirnay')}
          className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-widest transition-colors"
        >
          Open Full Calendar <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddingNote && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-slate-800">Add Quick Note</h3>
                <button onClick={() => setIsAddingNote(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="relative">
                <textarea 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full h-32 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all text-slate-800 font-medium resize-none"
                />
                <button 
                  onClick={toggleSpeech}
                  className={cn(
                    "absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all",
                    isListening ? "bg-rose-500 text-white animate-pulse" : "bg-white text-slate-400 hover:text-indigo-600"
                  )}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setIsAddingNote(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveNote}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isDrawingMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-800">S-Pen Sketch</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drawing for {format(currentDate, 'MMM dd, yyyy')}</p>
                </div>
                <button onClick={() => setIsDrawingMode(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <DrawingCanvas 
                onSave={handleSaveDrawing}
                onCancel={() => setIsDrawingMode(false)}
                className="flex-1 min-h-[400px]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
