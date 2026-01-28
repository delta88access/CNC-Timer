
import React, { useState } from 'react';
import { TimerState } from '../types';

interface ManualSetProps {
  timers: TimerState[];
  onApply: (machineName: string, runtimeSeconds: number) => void;
}

const ManualSet: React.FC<ManualSetProps> = ({ timers, onApply }) => {
  const [selectedMachine, setSelectedMachine] = useState<string>(timers[0]?.name || '');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleApply = () => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    if (totalSeconds <= 0) {
      alert("Please enter a valid duration.");
      return;
    }
    onApply(selectedMachine, totalSeconds);
  };

  return (
    <div className="max-w-xl mx-auto space-y-3 pt-2 pb-4">
      {/* Information Header */}
      <div className="bg-[#FFF8F1] border border-[#FFE0C2] rounded-lg p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#E85D33] flex items-center justify-center text-white shrink-0 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-[#93371D]">Manual Override Initiation</h2>
          <p className="text-[9px] text-[#93371D]/60 font-bold uppercase">Select machine and set direct cycle time.</p>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center">
          <span className="text-[10px] font-black tracking-[0.15em] uppercase">Manual Dispatch</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-[#E85D33] animate-pulse"></div>
            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Machine Selection */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Target Machine</label>
            <select 
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm font-black text-slate-900 focus:outline-none focus:border-[#E85D33]"
            >
              {timers.map(t => (
                <option key={t.id} value={t.name}>{t.name} - Allocation Unit</option>
              ))}
            </select>
          </div>

          {/* Time Input Fields */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Set Custom Duration</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 border border-slate-200 rounded p-2">
                <span className="block text-[8px] font-bold text-slate-400 mb-1 uppercase text-center">Hours</span>
                <input 
                  type="number" 
                  min="0"
                  max="99"
                  value={hours || ''}
                  onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-transparent text-xl font-mono text-slate-900 focus:outline-none text-center"
                  placeholder="00"
                />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-2">
                <span className="block text-[8px] font-bold text-slate-400 mb-1 uppercase text-center">Minutes</span>
                <input 
                  type="number" 
                  min="0"
                  max="59"
                  value={minutes || ''}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full bg-transparent text-xl font-mono text-slate-900 focus:outline-none text-center"
                  placeholder="00"
                />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-2">
                <span className="block text-[8px] font-bold text-slate-400 mb-1 uppercase text-center">Seconds</span>
                <input 
                  type="number" 
                  min="0"
                  max="59"
                  value={seconds || ''}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full bg-transparent text-xl font-mono text-slate-900 focus:outline-none text-center"
                  placeholder="00"
                />
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="pt-2">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg flex flex-col items-center justify-center space-y-1">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Aggregated Sequence Time
              </div>
              <div className="text-3xl font-mono font-black text-slate-900 tracking-tighter">
                {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={handleApply}
            className="group relative w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded transition-all hover:bg-[#E85D33] active:scale-95 shadow-sm overflow-hidden"
          >
            <span className="relative z-10">Inject & Start Timer</span>
            <div className="absolute inset-0 bg-[#E85D33] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
          Manual Override Enabled // Precision Bypass v2.5.0
        </p>
      </div>
    </div>
  );
};

export default ManualSet;
