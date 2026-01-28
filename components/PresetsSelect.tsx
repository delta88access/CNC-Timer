
import React, { useState, useEffect } from 'react';
import { Preset, TimerState } from '../types';

interface PresetsSelectProps {
  presets: Preset[];
  timers: TimerState[];
  onApply: (machineName: string, runtimeSeconds: number) => void;
}

const PresetsSelect: React.FC<PresetsSelectProps> = ({ presets, timers, onApply }) => {
  const [selectedMachine, setSelectedMachine] = useState<string>(timers[0]?.name || '');
  const [selectedPartId, setSelectedPartId] = useState<string>('');

  // Reset part selection when machine changes
  useEffect(() => {
    setSelectedPartId('');
  }, [selectedMachine]);

  const machinePresets = presets.filter(p => p.machineName === selectedMachine);
  const selectedPreset = machinePresets.find(p => p.id === selectedPartId);

  const formatTime = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleApply = () => {
    if (selectedPreset) {
      onApply(selectedMachine, selectedPreset.runtimeSeconds);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-3 pt-2 pb-4">
      {/* Information Header - More Compact */}
      <div className="bg-[#E1EFFE]/50 border border-[#C8D9ED] rounded-lg p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3.5a.5.5 0 0 1-.5-.5v-4A.5.5 0 0 1 8 4z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-900">Parameter Injection</h2>
          <p className="text-[9px] text-blue-800/60 font-bold uppercase">Select machine and part to sync.</p>
        </div>
      </div>

      {/* Main Configuration Card - Reduced Padding/Spacing */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center">
          <span className="text-[10px] font-black tracking-[0.15em] uppercase">Control Panel</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Machine Selection */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">01 Target Machine</label>
            </div>
            <select 
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm font-black text-slate-900 focus:outline-none focus:border-blue-500"
            >
              {timers.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Part Selection */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">02 Catalog #</label>
              <span className="text-[8px] font-bold text-slate-400 uppercase">Found: {machinePresets.length}</span>
            </div>
            <select 
              value={selectedPartId}
              onChange={(e) => setSelectedPartId(e.target.value)}
              disabled={machinePresets.length === 0}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">{machinePresets.length === 0 ? 'No Presets' : '-- Select Part --'}</option>
              {machinePresets.map(p => (
                <option key={p.id} value={p.id}>{p.partNumber}</option>
              ))}
            </select>
          </div>

          {/* Result Display - Compacted */}
          <div className="pt-2">
            {selectedPreset ? (
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg space-y-1 animate-in fade-in slide-in-from-bottom-1 duration-200">
                <div className="flex justify-between items-center text-[8px] font-black text-blue-400 uppercase tracking-widest">
                  <span>Cycle Time</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-green-600">Verified</span>
                  </div>
                </div>
                <div className="text-3xl font-mono font-black text-blue-900 tracking-tighter">
                  {formatTime(selectedPreset.runtimeSeconds)}
                </div>
              </div>
            ) : (
              <div className="h-20 flex flex-col items-center justify-center border border-dashed border-slate-100 rounded-lg text-center px-6">
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Awaiting Selection</div>
                <p className="text-[8px] text-slate-400 font-bold uppercase">Select parameters to view validation.</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer - Smaller */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={handleApply}
            disabled={!selectedPreset}
            className="group relative w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded disabled:opacity-20 transition-all hover:bg-blue-600 active:scale-95 shadow-sm overflow-hidden"
          >
            <span className="relative z-10">Load to Monitor</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>

      {/* Database Quick Info */}
      <div className="text-center">
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
          Precision Tool Data // System Integrity v2.4.2
        </p>
      </div>
    </div>
  );
};

export default PresetsSelect;
