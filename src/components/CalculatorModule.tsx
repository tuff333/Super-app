import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Ruler, FlaskConical, Delete, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

type Mode = 'standard' | 'scientific' | 'unit';

export default function CalculatorModule() {
  const [mode, setMode] = useState<Mode>('standard');
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      // Basic eval for demonstration. In production, use a safe math parser.
      const result = eval(equation + display);
      setDisplay(String(result));
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
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Header / Mode Switcher */}
      <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex gap-2">
          <button 
            onClick={() => setMode('standard')}
            className={cn("p-2 rounded-xl transition-colors", mode === 'standard' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-slate-500")}
          >
            <Calculator size={20} />
          </button>
          <button 
            onClick={() => setMode('scientific')}
            className={cn("p-2 rounded-xl transition-colors", mode === 'scientific' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-slate-500")}
          >
            <FlaskConical size={20} />
          </button>
          <button 
            onClick={() => setMode('unit')}
            className={cn("p-2 rounded-xl transition-colors", mode === 'unit' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-slate-500")}
          >
            <Ruler size={20} />
          </button>
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Display */}
      <div className="p-6 flex-1 flex flex-col justify-end items-end bg-slate-50 dark:bg-slate-900/50">
        <div className="text-slate-500 dark:text-slate-400 text-lg h-8 mb-2 font-mono">{equation}</div>
        <div className="text-5xl font-light text-slate-900 dark:text-white tracking-tight truncate w-full text-right font-mono">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="p-4 grid grid-cols-4 gap-3 bg-white dark:bg-slate-900">
        {mode === 'scientific' && (
          <div className="col-span-4 grid grid-cols-4 gap-3 mb-3">
            {['sin', 'cos', 'tan', 'log', 'ln', '√', '^', 'π'].map(fn => (
              <button key={fn} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                {fn}
              </button>
            ))}
          </div>
        )}
        
        <button onClick={clear} className="p-4 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 font-bold text-xl hover:bg-rose-200 transition-colors">C</button>
        <button className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-xl hover:bg-slate-200 transition-colors">()</button>
        <button className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-xl hover:bg-slate-200 transition-colors">%</button>
        <button onClick={() => handleOperator('/')} className="p-4 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold text-xl hover:bg-indigo-200 transition-colors">÷</button>

        {[7, 8, 9].map(num => (
          <button key={num} onClick={() => handleNumber(String(num))} className="p-4 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium text-2xl hover:bg-slate-100 transition-colors">{num}</button>
        ))}
        <button onClick={() => handleOperator('*')} className="p-4 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold text-xl hover:bg-indigo-200 transition-colors">×</button>

        {[4, 5, 6].map(num => (
          <button key={num} onClick={() => handleNumber(String(num))} className="p-4 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium text-2xl hover:bg-slate-100 transition-colors">{num}</button>
        ))}
        <button onClick={() => handleOperator('-')} className="p-4 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold text-xl hover:bg-indigo-200 transition-colors">-</button>

        {[1, 2, 3].map(num => (
          <button key={num} onClick={() => handleNumber(String(num))} className="p-4 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium text-2xl hover:bg-slate-100 transition-colors">{num}</button>
        ))}
        <button onClick={() => handleOperator('+')} className="p-4 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold text-xl hover:bg-indigo-200 transition-colors">+</button>

        <button onClick={() => handleNumber('00')} className="p-4 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium text-xl hover:bg-slate-100 transition-colors">00</button>
        <button onClick={() => handleNumber('0')} className="p-4 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium text-2xl hover:bg-slate-100 transition-colors">0</button>
        <button onClick={() => handleNumber('.')} className="p-4 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium text-2xl hover:bg-slate-100 transition-colors">.</button>
        <button onClick={calculate} className="p-4 rounded-full bg-indigo-600 text-white font-bold text-2xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors">=</button>
      </div>
    </div>
  );
}
