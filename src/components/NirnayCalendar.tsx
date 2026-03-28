import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isToday as isDateToday,
  startOfDay,
  startOfYear,
  endOfYear,
  addYears,
  subYears,
  eachMonthOfInterval,
  startOfHour,
  addHours
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Moon, 
  Sun, 
  Calendar as CalendarIcon,
  Plus,
  MoreVertical,
  Search,
  Maximize2,
  Minimize2,
  Edit3,
  Trash2,
  CheckCircle2,
  PenTool,
  Eraser,
  Save,
  Undo,
  Sparkles,
  ListTodo,
  Users,
  MapPin,
  Share2,
  Download,
  Mic,
  MicOff,
  Bell,
  Heart,
  Music,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Sun as SunIcon,
  CloudDrizzle,
  Wind,
  Thermometer,
  Map as MapIcon,
  Navigation,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { getPanchangForDate } from '../services/panchangService';
import { Language, CalendarView, Location } from '../types';
import { locales, translations } from '../translationService';
import { GoogleGenAI } from "@google/genai";
import { fetchWeather, searchLocations, DailyForecast, HourlyForecast, getWeatherIcon } from '../services/weatherService';
import { fetchDailyQuote, Quote } from '../services/quoteService';
import { fetchHolidays, Holiday } from '../services/holidayService';
import { fetchDateFact } from '../services/factService';

