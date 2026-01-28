import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TimerState, AppView, Preset } from './types';
import TimerGrid from './components/TimerGrid';
import EditScreen from './components/EditScreen';
import ExportView from './components/ExportView';
import PresetsManage from './components/PresetsManage';
import PresetsSelect from './components/PresetsSelect';
import ManualSet from './components/ManualSet';

const STORAGE_KEY = 'industrial_timers_v2';
const PRESETS_KEY = 'industrial_presets_v1';

const DEFAULT_NAMES = ["D1", "D2", "D3", "D4", "M10", "M14"];

const DEFAULT_TIMERS: TimerState[] = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  name: DEFAULT_NAMES[i],
  initialSeconds: 0,
  remainingSeconds: 0,
  isRunning: false,
}));

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('MAIN');
  const [timers, setTimers] = useState<TimerState[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_TIMERS;
  });

  const [presets, setPresets] = useState<Preset[]>(() => {
    const stored = localStorage.getItem(PRESETS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
  }, [timers]);

  useEffect(() => {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => 
        prevTimers.map(t => {
          if (t.isRunning && t.remainingSeconds > 0) {
            return { ...t, remainingSeconds: t.remainingSeconds - 1 };
          }
          if (t.isRunning && t.remainingSeconds <= 0) {
             return { ...t, isRunning: false, remainingSeconds: 0 };
          }
          return t;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const systemStatus = useMemo(() => {
    const anyFinished = timers.some(t => t.remainingSeconds === 0 && t.initialSeconds > 0);
    const anyUrgent = timers.some(t => t.remainingSeconds > 0 && t.remainingSeconds <= 900);
    const anyWarning = timers.some(t => t.remainingSeconds > 900 && t.remainingSeconds <= 1800);
    const anyActive = timers.some(t => t.isRunning || t.remainingSeconds > 1800);

    if (anyFinished) return { label: 'ALERT: CYCLE COMPLETE', color: 'bg-red-600', glow: 'shadow-[0_0_10px_rgba(220,38,38,0.8)]' };
    if (anyUrgent) return { label: 'STATUS: URGENT ATTENTION', color: 'bg-orange-500', glow: 'shadow-[0_0_10px_rgba(249,115,22,0.8)]' };
    if (anyWarning) return { label: 'STATUS: NEAR COMPLETION', color: 'bg-yellow-400', glow: 'shadow-[0_0_10px_rgba(250,204,21,0.8)]' };
    if (anyActive) return { label: 'SYSTEM: OPTIMAL', color: 'bg-green-500', glow: 'shadow-[0_0_10px_rgba(34,197,94,0.8)]' };
    return { label: 'SYSTEM: STANDBY', color: 'bg-slate-400', glow: 'shadow-none' };
  }, [timers]);

  const toggleTimer = useCallback((id: number) => {
    setTimers(prev => prev.map(t => 
      t.id === id ? { ...t, isRunning: !t.isRunning } : t
    ));
  }, []);

  const resetTimer = useCallback((id: number) => {
    setTimers(prev => prev.map(t => 
      t.id === id ? { ...t, isRunning: false, remainingSeconds: 0, initialSeconds: 0 } : t
    ));
  }, []);

  const resetAll = useCallback(() => {
    setTimers(currentTimers => 
      currentTimers.map(t => ({ 
        ...t, 
        isRunning: false, 
        remainingSeconds: 0,
        initialSeconds: 0
      }))
    );
  }, []);

  const updateTimerConfig = (id: number, name: string, seconds: number) => {
    setTimers(prev => prev.map(t => 
      t.id === id ? { ...t, name, initialSeconds: seconds, remainingSeconds: seconds, isRunning: false } : t
    ));
  };

  const applyPresetToTimer = (machineName: string, runtimeSeconds: number) => {
    setTimers(prev => prev.map(t => 
      t.name.toUpperCase() === machineName.toUpperCase() 
        ? { ...t, initialSeconds: runtimeSeconds, remainingSeconds: runtimeSeconds, isRunning: true } 
        : t
    ));
    setView('MAIN');
  };

  const handleManualSet = (machineName: string, runtimeSeconds: number) => {
    setTimers(prev => prev.map(t => 
      t.name.toUpperCase() === machineName.toUpperCase() 
        ? { ...t, initialSeconds: runtimeSeconds, remainingSeconds: runtimeSeconds, isRunning: true } 
        : t
    ));
    setView('MAIN');
  };

  const addPreset = (preset: Preset) => {
    setPresets(prev => [...prev, preset]);
  };

  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-white">
      {/* Clean Header with Logo Top-Left */}
      <header className="flex justify-between items-center py-4 border-b border-slate-200 bg-white z-10 px-6">
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0 h-10 md:h-12 flex items-center pr-6 cursor-pointer" onClick={() => setView('MAIN')}>
            <img 
              src="https://mms.businesswire.com/media/20240604384527/en/2149969/5/frntgrd_logo_color_pos_rgb.jpg?download=1" 
              alt="Frontgrade Gaisler" 
              className="h-full w-auto object-contain block"
              style={{ maxHeight: '48px' }}
            />
          </div>
          
          <nav className="hidden xl:flex gap-1">
             {[
               { id: 'MAIN', label: 'TIMERS' },
               { id: 'PRESETS_SELECT', label: 'LOAD PRESET' },
               { id: 'MANUAL_SET', label: 'QUICK START' },
               { id: 'PRESETS_MANAGE', label: 'PRESET MANAGER' },
               { id: 'EDIT', label: 'CONFIG' },
               { id: 'EXPORT', label: 'EXPORT CODE' }
             ].map(nav => (
               <button 
                key={nav.id}
                onClick={() => setView(nav.id as AppView)}
                className={`px-4 py-1 text-xs font-bold transition-all ${
                  view === nav.id
                    ? 'text-slate-900 border-b-2 border-[#E85D33]' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
               >
                 {nav.label}
               </button>
             ))}
          </nav>
        </div>
        
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] hidden sm:block">
          Precision Tool Management
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 p-2 md:p-6 overflow-hidden bg-white">
        {view === 'MAIN' ? (
          <TimerGrid 
            timers={timers} 
            onToggle={toggleTimer} 
            onReset={resetTimer} 
          />
        ) : view === 'EDIT' ? (
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <EditScreen 
              timers={timers} 
              onUpdate={updateTimerConfig} 
            />
          </div>
        ) : view === 'PRESETS_MANAGE' ? (
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <PresetsManage 
              presets={presets} 
              onAdd={addPreset} 
              onDelete={deletePreset} 
              availableMachines={DEFAULT_NAMES} 
            />
          </div>
        ) : view === 'PRESETS_SELECT' ? (
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <PresetsSelect 
              presets={presets} 
              timers={timers}
              onApply={applyPresetToTimer}
            />
          </div>
        ) : view === 'MANUAL_SET' ? (
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <ManualSet 
              timers={timers}
              onApply={handleManualSet}
            />
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <ExportView />
          </div>
        )}
      </main>

      {/* Footer with Action Center */}
      <footer className="px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center bg-slate-50 gap-4">
        {/* Left: System Status */}
        <div className="flex gap-4 items-center text-[10px] uppercase tracking-widest font-bold w-full md:w-1/4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${systemStatus.color} ${systemStatus.glow} ${systemStatus.color !== 'bg-slate-400' ? 'animate-pulse' : ''}`}></div>
            <span className={systemStatus.color === 'bg-red-600' ? 'text-red-600' : 'text-slate-600'}>
              {systemStatus.label}
            </span>
          </div>
          <span className="hidden lg:inline opacity-60 text-slate-400">ID: FG-GAISLER-01</span>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex flex-wrap gap-2 items-center justify-center flex-1 w-full md:w-auto">
          <button 
            onClick={() => setView('MAIN')}
            className={`px-4 py-2 text-[9px] font-black border transition-all rounded uppercase shadow-sm active:scale-95 ${
              view === 'MAIN' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Monitor
          </button>
          <button 
            onClick={() => setView('PRESETS_SELECT')}
            className={`px-4 py-2 text-[9px] font-black border transition-all rounded uppercase shadow-sm active:scale-95 ${
              view === 'PRESETS_SELECT' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Load Preset
          </button>
          <button 
            onClick={() => setView('MANUAL_SET')}
            className={`px-4 py-2 text-[9px] font-black border transition-all rounded uppercase shadow-sm active:scale-95 ${
              view === 'MANUAL_SET' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Manual Start
          </button>
          <button 
            onClick={() => setView('PRESETS_MANAGE')}
            className={`px-4 py-2 text-[9px] font-black border transition-all rounded uppercase shadow-sm active:scale-95 ${
              view === 'PRESETS_MANAGE' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Set Preset
          </button>
          
          <button 
            onClick={resetAll}
            className="px-4 py-2 text-[9px] font-black border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded uppercase shadow-sm active:scale-95"
          >
            Reset All
          </button>
        </div>

        {/* Right: Version Info */}
        <div className="flex gap-6 items-center justify-end text-[10px] uppercase tracking-widest text-slate-400 font-bold w-full md:w-1/4">
          <span className="hidden sm:inline">Precision Active</span>
          <span className="opacity-40">v3.3.1-FIX</span>
        </div>
      </footer>
    </div>
  );
};

export default App;