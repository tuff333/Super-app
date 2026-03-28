import React, { useState, useEffect, useRef } from 'react';
import { Eraser, Save, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface DrawingCanvasProps {
  onSave: (data: string) => void;
  onCancel: () => void;
  initialData?: string;
  className?: string;
}

export default function DrawingCanvas({ onSave, onCancel, initialData, className }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4f46e5');
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        // Save current content
        const tempImage = canvas.toDataURL();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Restore content
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = tempImage;
        
        // Reset context properties
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (initialData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = initialData;
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [initialData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
  }, [color, lineWidth]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
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

  const draw = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y, pressure = 1;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
      if ('pressure' in e) {
        pressure = (e as React.PointerEvent).pressure || 1;
      }
    }

    // S-Pen/Pressure sensitivity support
    ctx.lineWidth = lineWidth * (pressure > 0 ? pressure : 1);
    
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
    <div className={cn("flex flex-col bg-slate-50 rounded-2xl overflow-hidden border-2 border-orange-200 min-h-[300px]", className)}>
      <div className="flex items-center justify-between p-3 bg-white border-b border-slate-100">
        <div className="flex gap-2">
          {['#4f46e5', '#f97316', '#10b981', '#ef4444', '#000000'].map(c => (
            <button 
              key={c} 
              onClick={() => setColor(c)}
              className={cn("w-8 h-8 rounded-full border-2 transition-transform active:scale-90", color === c ? "border-slate-900 scale-110" : "border-transparent")}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex gap-2">
            <button onClick={clear} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" title="Clear"><Eraser size={20} /></button>
            <button onClick={() => onSave(canvasRef.current?.toDataURL() || '')} className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors" title="Save"><Save size={20} /></button>
            <button onClick={onCancel} className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="Cancel"><Trash2 size={20} /></button>
          </div>
        </div>
      </div>
      <canvas 
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerUp={stopDrawing}
        onPointerMove={draw}
        onPointerLeave={stopDrawing}
        className="flex-1 cursor-crosshair touch-none bg-white"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
