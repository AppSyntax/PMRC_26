import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Runner, RunLog } from '../types';

const ADMIN_PASSWORD = 'admin'; // Simple password for MVP

const MOCK_RUNNERS: Runner[] = [
  { id: '1', name: 'John Doe', gender: 'Male', totalKm: 55.5 },
  { id: '2', name: 'Jane Smith', gender: 'Female', totalKm: 42.0 },
  { id: '3', name: 'Mike Ross', gender: 'Male', totalKm: 60.2 },
  { id: '4', name: 'Sarah Connor', gender: 'Female', totalKm: 38.5 },
  { id: '5', name: 'Bruce Wayne', gender: 'Male', totalKm: 75.0 },
];

const MOCK_LOGS: RunLog[] = [
  { id: '101', runnerId: '5', distance: 10, date: '2026-01-06', time: '06:00', timestamp: Date.now() },
  { id: '102', runnerId: '3', distance: 8.5, date: '2026-01-06', time: '07:30', timestamp: Date.now() },
  { id: '103', runnerId: '1', distance: 5, date: '2026-01-06', time: '18:00', timestamp: Date.now() },
  { id: '104', runnerId: '2', distance: 6, date: '2026-01-07', time: '06:15', timestamp: Date.now() },
];

export const useRunStore = create<AppState>()(
  persist(
    (set, get) => ({
      runners: MOCK_RUNNERS,
      logs: MOCK_LOGS,
      isAdmin: false,
      lastUpdated: Date.now(),

      loginAdmin: (password) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },

      logoutAdmin: () => set({ isAdmin: false }),

      addRunner: (runnerData) => set((state) => ({
        runners: [...state.runners, { ...runnerData, id: crypto.randomUUID(), totalKm: 0 }],
        lastUpdated: Date.now(),
      })),

      updateRunner: (id, data) => set((state) => ({
        runners: state.runners.map((r) => (r.id === id ? { ...r, ...data } : r)),
        lastUpdated: Date.now(),
      })),

      deleteRunner: (id) => set((state) => ({
        runners: state.runners.filter((r) => r.id !== id),
        logs: state.logs.filter((l) => l.runnerId !== id),
        lastUpdated: Date.now(),
      })),

      addLog: (logData) => {
        const newLog = { ...logData, id: crypto.randomUUID(), timestamp: Date.now() };
        set((state) => {
          const newLogs = [...state.logs, newLog];
          // Recalculate totals immediately
          const newRunners = state.runners.map(runner => {
            if (runner.id === logData.runnerId) {
              return { ...runner, totalKm: runner.totalKm + logData.distance };
            }
            return runner;
          });
          return { logs: newLogs, runners: newRunners, lastUpdated: Date.now() };
        });
      },

      updateLog: (id, data) => {
        set((state) => {
          const oldLog = state.logs.find(l => l.id === id);
          if (!oldLog) return state;

          const newLogs = state.logs.map((l) => (l.id === id ? { ...l, ...data, timestamp: Date.now() } : l));
          
          // Recalculate all totals to be safe
          const runnerTotals = newLogs.reduce((acc, log) => {
            acc[log.runnerId] = (acc[log.runnerId] || 0) + log.distance;
            return acc;
          }, {} as Record<string, number>);

          const newRunners = state.runners.map(r => ({
            ...r,
            totalKm: runnerTotals[r.id] || 0
          }));

          return { logs: newLogs, runners: newRunners, lastUpdated: Date.now() };
        });
      },

      deleteLog: (id) => {
        set((state) => {
          const logToDelete = state.logs.find(l => l.id === id);
          if (!logToDelete) return state;

          const newLogs = state.logs.filter((l) => l.id !== id);
          
          // Update runner total
          const newRunners = state.runners.map(r => {
            if (r.id === logToDelete.runnerId) {
              return { ...r, totalKm: Math.max(0, r.totalKm - logToDelete.distance) };
            }
            return r;
          });

          return { logs: newLogs, runners: newRunners, lastUpdated: Date.now() };
        });
      },

      calculateTotals: () => {
        set((state) => {
          const runnerTotals = state.logs.reduce((acc, log) => {
            acc[log.runnerId] = (acc[log.runnerId] || 0) + log.distance;
            return acc;
          }, {} as Record<string, number>);

          const newRunners = state.runners.map(r => ({
            ...r,
            totalKm: runnerTotals[r.id] || 0
          }));
          return { runners: newRunners };
        });
      }
    }),
    {
      name: 'provost-run-storage',
    }
  )
);
