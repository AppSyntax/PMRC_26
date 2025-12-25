export interface Runner {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  password?: string; // In a real app, this would be hashed. For MVP/Mock, plain text or simple check.
  totalKm: number;
}

export interface RunLog {
  id: string;
  runnerId: string;
  distance: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  timestamp: number; // Created/Updated timestamp
}

export interface AppState {
  runners: Runner[];
  logs: RunLog[];
  isAdmin: boolean;
  lastUpdated: number | null;
  
  // Actions
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addRunner: (runner: Omit<Runner, 'totalKm'>) => void;
  updateRunner: (id: string, data: Partial<Runner>) => void;
  deleteRunner: (id: string) => void;
  addLog: (log: Omit<RunLog, 'id' | 'timestamp'>) => void;
  updateLog: (id: string, data: Partial<RunLog>) => void;
  deleteLog: (id: string) => void;
  calculateTotals: () => void;
}
