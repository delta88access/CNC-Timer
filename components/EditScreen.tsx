import React, { useState } from 'react';
import { TimerState } from '../types';

interface EditScreenProps {
  timers: TimerState[];
  onUpdate: (id: number, name: string, seconds: number) => void;
}

const EditScreen: React.FC<EditScreenProps> = ({ timers, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
      {timers.map((timer) => (
        <TimerEditor key={timer.id} timer={timer} onUpdate={onUpdate} />
      ))}
    </div>
  );
};

interface TimerEditorProps {
  timer: TimerState;
  onUpdate: (id: number, name: string, seconds: number) => void;
}

const TimerEditor: React.FC<TimerEditorProps> = ({ timer, onUpdate }) => {
  const [name, setName] = useState(timer.name);
  
  const initialH = Math.floor(timer.initialSeconds / 3600);
  const initialM = Math.floor((timer.initialSeconds % 3600) / 60);
  const initialS = timer.initialSeconds % 60;

  const [hours, setHours] = useState(initialH);
  const [minutes, setMinutes] = useState(initialM);
  const [seconds, setSeconds] = useState(initialS);

  const handleSave = () => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    onUpdate(timer.id, name.toUpperCase(), totalSeconds);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-4 shadow-sm">
      <div className="border-l-4 border-[#E85D33] pl-3">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Parameter ID</span>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent text-xl font-black focus:outline-none uppercase tracking-widest text-slate-800"
          placeholder="SYS_ID..."
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[['HR', hours, setHours], ['MN', minutes, setMinutes], ['SC', seconds, setSeconds]].map(([label, val, setter]: any) => (
          <div key={label} className="bg-slate-50 p-2 border border-slate-200 rounded">
            <span className="block text-[8px] font-bold text-slate-400 mb-1">{label}</span>
            <input 
              type="number" 
              min="0"
              max={label === 'HR' ? 99 : 59}
              value={val}
              onChange={(e) => setter(parseInt(e.target.value) || 0)}
              className="w-full bg-transparent text-lg font-mono text-slate-900 focus:outline-none text-center"
            />
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave}
        className="mt-2 w-full py-2.5 text-xs font-black bg-slate-900 text-white hover:bg-slate-800 transition-all rounded shadow-md uppercase tracking-widest"
      >
        Commit Update
      </button>
    </div>
  );
};

export default EditScreen;