function DrawingCanvas({ onSave, onCancel, initialData }: { onSave: (data: string) => void, onCancel: () => void, initialData?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4f46e5');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    if (initialData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = initialData;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
  }, [initialData, color]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? (e as React.TouchEvent).touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? (e as React.TouchEvent).touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 rounded-2xl overflow-hidden border-2 border-orange-200 min-h-[250px]">
      <div className="flex items-center justify-between p-2 bg-white border-b border-slate-100">
        <div className="flex gap-2">
          {['#4f46e5', '#f97316', '#10b981', '#ef4444', '#000000'].map(c => (
            <button 
              key={c} 
              onClick={() => setColor(c)}
              className={cn("w-6 h-6 rounded-full border-2", color === c ? "border-slate-900" : "border-transparent")}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={clear} className="p-1.5 text-slate-400 hover:text-slate-600" title="Clear"><Eraser size={16} /></button>
          <button onClick={() => onSave(canvasRef.current?.toDataURL() || '')} className="p-1.5 text-emerald-600 hover:text-emerald-700" title="Save"><Save size={16} /></button>
          <button onClick={onCancel} className="p-1.5 text-rose-500 hover:text-rose-600" title="Cancel"><Trash2 size={16} /></button>
        </div>
      </div>
      <canvas 
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className="flex-1 cursor-crosshair touch-none bg-white"
      />
    </div>
  );
}

interface Note {
  id: string;
  date: string;
  text: string;
  color: string;
  type?: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthday: string;
  tithi?: string;
}

interface Temple {
  id: string;
  name: string;
  location: string;
  aartiTimings: string[];
  liveDarshanUrl?: string;
  isBaps?: boolean;
}

const TEMPLES: Temple[] = [
  { id: '1', name: 'BAPS Shri Swaminarayan Mandir', location: 'Ahmedabad', aartiTimings: ['06:00 AM', '07:30 PM'], liveDarshanUrl: 'https://www.baps.org/Global-Network/India/Ahmedabad/Live-Darshan.aspx', isBaps: true },
  { id: '2', name: 'Somnath Mahadev Mandir', location: 'Prabhas Patan', aartiTimings: ['07:00 AM', '12:00 PM', '07:00 PM'], liveDarshanUrl: 'https://www.somnath.org/Live-Darshan' },
  { id: '3', name: 'Dwarkadhish Temple', location: 'Dwarka', aartiTimings: ['06:30 AM', '08:00 PM'] },
  { id: '4', name: 'Akshardham', location: 'Gandhinagar', aartiTimings: ['06:30 AM', '07:00 PM'], isBaps: true },
];

const FAMILY_MEMBERS: FamilyMember[] = [
  { id: '1', name: 'Rasesh', relation: 'Self', birthday: '1990-05-15', tithi: 'Sud 7' },
  { id: '2', name: 'Ami', relation: 'Spouse', birthday: '1992-08-20', tithi: 'Vad 3' },
  { id: '3', name: 'Kavya', relation: 'Daughter', birthday: '2018-12-10', tithi: 'Sud 11' },
];

const toGujaratiDigits = (num: number | string) => {
  const gujaratiDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return num.toString().split('').map(digit => gujaratiDigits[parseInt(digit)] || digit).join('');
};

export default function NirnayCalendar({ language = 'en' }: { language?: Language }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [viewMode, setViewMode] = useState<CalendarView>('month');
  const [isExpanded, setIsExpanded] = useState(false);

  const t = translations[language];
  const locale = locales[language];
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawings, setDrawings] = useState<Record<string, string>>({});

  const handleSaveDrawing = (data: string) => {
    setDrawings(prev => ({ ...prev, [format(selectedDate, 'yyyy-MM-dd')]: data }));
    setIsDrawingMode(false);
  };

  const handleCancelDrawing = () => {
    setIsDrawingMode(false);
  };

  const [isTodoView, setIsTodoView] = useState(false);
  const [isFamilyMode, setIsFamilyMode] = useState(false);
  const [isTempleMode, setIsTempleMode] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [showFestivalCard, setShowFestivalCard] = useState<any>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickEventText, setQuickEventText] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [translatedQuote, setTranslatedQuote] = useState<string | null>(null);
  const [dateFact, setDateFact] = useState<string | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [activeSection, setActiveSection] = useState<'calendar' | 'muhurat' | 'festivals' | 'auspicious' | 'eclipse' | 'choghadiya'>('calendar');
  const [muhuratTab, setMuhuratTab] = useState<'marriage' | 'vastu' | 'janoi'>('marriage');
  const [festivalTab, setFestivalTab] = useState<'monthly' | 'annual'>('monthly');
  const [eclipseTab, setEclipseTab] = useState<'solar' | 'lunar'>('solar');
  const [choghadiyaTab, setChoghadiyaTab] = useState<'day' | 'night'>('day');

  const handleQuickAdd = () => {
    if (!quickEventText.trim()) return;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      date: dateKey,
      text: quickEventText,
      color: 'bg-indigo-500',
      type: 'event'
    };
    setNotes(prev => [...prev, newNote]);
    setQuickEventText('');
    setShowQuickAdd(false);
  };

  const [locations, setLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem('nirnay_locations');
    return saved ? JSON.parse(saved) : [
      { id: 'current', name: 'Ahmedabad, Gujarat India', lat: 23.0225, lng: 72.5714, enabled: true }
    ];
  });
  const [weatherDaily, setWeatherDaily] = useState<DailyForecast[]>([]);
  const [weatherHourly, setWeatherHourly] = useState<HourlyForecast[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [showLocationManager, setShowLocationManager] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [locationSearchResults, setLocationSearchResults] = useState<Location[]>([]);

  useEffect(() => {
    localStorage.setItem('nirnay_locations', JSON.stringify(locations));
    const activeLocation = locations.find(l => l.enabled);
    if (activeLocation) {
      updateWeather(activeLocation.lat, activeLocation.lng);
    }
  }, [locations]);

  const updateWeather = async (lat: number, lng: number) => {
    setIsWeatherLoading(true);
    const data = await fetchWeather(lat, lng);
    if (data) {
      setWeatherDaily(data.daily);
      setWeatherHourly(data.hourly);
    }
    setIsWeatherLoading(false);
  };

  const handleLocationSearch = async (query: string) => {
    setLocationSearchQuery(query);
    if (query.length > 2) {
      const results = await searchLocations(query);
      setLocationSearchResults(results);
    } else {
      setLocationSearchResults([]);
    }
  };

  const addLocation = (loc: Location) => {
    setLocations([...locations, { ...loc, id: Math.random().toString(36).substr(2, 9), enabled: false }]);
    setLocationSearchQuery('');
    setLocationSearchResults([]);
  };

  const toggleLocation = (id: string) => {
    setLocations(locations.map(l => ({
      ...l,
      enabled: l.id === id ? !l.enabled : false
    })));
  };

  const deleteLocation = (id: string) => {
    if (id === 'current') return;
    setLocations(locations.filter(l => l.id !== id));
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'gu' ? 'gu-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceQuery(transcript);
      handleVoiceQuery(transcript);
    };

    recognition.start();
  };

  const handleVoiceQuery = async (query: string) => {
    // Mock handling of voice query
    console.log("Voice Query:", query);
    // In a real app, use AI to parse the query and navigate the calendar
    if (query.toLowerCase().includes('amas')) {
      // Find next Amas
      console.log(`Searching for next Amas based on: "${query}"`);
    } else if (query.toLowerCase().includes('birthday')) {
      setIsFamilyMode(true);
    }
  };

  const generateAiSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const panchang = getPanchangForDate(selectedDate);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a short, insightful daily panchang summary for this data: ${JSON.stringify(panchang)}. 
        Include: Tithi, Nakshatra, and a "Good time for..." or "Avoid..." advice. 
        Language: ${language === 'gu' ? 'Gujarati' : 'English'}. 
        Keep it under 3 sentences.`,
      });
      setAiSummary(response.text || null);
    } catch (error) {
      console.error("Failed to generate AI summary", error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const q = await fetchDailyQuote();
      setQuote(q);
      
      if (q && language !== 'gu') {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Translate this Gujarati quote to ${language === 'en' ? 'English' : language}: "${q.gujaratiContent}"`,
          });
          setTranslatedQuote(response.text || null);
        } catch (error) {
          console.error("Failed to translate quote", error);
        }
      }

      const h = await fetchHolidays(currentDate.getFullYear());
      setHolidays(h);
    };
    loadInitialData();
  }, [language]);

  useEffect(() => {
    const loadDateFact = async () => {
      const fact = await fetchDateFact(selectedDate.getMonth() + 1, selectedDate.getDate());
      setDateFact(fact);
    };
    loadDateFact();
  }, [selectedDate]);
  useEffect(() => {
    const savedNotes = localStorage.getItem('nirnay_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    const savedDrawings = localStorage.getItem('nirnay_drawings');
    if (savedDrawings) {
      setDrawings(JSON.parse(savedDrawings));
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('nirnay_notes', JSON.stringify(notes));
  }, [notes]);

  // Save drawings to localStorage
  useEffect(() => {
    localStorage.setItem('nirnay_drawings', JSON.stringify(drawings));
  }, [drawings]);

  // Sync currentDate with selectedDate when it changes
  useEffect(() => {
    if (!isSameMonth(currentDate, selectedDate)) {
      setCurrentDate(startOfMonth(selectedDate));
    }
  }, [selectedDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  const getInterval = () => {
    switch (viewMode) {
      case 'day':
        return { start: startOfDay(selectedDate), end: startOfDay(selectedDate) };
      case 'week':
        return { start: startOfWeek(selectedDate, { locale }), end: endOfWeek(selectedDate, { locale }) };
      case 'month':
        return { start: startOfWeek(monthStart, { locale }), end: endOfWeek(monthEnd, { locale }) };
      case 'year':
        return { start: startOfYear(currentDate), end: endOfYear(currentDate) };
      default:
        return { start: startOfWeek(monthStart, { locale }), end: endOfWeek(monthEnd, { locale }) };
    }
  };

  const { start: startDate, end: endDate } = getInterval();

  const calendarDays = viewMode === 'year' ? [] : eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const next = () => {
    switch (viewMode) {
      case 'day': setSelectedDate(addDays(selectedDate, 1)); break;
      case 'week': setSelectedDate(addDays(selectedDate, 7)); break;
      case 'month': {
        const nextMonth = addMonths(currentDate, 1);
        setCurrentDate(nextMonth);
        setSelectedDate(startOfMonth(nextMonth));
        break;
      }
      case 'year': {
        const nextYear = addYears(currentDate, 1);
        setCurrentDate(nextYear);
        setSelectedDate(startOfYear(nextYear));
        break;
      }
    }
  };

  const prev = () => {
    switch (viewMode) {
      case 'day': setSelectedDate(addDays(selectedDate, -1)); break;
      case 'week': setSelectedDate(addDays(selectedDate, -7)); break;
      case 'month': {
        const prevMonth = addMonths(currentDate, -1);
        setCurrentDate(prevMonth);
        setSelectedDate(startOfMonth(prevMonth));
        break;
      }
      case 'year': {
        const prevYear = addYears(currentDate, -1);
        setCurrentDate(prevYear);
        setSelectedDate(startOfYear(prevYear));
        break;
      }
    }
  };

  const panchang = getPanchangForDate(selectedDate);
  const selectedDateNotes = notes.filter(n => n.date === format(selectedDate, 'yyyy-MM-dd'));

  const getWeatherForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return weatherDaily.find(w => w.date === dateStr);
  };

  const addNote = () => {
    if (!newNoteText.trim()) return;
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      date: format(selectedDate, 'yyyy-MM-dd'),
      text: newNoteText,
      color: ['bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-rose-500'][Math.floor(Math.random() * 4)]
    };
    setNotes([...notes, newNote]);
    setNewNoteText('');
    setIsAddingNote(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const saveDrawing = (dataUrl: string) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setDrawings(prev => ({ ...prev, [dateKey]: dataUrl }));
    setIsDrawingMode(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowQuickAdd(false)}
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Quick Add</h3>
                <button onClick={() => setShowQuickAdd(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Event for {format(selectedDate, 'MMMM d, yyyy')}</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={quickEventText}
                    onChange={e => setQuickEventText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleQuickAdd()}
                    placeholder="What's happening?"
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleQuickAdd}
                    className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                  >
                    Save Event
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Calendar Grid */}
      <div className={cn(
        "bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto scrollbar-hide transition-all duration-500 ease-in-out",
        isExpanded ? "flex-[3]" : "flex-[2]"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {viewMode === 'year' ? format(currentDate, 'yyyy', { locale }) : 
                 viewMode === 'day' ? format(selectedDate, 'MMMM d, yyyy', { locale }) :
                 format(currentDate, 'MMMM yyyy', { locale })}
              </h3>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-0.5">
                Vikram Samvat 2081 • {panchang.paksha} {panchang.tithi}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowQuickAdd(true)}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              title="Quick Add"
            >
              <Plus size={18} />
            </button>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-2">
              {(['day', 'week', 'month', 'year'] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    viewMode === v ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {t[v]}
                </button>
              ))}
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <button 
                onClick={prev}
                className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-lg transition-all text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => {
                  const now = new Date();
                  setCurrentDate(now);
                  setSelectedDate(startOfDay(now));
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-lg transition-all"
              >
                {t.today}
              </button>
              <button 
                onClick={next}
                className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-lg transition-all text-slate-600 dark:text-slate-400"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-lg shadow-slate-900/10 dark:shadow-indigo-600/20"
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            {(['calendar', 'muhurat', 'festivals', 'auspicious', 'eclipse', 'choghadiya'] as const).map((section) => (
              <button 
                key={section}
                onClick={() => setActiveSection(section)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeSection === section ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                )}
              >
                {section}
              </button>
            ))}
          </div>

          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setIsTodoView(false)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                !isTodoView ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              <CalendarIcon size={14} />
              {t.calendarView}
            </button>
            <button 
              onClick={() => setIsTodoView(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                isTodoView ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              <ListTodo size={14} />
              {t.todoView}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={startVoiceSearch}
              className={cn(
                "p-2 rounded-xl transition-all border",
                isListening ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 animate-pulse" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
              title="Voice Search"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button 
              onClick={() => setIsFamilyMode(!isFamilyMode)}
              className={cn(
                "p-2 rounded-xl transition-all border",
                isFamilyMode ? "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-600 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
              title={t.familyMode}
            >
              <Users size={18} />
            </button>
            <button 
              onClick={() => setIsTempleMode(!isTempleMode)}
              className={cn(
                "p-2 rounded-xl transition-all border",
                isTempleMode ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
              title={t.templeMode}
            >
              <MapPin size={18} />
            </button>
            <button 
              onClick={() => setShowLocationManager(true)}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all"
              title={t.manageLocations}
            >
              <Navigation size={18} />
            </button>
          </div>

          <div className="flex-1" />

          <button 
            onClick={generateAiSummary}
            disabled={isGeneratingSummary}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            <Sparkles size={14} className={isGeneratingSummary ? "animate-pulse" : ""} />
            {isGeneratingSummary ? "Generating..." : t.generateSummary}
          </button>
        </div>

        <AnimatePresence>
          {aiSummary && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-indigo-50/50 border-b border-indigo-100"
            >
              <div className="p-4 relative">
                <button 
                  onClick={() => setAiSummary(null)}
                  className="absolute top-2 right-2 p-1 text-indigo-400 hover:text-indigo-600"
                >
                  <Plus size={14} className="rotate-45" />
                </button>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{t.aiSummary}</h5>
                    <p className="text-xs font-medium text-indigo-900 leading-relaxed">{aiSummary}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {activeSection === 'calendar' ? (
            <div className="flex flex-col h-full">
              {/* Today's / Selected Date Summary */}
              <div className="p-6 bg-orange-50/50 dark:bg-orange-900/10 border-b border-orange-100 dark:border-orange-900/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-orange-600 uppercase tracking-widest mb-1">
                      {isDateToday(selectedDate) ? "Today's Details" : "Selected Date Details"}
                    </h4>
                    <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      {format(selectedDate, 'MMMM d, yyyy')} • {format(selectedDate, 'EEEE')}
                    </p>
                    <p className="text-sm font-bold text-orange-600 mt-1">
                      Chaitra {panchang.paksha} {panchang.tithi}, VS {toGujaratiDigits('2082')}
                    </p>
                  </div>
                  {panchang.festival && (
                    <div className="flex-1 md:max-w-md p-3 bg-white dark:bg-slate-900 rounded-2xl border border-orange-200 dark:border-orange-900/40 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={14} className="text-orange-500" />
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Festival</span>
                      </div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{panchang.festival}</p>
                      {(panchang.festival.includes('Swaminarayan Jayanti') || panchang.festival.includes('Ram Navmi')) && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          Ramnavmi: The Birthday of Bhagvan Ram • Hari-Nom: Bhagvan Swaminarayan's Birthday
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

            {isTodoView ? (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{t.todoView}</h3>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <Download size={16} />
                    </button>
                    <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {notes.length > 0 ? notes.sort((a, b) => b.date.localeCompare(a.date)).map((note) => (
                    <div key={note.id} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-md transition-all group">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0", note.color)}>
                        <CalendarIcon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{note.date}</p>
                          <button 
                            onClick={() => deleteNote(note.id)}
                            className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{note.text}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto mb-4">
                        <ListTodo size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-400">No tasks or notes found</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Family Mode Overlay */}
                <AnimatePresence>
                  {isFamilyMode && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="p-6 bg-rose-50/50 dark:bg-rose-900/10 border-b border-rose-100 dark:border-rose-900/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                          <Users size={16} />
                          Family Calendar Mode
                        </h4>
                        <button onClick={() => setIsFamilyMode(false)} className="text-rose-400 hover:text-rose-600">
                          <Plus size={16} className="rotate-45" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {FAMILY_MEMBERS.map(member => (
                          <div key={member.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/20 shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                              <Heart size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 dark:text-white">{member.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">{member.relation} • {member.tithi}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Temple Mode Overlay */}
                <AnimatePresence>
                  {isTempleMode && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="p-6 bg-orange-50/50 dark:bg-orange-900/10 border-b border-orange-100 dark:border-orange-900/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={16} />
                          Temple Mode (Nearby Mandirs)
                        </h4>
                        <button onClick={() => setIsTempleMode(false)} className="text-orange-400 hover:text-orange-600">
                          <Plus size={16} className="rotate-45" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TEMPLES.map(temple => (
                          <div key={temple.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/20 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white">{temple.name}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">{temple.location}</p>
                              </div>
                              {temple.isBaps && (
                                <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-[8px] font-black rounded-full uppercase tracking-widest">BAPS</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {temple.aartiTimings.map((time, i) => (
                                <span key={i} className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[9px] font-bold text-slate-600 dark:text-slate-400">
                                  <Bell size={10} />
                                  {time}
                                </span>
                              ))}
                            </div>
                            {temple.liveDarshanUrl && (
                              <a 
                                href={temple.liveDarshanUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-1.5 bg-orange-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all"
                              >
                                <Music size={12} />
                                Live Darshan
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {viewMode === 'year' ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-6">
                {eachMonthOfInterval({ start: startOfYear(currentDate), end: endOfYear(currentDate) }).map((month) => (
                  <button
                    key={month.toString()}
                    onClick={() => {
                      setCurrentDate(month);
                      setViewMode('month');
                    }}
                    className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all text-left group"
                  >
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-orange-600 transition-colors">
                      {format(month, 'MMMM', { locale })}
                    </h4>
                    <div className="grid grid-cols-7 gap-1">
                      {eachDayOfInterval({ start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)) }).slice(0, 42).map((d, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-1 h-1 rounded-full",
                            isSameMonth(d, month) ? "bg-slate-300 dark:bg-slate-700" : "bg-transparent",
                            isDateToday(d) && "bg-orange-500"
                          )}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            ) : viewMode === 'day' ? (
              <div className="flex flex-col">
                {selectedDateNotes.length > 0 && (
                  <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/20">
                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{t.notes}</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedDateNotes.map((note) => (
                        <div key={note.id} className={cn("px-3 py-1.5 rounded-lg text-white text-[10px] font-bold shadow-sm", note.color)}>
                          {note.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {Array.from({ length: 24 }).map((_, hour) => {
                  const time = addHours(startOfDay(selectedDate), hour);
                  return (
                    <div key={hour} className="flex border-b border-slate-50 dark:border-slate-800 min-h-[80px]">
                      <div className="w-20 p-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-r border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                        {format(time, 'HH:mm')}
                      </div>
                      <div className="flex-1 p-4 relative">
                        {hour === 10 && (
                          <div className="absolute inset-x-4 top-2 bottom-2 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 rounded-lg p-3">
                            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-100">{t.morningSync || 'Morning Sync'}</p>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">10:00 - 11:00</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-7">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                    {day}
                  </div>
                ))}
                
                {calendarDays.map((day, idx) => {
                  const dayPanchang = getPanchangForDate(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isToday = isDateToday(day);
                  const dayNotes = notes.filter(n => n.date === format(day, 'yyyy-MM-dd'));

                  return (
                    <motion.button
                      key={day.toString()}
                      layout
                      onClick={() => setSelectedDate(startOfDay(day))}
                      className={cn(
                        "relative p-1 md:p-2 border-r border-b border-orange-100 dark:border-slate-800 transition-all group overflow-hidden",
                        viewMode === 'month' ? "h-24 md:h-32" : "h-48 md:h-64",
                        !isCurrentMonth && viewMode === 'month' && "bg-slate-50/30 dark:bg-slate-900/30",
                        isSelected && "bg-orange-50/50 dark:bg-orange-900/20 ring-2 ring-orange-500 ring-inset z-10",
                        "hover:bg-orange-50/20 dark:hover:bg-slate-800/50"
                      )}
                    >
                      <div className="flex justify-between items-start relative z-10">
                        <div className="flex flex-col items-start">
                          <span className={cn(
                            "text-lg md:text-2xl font-black tracking-tighter leading-none",
                            isToday ? "text-orange-600" : "text-slate-900 dark:text-white",
                            !isCurrentMonth && "opacity-30"
                          )}>
                            {format(day, 'd')}
                          </span>
                          {getWeatherForDate(day) && (
                            <div className="flex items-center gap-0.5 text-[8px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                              <span>{getWeatherIcon(getWeatherForDate(day)!.weatherCode)}</span>
                              <span>{getWeatherForDate(day)!.maxTemp}°</span>
                            </div>
                          )}
                          <span className={cn(
                            "text-[10px] md:text-xs font-bold text-orange-400 leading-none mt-1",
                            !isCurrentMonth && "opacity-30"
                          )}>
                            {toGujaratiDigits(format(day, 'd'))}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-end text-right">
                          <span className={cn(
                            "text-[8px] md:text-[10px] font-black uppercase tracking-tighter",
                            dayPanchang.paksha === 'Sud' ? "text-emerald-600" : "text-rose-600"
                          )}>
                            {dayPanchang.paksha === 'Sud' ? 'S' : 'V'} {toGujaratiDigits(dayPanchang.tithiNum)}
                          </span>
                          {(dayPanchang.festival || holidays.find(h => h.date === format(day, 'yyyy-MM-dd'))?.name) && (
                            <span className="mt-1 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 text-[7px] md:text-[9px] font-black rounded-md uppercase tracking-tighter whitespace-nowrap">
                              {dayPanchang.festival || holidays.find(h => h.date === format(day, 'yyyy-MM-dd'))?.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Indicators for Ekadashi, Amas, Poonam */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {dayPanchang.isEkadashi && (
                          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" title="Ekadashi" />
                        )}
                        {dayPanchang.isPoonam && (
                          <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50" title="Poonam" />
                        )}
                        {dayPanchang.isAmas && (
                          <div className="w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-100 shadow-sm shadow-slate-900/50" title="Amas" />
                        )}
                      </div>

                      {/* Note Indicator */}
                      {dayNotes.length > 0 && (
                        <div className="absolute bottom-2 right-2 flex gap-0.5">
                          {dayNotes.slice(0, 3).map((n, i) => (
                            <div key={i} className={cn("w-1.5 h-1.5 rounded-full", n.color)} />
                          ))}
                        </div>
                      )}

                      {/* Drawing Preview */}
                      {drawings[format(day, 'yyyy-MM-dd')] && (
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                          <img src={drawings[format(day, 'yyyy-MM-dd')]} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      ) : activeSection === 'muhurat' ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['marriage', 'vastu', 'janoi'] as const).map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setMuhuratTab(tab)}
                      className={cn(
                        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        muhuratTab === tab ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-600"
                      )}
                    >
                      {tab === 'vastu' ? 'Vastu-Kalash' : tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(muhuratTab === 'marriage' ? [
                  { date: 'Thursday, 5 March 2026', tithi: 'Fagan Vad bij, VS 2082', time: '10:09 to 26:00', auspicious: '**' },
                  { date: 'Friday, 6 March 2026', tithi: 'Fagan Vad trij, VS 2082', time: '08:30 to 22:00', auspicious: '*' },
                  { date: 'Monday, 9 March 2026', tithi: 'Fagan Vad chath, VS 2082', time: '11:15 to 24:00', auspicious: '**' },
                  { date: 'Thursday, 26 March 2026', tithi: 'Chaitra Sud Atham/Nom, VS 2082', time: '07:15 to 14:30', auspicious: '**' },
                ] : muhuratTab === 'vastu' ? [
                  { date: 'Wednesday, 11 March 2026', tithi: 'Fagan Vad Atham, VS 2082', time: '09:00 to 12:00', auspicious: '*' },
                  { date: 'Sunday, 22 March 2026', tithi: 'Chaitra Sud Trij, VS 2082', time: '10:30 to 15:00', auspicious: '**' },
                ] : [
                  { date: 'Monday, 23 March 2026', tithi: 'Chaitra Sud Choth, VS 2082', time: '08:00 to 11:30', auspicious: '*' },
                  { date: 'Friday, 27 March 2026', tithi: 'Chaitra Sud Nom, VS 2082', time: '09:15 to 13:00', auspicious: '**' },
                ]).map((m, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{m.date} <span className="text-orange-500">{m.auspicious}</span></h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{muhuratTab}</span>
                    </div>
                    <p className="text-xs font-bold text-orange-600 mb-1">{m.tithi}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Time: {m.time}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-4">* Auspicious, ** Very Auspicious</p>
            </div>
          ) : activeSection === 'festivals' ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['monthly', 'annual'] as const).map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setFestivalTab(tab)}
                      className={cn(
                        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        festivalTab === tab ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {(festivalTab === 'monthly' ? [
                  { name: 'Swaminarayan Jayanti / Ram Navmi', date: 'March 26, 2026', desc: 'Birthday of Bhagvan Swaminarayan (Hari-Nom) and Bhagvan Ram' },
                  { name: 'Hanuman Jayanti', date: 'April 1, 2026', desc: 'Birthday of Lord Hanuman' },
                  { name: 'Akshaya Tritiya', date: 'April 20, 2026', desc: 'Auspicious day for new beginnings' },
                ] : [
                  { name: 'Diwali', date: 'October 21, 2026', desc: 'Festival of Lights' },
                  { name: 'Holi', date: 'March 14, 2026', desc: 'Festival of Colors' },
                  { name: 'Janmashtami', date: 'August 16, 2026', desc: 'Birthday of Lord Krishna' },
                  { name: 'Ganesh Chaturthi', date: 'September 19, 2026', desc: 'Festival of Lord Ganesha' },
                ]).map((f, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{f.name}</h4>
                      <p className="text-[10px] font-bold text-orange-600 mb-1">{f.date}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'auspicious' ? (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Auspicious Days</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { date: 'March 26, 2026', auspicious: '**', event: 'Swaminarayan Jayanti / Ram Navmi' },
                  { date: 'April 5, 2026', auspicious: '*', event: 'Ekadashi' },
                  { date: 'April 12, 2026', auspicious: '**', event: 'Poonam' },
                  { date: 'April 20, 2026', auspicious: '**', event: 'Akshaya Tritiya' },
                  { date: 'May 1, 2026', auspicious: '*', event: 'Vaisakh Sud 15' },
                ].map((d, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{d.date}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{d.event}</p>
                    </div>
                    <span className="text-xl font-black text-orange-500">{d.auspicious}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'eclipse' ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['solar', 'lunar'] as const).map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setEclipseTab(tab)}
                      className={cn(
                        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        eclipseTab === tab ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-600"
                      )}
                    >
                      {tab === 'solar' ? 'Solar (Surya Grahan)' : 'Lunar (Chandra Grahan)'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {(eclipseTab === 'solar' ? [
                  { date: 'August 12, 2026', type: 'Total Solar Eclipse', visibility: 'Greenland, Iceland, Spain' },
                  { date: 'February 17, 2026', type: 'Annular Solar Eclipse', visibility: 'Antarctica' },
                ] : [
                  { date: 'March 3, 2026', type: 'Total Lunar Eclipse', visibility: 'Americas, Europe, Africa' },
                  { date: 'August 28, 2026', type: 'Partial Lunar Eclipse', visibility: 'Europe, Africa, Asia, Australia' },
                ]).map((e, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600">
                        {eclipseTab === 'solar' ? <SunIcon size={24} /> : <Moon size={24} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{e.type}</h4>
                        <p className="text-xs font-bold text-orange-600">{e.date}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">Visible in: {e.visibility}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'choghadiya' ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['day', 'night'] as const).map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setChoghadiyaTab(tab)}
                      className={cn(
                        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        choghadiyaTab === tab ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(choghadiyaTab === 'day' ? [
                  { name: 'Amrit', time: '06:42 - 08:15', status: 'Favorable', color: 'bg-emerald-500' },
                  { name: 'Kaal', time: '08:15 - 09:48', status: 'Unfavorable', color: 'bg-rose-500' },
                  { name: 'Shubh', time: '09:48 - 11:21', status: 'Favorable', color: 'bg-emerald-500' },
                  { name: 'Rog', time: '11:21 - 12:54', status: 'Unfavorable', color: 'bg-rose-500' },
                  { name: 'Chal', time: '12:54 - 14:27', status: 'Intermediate', color: 'bg-blue-500' },
                  { name: 'Labh', time: '14:27 - 16:00', status: 'Favorable', color: 'bg-emerald-500' },
                  { name: 'Udweg', time: '16:00 - 17:33', status: 'Unfavorable', color: 'bg-rose-500' },
                  { name: 'Amrit', time: '17:33 - 19:06', status: 'Favorable', color: 'bg-emerald-500' },
                ] : [
                  { name: 'Chal', time: '19:06 - 20:33', status: 'Intermediate', color: 'bg-blue-500' },
                  { name: 'Rog', time: '20:33 - 22:00', status: 'Unfavorable', color: 'bg-rose-500' },
                  { name: 'Kaal', time: '22:00 - 23:27', status: 'Unfavorable', color: 'bg-rose-500' },
                  { name: 'Labh', time: '23:27 - 00:54', status: 'Favorable', color: 'bg-emerald-500' },
                  { name: 'Udweg', time: '00:54 - 02:21', status: 'Unfavorable', color: 'bg-rose-500' },
                  { name: 'Shubh', time: '02:21 - 03:48', status: 'Favorable', color: 'bg-emerald-500' },
                  { name: 'Amrit', time: '03:48 - 05:15', status: 'Favorable', color: 'bg-emerald-500' },
                  { name: 'Chal', time: '05:15 - 06:42', status: 'Intermediate', color: 'bg-blue-500' },
                ]).map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", c.color)}></div>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white">{c.name}</p>
                        <p className="text-[10px] font-bold text-slate-400">{c.time}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                      c.status === 'Favorable' ? "bg-emerald-100 text-emerald-600" : 
                      c.status === 'Unfavorable' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Drawing Modal */}
      <AnimatePresence>
        {isDrawingMode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden max-w-2xl w-full h-[80vh] flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-black text-slate-900 dark:text-white">S-Pen Note - {format(selectedDate, 'MMM do, yyyy')}</h3>
                <button onClick={handleCancelDrawing} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 relative">
                <DrawingCanvas 
                  onSave={handleSaveDrawing} 
                  onCancel={handleCancelDrawing} 
                  initialData={drawings[format(selectedDate, 'yyyy-MM-dd')]} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={cn(
        "space-y-6 transition-all duration-500 overflow-y-auto scrollbar-hide pb-20",
        isExpanded ? "w-full lg:w-80" : "w-full lg:w-96"
      )}>
        {/* Selected Date Header */}
        <div className="bg-gradient-to-br from-orange-600 to-rose-700 rounded-[2rem] p-6 text-white shadow-xl shadow-orange-900/20 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">{t.selectedDate || 'Selected Date'}</p>
              <button 
                onClick={() => setIsDrawingMode(true)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-md transition-colors"
                title="Add S-Pen Note"
              >
                <PenTool size={16} className="text-white" />
              </button>
            </div>
            <h4 className="text-3xl font-black tracking-tighter mb-1">{format(selectedDate, 'EEEE, MMM do', { locale })}</h4>
            <p className="text-sm font-bold text-orange-100/80">
              Chaitra {panchang.paksha} {panchang.tithi}, VS {toGujaratiDigits('2082')}
            </p>
            {panchang.festival && (
              <div className="mt-2 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-1">Festival</p>
                <p className="text-xs font-bold">{panchang.festival}</p>
                {(panchang.festival.includes('Swaminarayan Jayanti') || panchang.festival.includes('Ram Navmi')) && (
                  <div className="mt-1 space-y-1">
                    <p className="text-[9px] text-orange-100/70">Ramnavmi: The Birthday of Bhagvan Ram</p>
                    <p className="text-[9px] text-orange-100/70">Hari-Nom: Bhagvan Swaminarayan's Birthday</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                <span className="text-[9px] font-black text-orange-200 uppercase tracking-widest block mb-1">Paksha</span>
                <span className="text-lg font-black">{panchang.paksha}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                <span className="text-[9px] font-black text-orange-200 uppercase tracking-widest block mb-1">Tithi</span>
                <span className="text-lg font-black">{panchang.tithi}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quote & Fact Section */}
        <div className="grid grid-cols-1 gap-4">
          {quote && (
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-indigo-600">
                <Music size={80} />
              </div>
              <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles size={12} />
                Daily Inspiration
              </h5>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2 leading-relaxed">{quote.gujaratiContent}</p>
              {translatedQuote && (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic mb-2 leading-relaxed">"{translatedQuote}"</p>
              )}
              <p className="text-[10px] font-black text-slate-400 text-right">— {quote.author}</p>
            </div>
          )}

          {dateFact && (
            <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-600/20">
              <h5 className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info size={12} />
                On this day...
              </h5>
              <p className="text-xs font-bold leading-relaxed">{dateFact}</p>
            </div>
          )}
        </div>

        {/* Weather Forecast Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl text-blue-600">
                <Cloud size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">{t.weather}</h4>
            </div>
            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {locations.find(l => l.enabled)?.name.split(',')[0]}
            </div>
          </div>

          {isWeatherLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 24h Hourly Forecast (Horizontal Scroll) */}
              <div>
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{t.forecast24h}</p>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {weatherHourly.map((h, i) => (
                    <div key={i} className="flex flex-col items-center min-w-[40px] gap-1">
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{format(new Date(h.time), 'HH:mm')}</span>
                      <span className="text-lg">{getWeatherIcon(h.weatherCode)}</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white">{h.temp}°</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 15d Daily Forecast */}
              <div>
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{t.forecast15d}</p>
                <div className="space-y-2">
                  {weatherDaily.slice(0, 7).map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12">{i === 0 ? 'Today' : format(new Date(d.date), 'EEE')}</span>
                      <div className="flex items-center gap-2 flex-1 justify-center">
                        <span className="text-sm">{getWeatherIcon(d.weatherCode)}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{d.condition}</span>
                      </div>
                      <div className="flex gap-2 w-16 justify-end">
                        <span className="text-xs font-black text-slate-800 dark:text-white">{d.maxTemp}°</span>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{d.minTemp}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Panchang Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-xl text-orange-600">
              <Info size={20} />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white">Detailed Panchang</h4>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Nakshatra', value: panchang.nakshatra, icon: <Moon size={14} /> },
              { label: 'Yoga', value: panchang.yoga, icon: <Sparkles size={14} /> },
              { label: 'Karana', value: panchang.karana, icon: <Sun size={14} /> },
              { label: 'Sunrise', value: '06:42 AM', icon: <Sun size={14} /> },
              { label: 'Sunset', value: '06:15 PM', icon: <Moon size={14} /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="text-slate-400">{item.icon}</div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{item.label}</span>
                </div>
                <span className="text-sm font-black text-slate-800 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Choghadiya Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-xl text-amber-600">
                <Sun size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">{t.choghadiya}</h4>
            </div>
            <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Full Day</button>
          </div>
          
          <div className="space-y-2">
            {[
              { name: 'Amrit', time: '06:42 - 08:15', status: 'Good', color: 'bg-emerald-500' },
              { name: 'Kaal', time: '08:15 - 09:48', status: 'Bad', color: 'bg-rose-500' },
              { name: 'Shubh', time: '09:48 - 11:21', status: 'Good', color: 'bg-emerald-500' },
              { name: 'Rog', time: '11:21 - 12:54', status: 'Bad', color: 'bg-rose-500' },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", c.color)}></div>
                  <div>
                    <p className="text-xs font-black text-slate-800 dark:text-white">{c.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{c.time}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                  c.status === 'Good' ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                )}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

        {/* Festival Card Modal */}
        <AnimatePresence>
          {showFestivalCard && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className={cn("w-full max-w-md p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden bg-gradient-to-br", showFestivalCard.color)}
              >
                <button 
                  onClick={() => setShowFestivalCard(null)}
                  className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
                <div className="relative z-10 text-center">
                  <div className="text-6xl mb-6">{showFestivalCard.icon}</div>
                  <h2 className="text-4xl font-black mb-2">{showFestivalCard.name}</h2>
                  <p className="text-sm font-bold opacity-80 uppercase tracking-[0.2em] mb-8">{showFestivalCard.date}</p>
                  <div className="p-6 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 mb-8">
                    <p className="text-xl font-medium italic leading-relaxed">"{showFestivalCard.message}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                      <Download size={18} />
                      Download
                    </button>
                    <button className="py-4 bg-white/20 hover:bg-white/30 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all border border-white/20">
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -right-20 -top-20 w-60 h-60 bg-black/10 rounded-full blur-3xl"></div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Location Manager Modal */}
        <AnimatePresence>
          {showLocationManager && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.manageLocations}</h3>
                  <button 
                    onClick={() => setShowLocationManager(false)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"
                  >
                    <Plus size={20} className="rotate-45 text-slate-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      value={locationSearchQuery}
                      onChange={(e) => handleLocationSearch(e.target.value)}
                      placeholder="Search for a city..."
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                    />
                    
                    {/* Search Results */}
                    {locationSearchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                        {locationSearchResults.map((loc) => (
                          <button
                            key={loc.id}
                            onClick={() => addLocation(loc)}
                            className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 border-b border-slate-50 dark:border-slate-700 last:border-0"
                          >
                            <MapIcon size={16} className="text-slate-400" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{loc.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location List */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.locations || 'My Locations'}</p>
                    {locations.map((loc) => (
                      <div key={loc.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 group">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleLocation(loc.id)}
                            className={cn(
                              "w-10 h-6 rounded-full relative transition-all",
                              loc.enabled ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
                            )}
                          >
                            <div className={cn(
                              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                              loc.enabled ? "left-5" : "left-1"
                            )} />
                          </button>
                          <span className={cn("text-sm font-bold", loc.enabled ? "text-slate-900 dark:text-white" : "text-slate-400")}>{loc.name}</span>
                        </div>
                        {loc.id !== 'current' && (
                          <button 
                            onClick={() => deleteLocation(loc.id)}
                            className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
}
