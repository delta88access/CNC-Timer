
import React, { useState } from 'react';
import { Preset } from '../types';

interface PresetsManageProps {
  presets: Preset[];
  onAdd: (preset: Preset) => void;
  onDelete: (id: string) => void;
  availableMachines: string[];
}

const PresetsManage: React.FC<PresetsManageProps> = ({ presets, onAdd, onDelete, availableMachines }) => {
  const [machineName, setMachineName] = useState(availableMachines[0]);
  const [partNumber, setPartNumber] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partNumber.trim()) return alert("Part Number required");
    
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    if (totalSeconds <= 0) return alert("Run time must be greater than zero");

    onAdd({
      id: Date.now().toString(),
      machineName,
      partNumber: partNumber.toUpperCase(),
      runtimeSeconds: totalSeconds,
    });

    setPartNumber('');
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const formatTime = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Creation Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-6 border-l-4 border-[#E85D33] pl-3">
          Create New Production Preset
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Machine Allocation</label>
            <select 
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-sm font-bold text-slate-900 focus:ring-1 focus:ring-[#E85D33] focus:outline-none"
            >
              {availableMachines.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Part Catalog Number</label>
            <input 
              type="text"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="e.g. PN-9920-X"
              className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-sm font-mono text-slate-900 focus:ring-1 focus:ring-[#E85D33] focus:outline-none uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Total Cycle Runtime</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" min="0" placeholder="HH" value={hours || ''} onChange={e => setHours(parseInt(e.target.value) || 0)} className="bg-slate-50 border border-slate-200 rounded p-2 text-center font-mono text-sm" />
              <input type="number" min="0" max="59" placeholder="MM" value={minutes || ''} onChange={e => setMinutes(parseInt(e.target.value) || 0)} className="bg-slate-50 border border-slate-200 rounded p-2 text-center font-mono text-sm" />
              <input type="number" min="0" max="59" placeholder="SS" value={seconds || ''} onChange={e => setSeconds(parseInt(e.target.value) || 0)} className="bg-slate-50 border border-slate-200 rounded p-2 text-center font-mono text-sm" />
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button 
              type="submit"
              className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-800 transition-all shadow-md active:scale-95"
            >
              Save to Database
            </button>
          </div>
        </form>
      </section>

      {/* Preset List */}
      <section>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Stored Presets Library</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {presets.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-xl text-slate-300 italic text-sm">
              No presets currently indexed in local storage.
            </div>
          ) : (
            presets.map(p => (
              <div key={p.id} className="bg-white border border-slate-200 p-4 rounded-lg flex justify-between items-center shadow-sm hover:border-[#E85D33]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center text-white font-black text-xs shrink-0">
                    {p.machineName}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">{p.partNumber}</div>
                    <div className="text-[10px] font-mono text-slate-400">{formatTime(p.runtimeSeconds)}</div>
                  </div>
                </div>
                <button 
                  onClick={() => onDelete(p.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  title="Delete Preset"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PresetsManage;
