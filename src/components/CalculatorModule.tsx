import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  Delete, 
  Divide, 
  X, 
  Minus, 
  Plus, 
  Equal, 
  Percent, 
  FlaskConical, 
  Scale, 
  Thermometer, 
  Ruler, 
  Maximize2, 
  Minimize2,
  History
} from 'lucide-react';
import { cn } from '../lib/utils';

type CalcMode = 'standard' | 'scientific' | 'unit';

export default function CalculatorModule() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [mode, setMode] = useState<CalcMode>('standard');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const result = eval(equation + display);
      const fullEquation = equation + display + ' = ' + result;
      setHistory([fullEquation, ...history]);
      setDisplay(result.toString());
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Display Area */}
      <div className="p-8 flex flex-col items-end justify-end min-h-[200px] bg-slate-50/50 dark:bg-slate-800/30">
        <AnimatePresence>
          {equation && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-slate-400 font-medium text-lg mb-2"
            >
              {equation}
            </motion.p>
          )}
        </AnimatePresence>
        <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
          {display}
        </h2>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 flex items-center justify-between border-y border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "p-3 rounded-2xl transition-all",
              showHistory ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <History size={20} />
          </button>
          <button 
            onClick={() => setMode(mode === 'scientific' ? 'standard' : 'scientific')}
            className={cn(
              "p-3 rounded-2xl transition-all",
              mode === 'scientific' ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <FlaskConical size={20} />
          </button>
          <button 
            onClick={() => setMode('unit')}
            className={cn(
              "p-3 rounded-2xl transition-all",
              mode === 'unit' ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Ruler size={20} />
          </button>
        </div>
        <button 
          onClick={backspace}
          className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
        >
          <Delete size={20} />
        </button>
      </div>

      {/* Keypad */}
      <div className="flex-1 p-6 grid grid-cols-4 gap-3">
        {mode === 'scientific' && (
          <div className="col-span-4 grid grid-cols-5 gap-2 mb-4">
            {['sin', 'cos', 'tan', 'log', 'ln', '(', ')', '^', '√', 'π'].map((sci) => (
              <button key={sci} className="p-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl hover:bg-indigo-100 transition-all">
                {sci}
              </button>
            ))}
          </div>
        )}

        <button onClick={clear} className="p-6 text-xl font-black text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-[2rem] hover:bg-rose-100 transition-all">C</button>
        <button onClick={() => handleOperator('%')} className="p-6 text-xl font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] hover:bg-emerald-100 transition-all"><Percent size={24} /></button>
        <button onClick={() => handleOperator('/')} className="p-6 text-xl font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] hover:bg-emerald-100 transition-all"><Divide size={24} /></button>
        <button onClick={() => handleOperator('*')} className="p-6 text-xl font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] hover:bg-emerald-100 transition-all"><X size={24} /></button>

        {[7, 8, 9].map(n => (
          <button key={n} onClick={() => handleNumber(n.toString())} className="p-6 text-2xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-[2rem] hover:bg-slate-100 transition-all">{n}</button>
        ))}
        <button onClick={() => handleOperator('-')} className="p-6 text-xl font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] hover:bg-emerald-100 transition-all"><Minus size={24} /></button>

        {[4, 5, 6].map(n => (
          <button key={n} onClick={() => handleNumber(n.toString())} className="p-6 text-2xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-[2rem] hover:bg-slate-100 transition-all">{n}</button>
        ))}
        <button onClick={() => handleOperator('+')} className="p-6 text-xl font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] hover:bg-emerald-100 transition-all"><Plus size={24} /></button>

        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => handleNumber(n.toString())} className="p-6 text-2xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-[2rem] hover:bg-slate-100 transition-all">{n}</button>
        ))}
        <button onClick={calculate} className="row-span-2 p-6 text-xl font-black text-white bg-indigo-600 rounded-[2rem] hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center"><Equal size={32} /></button>

        <button onClick={() => handleNumber('0')} className="col-span-2 p-6 text-2xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-[2rem] hover:bg-slate-100 transition-all">0</button>
        <button onClick={() => handleNumber('.')} className="p-6 text-2xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-[2rem] hover:bg-slate-100 transition-all">.</button>
      </div>

      {/* History Overlay */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-x-0 bottom-0 top-[200px] bg-white dark:bg-slate-900 z-20 border-t border-slate-200 dark:border-slate-800 flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Calculation History</h3>
              <button onClick={() => setHistory([])} className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Clear History</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {history.length > 0 ? history.map((item, i) => (
                <div key={i} className="text-right">
                  <p className="text-slate-400 font-medium text-sm">{item.split('=')[0]}=</p>
                  <p className="text-indigo-600 font-black text-2xl">{item.split('=')[1]}</p>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <History size={48} className="mb-4 opacity-20" />
                  <p className="font-bold">No history yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
