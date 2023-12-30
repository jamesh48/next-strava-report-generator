import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';

const initialState: { sortCondition: string; sportCondition: string } = {
  sortCondition: 'speedDesc',
  sportCondition: 'running',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSortCondition: (state, action: PayloadAction<string>) => {
      state.sortCondition = action.payload;
    },
    setSportCondition: (state, action: PayloadAction<string>) => {
      state.sportCondition = action.payload;
    },
  },
});

export const { setSortCondition, setSportCondition } = appSlice.actions;

export const getSortCondition = (state: RootState) => state.app.sortCondition;
export const getSportCondition = (state: RootState) => state.app.sportCondition;

export default appSlice.reducer;
