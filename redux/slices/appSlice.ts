import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';

export type ModalSeverities = 'success' | 'info' | 'warning' | 'error';
type ModalStates = 'closed' | 'confirmed' | 'canceled' | 'open';

interface PopupModalDetails {
  title: string;
  body: string;
  severity: ModalSeverities;
  state: ModalStates;
}

export const appInitialState: {
  sortCondition: string;
  sportCondition: string;
  popupModalDetails: PopupModalDetails;
} = {
  sortCondition: 'speedDesc',
  sportCondition: 'running',
  popupModalDetails: {
    title: '',
    body: '',
    severity: 'success',
    state: 'closed',
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState: appInitialState,
  reducers: {
    setPopupModalDetails: (
      state,
      action: PayloadAction<
        Partial<PopupModalDetails> & Omit<PopupModalDetails, 'state'>
      >
    ) => {
      Object.assign(state.popupModalDetails, action.payload);
    },
    setModalState: (
      state,
      action: PayloadAction<PopupModalDetails['state']>
    ) => {
      state.popupModalDetails.state = action.payload;
    },
    setSortCondition: (state, action: PayloadAction<string>) => {
      state.sortCondition = action.payload;
    },
    setSportCondition: (state, action: PayloadAction<string>) => {
      state.sportCondition = action.payload;
    },
  },
});

export const {
  setSortCondition,
  setSportCondition,
  setModalState,
  setPopupModalDetails,
} = appSlice.actions;

export const getSortCondition = (state: RootState) => state.app.sortCondition;
export const getSportCondition = (state: RootState) => state.app.sportCondition;
export const getPopupModalDetails = (state: RootState) =>
  state.app.popupModalDetails;
export const getModalState = (state: RootState) =>
  state.app.popupModalDetails.state;

export default appSlice.reducer;
