import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Paperclip, 
  Image as ImageIcon, 
  Mic, 
  MoreVertical, 
  Trash2, 
  Copy, 
  RefreshCcw,
  Zap,
  Cpu,
  Brain,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export default function AINexus() {
  const [input, setInput] = useState('');
  
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([
    {
      id: 'chat-1',
      title: 'Q1 Financial Analysis',
      messages: [{ id: 'm1', role: 'assistant', content: 'Here is the Q1 financial analysis you requested.', timestamp: new Date() }]
    },
    {
      id: 'chat-2',
      title: 'Travel to India Planning',
      messages: [{ id: 'm2', role: 'assistant', content: 'Let\'s plan your trip to India.', timestamp: new Date() }]
    },
    {
      id: 'chat-3',
      title: 'Security Audit Log',
      messages: [{ id: 'm3', role: 'assistant', content: 'Reviewing the latest security audit logs.', timestamp: new Date() }]
    },
    {
      id: 'chat-4',
      title: 'Panchang Queries',
      messages: [{ id: 'm4', role: 'assistant', content: 'What would you like to know about the Panchang?', timestamp: new Date() }]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Jay Swaminarayan! I'm your AI Nexus assistant. How can I help you manage your ecosystem today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewConversation = () => {
    if (messages.length > 1 && !activeChatId) {
      // Save current conversation
      const newChat: ChatSession = {
        id: `chat-${Date.now()}`,
        title: messages[1]?.content.substring(0, 20) + '...',
        messages: [...messages]
      };
      setChatHistory([newChat, ...chatHistory]);
    } else if (activeChatId) {
      // Update existing
      setChatHistory(prev => prev.map(c => c.id === activeChatId ? { ...c, messages } : c));
    }
    
    setActiveChatId(null);
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Jay Swaminarayan! I'm your AI Nexus assistant. How can I help you manage your ecosystem today?",
        timestamp: new Date()
      }
    ]);
  };

  const loadChat = (chatId: string) => {
    if (messages.length > 1 && !activeChatId) {
      // Save current conversation before switching
      const newChat: ChatSession = {
        id: `chat-${Date.now()}`,
        title: messages[1]?.content.substring(0, 20) + '...',
        messages: [...messages]
      };
      setChatHistory(prev => [newChat, ...prev]);
    } else if (activeChatId) {
      setChatHistory(prev => prev.map(c => c.id === activeChatId ? { ...c, messages } : c));
    }

    const chatToLoad = chatHistory.find(c => c.id === chatId);
    if (chatToLoad) {
      setActiveChatId(chatId);
      setMessages(chatToLoad.messages);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've analyzed your request. I can help you with that. Would you like me to proceed?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestions = [
    { text: "Analyze my Q1 report", icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { text: "Check passport status", icon: Cpu, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { text: "Find auspicious days", icon: Sparkles, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8">
      {/* Sidebar - Chat History & Context */}
      <div className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
        <button 
          onClick={handleNewConversation}
          className="w-full flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          New Conversation
        </button>

        <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Chats</h4>
            <Search size={14} className="text-slate-400" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {chatHistory.map((chat) => (
              <button 
                key={chat.id} 
                onClick={() => loadChat(chat.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 transition-all text-sm font-bold truncate border",
                  activeChatId === chat.id 
                    ? "bg-indigo-50 text-indigo-600 border-indigo-100" 
                    : "text-slate-600 border-transparent hover:border-slate-100"
                )}
              >
                {chat.title}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                <Brain size={20} />
              </div>
              <h4 className="font-black text-sm tracking-tight">Nexus Intelligence</h4>
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">
              Model: Gemini 3.1 Pro<br/>
              Context: Full Ecosystem
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 tracking-tight">AI Nexus</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Online & Ready</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400">
              <RefreshCcw size={18} />
            </button>
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-3xl",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-slate-900 text-white" : "bg-indigo-50 text-indigo-600"
                )}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={cn(
                  "p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-slate-900 text-white rounded-tr-none" 
                    : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
                )}>
                  {msg.content}
                  <div className={cn(
                    "mt-4 text-[9px] font-bold uppercase tracking-widest opacity-40",
                    msg.role === 'user' ? "text-right" : "text-left"
                  )}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Bot size={20} />
              </div>
              <div className="flex items-center gap-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setInput(s.text)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-2"
                >
                  <s.icon size={14} className={s.color} />
                  {s.text}
                </button>
              ))}
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-600/5 rounded-[2.5rem] blur-xl group-focus-within:bg-indigo-600/10 transition-all"></div>
              <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-2 flex items-center gap-2 shadow-2xl shadow-slate-200/50">
                <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about your ecosystem..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-2"
                />
                <div className="flex items-center gap-1">
                  <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Mic size={20} />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={cn(
                      "p-3 rounded-2xl transition-all shadow-lg",
                      input.trim() 
                        ? "bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700" 
                        : "bg-slate-100 text-slate-300 shadow-none"
                    )}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
