
export interface TimerState {
  id: number;
  name: string;
  initialSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

export interface Preset {
  id: string;
  machineName: string; // e.g., "D1", "M10"
  partNumber: string;
  runtimeSeconds: number;
}

export type AppView = 'MAIN' | 'EDIT' | 'EXPORT' | 'PRESETS_MANAGE' | 'PRESETS_SELECT' | 'MANUAL_SET';
