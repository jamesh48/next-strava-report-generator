import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';

const initialState: { sortCondition: string } = { sortCondition: 'speedDesc' };

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSortCondition: (state, action: PayloadAction<string>) => {
      state.sortCondition = action.payload;
    },
  },
});

export const { setSortCondition } = appSlice.actions;

export const getSortCondition = (state: RootState) => state.app.sortCondition;
export default appSlice.reducer;
