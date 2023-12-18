import { create } from 'zustand';

export const useProgressBarProgressStore = create((set) => ({
  progressBarProgress: 0,
  incrementProgressBarProgress: (progressBarProgress) =>
    set((state) => ({
      progressBarProgress:
        state.progressBarProgress === 95 ? 95 : state.progressBarProgress + 1,
    })),
  completeProgressBarProgress: (progressBarProgress) =>
    set(() => ({ progressBarProgress: 100 })),
  resetProgressBarProgress: (progressBarProgress) =>
    set(() => ({ progressBarProgress: 0 })),
}));
