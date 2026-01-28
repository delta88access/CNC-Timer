
import React from 'react';
import { TimerState } from '../types';

interface TimerGridProps {
  timers: TimerState[];
  onToggle: (id: number) => void;
  onReset: (id: number) => void;
}

const TimerGrid: React.FC<TimerGridProps> = ({ timers, onToggle, onReset }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full grid grid-cols-2 lg:grid-cols-3 grid-rows-3 lg:grid-rows-2 gap-2 md:gap-4">
      {timers.map((timer, index) => {
        const isDoosan = index < 4;
        const isFinished = timer.remainingSeconds === 0 && timer.initialSeconds > 0;
        const isOrangeWarning = timer.remainingSeconds > 0 && timer.remainingSeconds <= 900; // 15 min or less
        const isYellowWarning = timer.remainingSeconds > 900 && timer.remainingSeconds <= 1800; // Between 30 and 15 min
        const isGreenSafe = timer.remainingSeconds > 1800; // More than 30 min
        
        let glowClass = 'border-slate-200';
        let textColor = 'text-slate-900';

        if (isFinished) {
          // Extremely saturated red with heavy bloom effect
          glowClass = 'border-red-600 ring-4 ring-red-500 shadow-[0_0_60px_rgba(255,0,0,0.95)] animate-pulse';
          textColor = 'text-red-600';
        } else if (isOrangeWarning) {
          // High-saturation orange with intense shadow
          glowClass = 'border-orange-600 ring-4 ring-orange-400/40 shadow-[0_0_30px_rgba(234,88,12,0.85)] animate-pulse';
          textColor = 'text-orange-700';
        } else if (isYellowWarning) {
          // Constant yellow glow
          glowClass = 'border-yellow-400 ring-4 ring-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.4)]';
          textColor = 'text-yellow-600';
        } else if (isGreenSafe) {
          // Constant green glow for safe/long duration
          glowClass = 'border-green-500 ring-4 ring-green-200 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
          textColor = 'text-green-600';
        }

        if (isDoosan) {
          return (
            <div 
              key={timer.id} 
              className={`flex flex-col transition-all duration-300 min-h-0 bg-white rounded-lg border overflow-hidden shadow-sm ${glowClass}`}
            >
              <div className="bg-[#E0EBF7] px-3 py-1.5 flex justify-between items-center shrink-0 border-b border-[#C8D9ED]">
                <span className="font-black italic text-[10px] tracking-tighter text-blue-900">DOOSAN</span>
                <span className="text-[8px] font-bold opacity-60 uppercase text-blue-800/70">{timer.name}</span>
              </div>
              
              <div className={`flex-1 flex flex-col justify-center items-center gap-1 min-h-0 px-1 transition-colors duration-300 ${isFinished ? 'bg-red-50/30' : 'bg-white'}`}>
                <div className={`text-2xl md:text-4xl lg:text-5xl font-black font-mono tracking-tighter leading-none ${textColor}`}>
                  {formatTime(timer.remainingSeconds)}
                </div>
                <div className={`text-[8px] font-bold py-0.5 px-2 rounded-full border border-slate-200 ${
                  timer.isRunning ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-400'
                }`}>
                  {timer.isRunning ? 'ACTIVE RUN' : 'STANDBY'}
                </div>
              </div>

              <div className="p-2 bg-slate-50 flex gap-2 shrink-0 border-t border-slate-100">
                <button 
                  onClick={() => onToggle(timer.id)}
                  disabled={isFinished || timer.initialSeconds === 0}
                  className={`flex-1 py-2 text-[10px] font-black uppercase transition-all rounded shadow-sm ${
                    timer.isRunning 
                      ? 'bg-red-50 text-red-600 border border-red-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-30`}
                >
                  {timer.isRunning ? 'Stop' : 'Start'}
                </button>
                <button 
                  onClick={() => onReset(timer.id)}
                  className="flex-1 py-2 text-[10px] font-black uppercase bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all rounded shadow-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div 
              key={timer.id} 
              className={`flex flex-col transition-all duration-300 rounded-lg overflow-hidden border bg-white shadow-sm min-h-0 ${glowClass}`}
            >
              <div className="bg-black text-white px-3 py-1.5 flex justify-between items-center shrink-0">
                <span className="text-[10px] font-black tracking-tight leading-none">DMG MORI</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm border ${
                   isFinished ? 'border-red-500 text-red-500' : 'border-white text-white'
                }`}>
                  {timer.name}
                </span>
              </div>

              <div className={`flex-1 flex flex-col justify-center items-center min-h-0 px-4 py-2 transition-colors duration-300 ${isFinished ? 'bg-red-50/30' : 'bg-white'}`}>
                <div className={`text-3xl md:text-4xl lg:text-5xl font-bold font-mono tracking-tighter leading-none ${textColor}`}>
                  {formatTime(timer.remainingSeconds)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-slate-200 shrink-0 border-t border-slate-200">
                <button 
                  onClick={() => onToggle(timer.id)}
                  disabled={isFinished || timer.initialSeconds === 0}
                  className={`py-3 text-[10px] font-black uppercase transition-all bg-white hover:bg-slate-50 disabled:opacity-30 ${
                    timer.isRunning ? 'text-red-600' : 'text-slate-900'
                  }`}
                >
                  {timer.isRunning ? 'Stop Cycle' : 'Start Cycle'}
                </button>
                <button 
                  onClick={() => onReset(timer.id)}
                  className="py-3 text-[10px] font-black uppercase bg-white hover:bg-slate-50 text-slate-400 transition-all border-l border-slate-100"
                >
                  Clear
                </button>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default TimerGrid;
