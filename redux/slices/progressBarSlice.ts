import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';

const initialState: { progressBarProgress: number } = {
  progressBarProgress: 0,
};

export const progressBarSlice = createSlice({
  name: 'progressBar',
  initialState,
  reducers: {
    incrementProgressBarProgress: (state, action: PayloadAction<number>) => {
      if (action.payload === 95) {
        state.progressBarProgress = 95;
      } else {
        state.progressBarProgress = action.payload + 1;
      }
    },
    completeProgressBarProgress: (state) => {
      state.progressBarProgress = 100;
    },
    resetProgressBarProgress: (state) => {
      state.progressBarProgress = 0;
    },
  },
});

export const {
  incrementProgressBarProgress,
  completeProgressBarProgress,
  resetProgressBarProgress,
} = progressBarSlice.actions;

export const getProgressBarProgress = (state: RootState) =>
  state.progressBar.progressBarProgress;

export default progressBarSlice.reducer;
