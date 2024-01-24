import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@redux/store';
import { CurrentActivity, Sport } from '@components/StravaEntries/EntryTypes';

export type ModalSeverities = 'success' | 'info' | 'warning' | 'error';
type ModalStates = 'closed' | 'confirmed' | 'canceled' | 'open';

interface PopupModalDetails {
  title: string;
  body: string;
  severity: ModalSeverities;
  state: ModalStates;
}

export type DateCondition = 'allTime' | 'thisYear' | 'thisMonth' | 'thisWeek';

export const appInitialState: {
  achievementEffortView: 'best-effort' | 'best-segment';
  achievementsOnly: boolean;
  currentActivity: CurrentActivity;
  sortCondition: string;
  sportCondition: Sport;
  darkMode: boolean;
  customDateCondition: boolean;
  dateCondition: DateCondition;
  fromDate: string;
  toDate: string;
  clientSideTokens: { mapbox: string };
  popupModalDetails: PopupModalDetails;
} = {
  achievementsOnly: false,
  achievementEffortView: 'best-segment',
  currentActivity: {} as CurrentActivity,
  sortCondition: 'speedDesc',
  sportCondition: 'Run',
  customDateCondition: false,
  darkMode: false,
  dateCondition: 'allTime',
  fromDate: '',
  toDate: '',
  clientSideTokens: {
    mapbox: '',
  },
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
    toggleAchievementEffortView: (state) => {
      if (state.achievementEffortView === 'best-effort') {
        state.achievementEffortView = 'best-segment';
      } else {
        state.achievementEffortView = 'best-effort';
      }
    },
    setCurrentActivity: (state, action) => {
      state.currentActivity = action.payload;
    },
    setCurrentActivityDescription: (state, action) => {
      state.currentActivity.description = action.payload;
    },
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
    setSportCondition: (state, action: PayloadAction<Sport>) => {
      state.sportCondition = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setAchievementsOnlyCondition: (state, action: PayloadAction<boolean>) => {
      state.achievementsOnly = action.payload;
    },
    setDateCondition: (state, action: PayloadAction<DateCondition>) => {
      state.dateCondition = action.payload;
      state.customDateCondition = false;
    },
    setFromDateQuery: (state, action: PayloadAction<string>) => {
      state.fromDate = action.payload;
      state.customDateCondition = true;
    },
    setToDateQuery: (state, action: PayloadAction<string>) => {
      state.toDate = action.payload;
      state.customDateCondition = true;
    },
  },
});

export const {
  setAchievementsOnlyCondition,
  setCurrentActivity,
  setSortCondition,
  setSportCondition,
  setDarkMode,
  setToDateQuery,
  setCurrentActivityDescription,
  setFromDateQuery,
  setDateCondition,
  setModalState,
  setPopupModalDetails,
  toggleAchievementEffortView,
} = appSlice.actions;

export const getCurrentActivity = (state: RootState) =>
  state.app.currentActivity;
export const getDarkModeCondition = (state: RootState) => state.app.darkMode;
export const getSortCondition = (state: RootState) => state.app.sortCondition;
export const getSportCondition = (state: RootState) => state.app.sportCondition;

// Date Selectors

const getCustomDateConditionSelector = (state: RootState) =>
  state.app.customDateCondition;
const getDateConditionSelector = (state: RootState) => state.app.dateCondition;
const getFromDateQuerySelector = (state: RootState) => state.app.fromDate;
const getToDateQuerySelector = (state: RootState) => state.app.toDate;

export const getDateCondition = createSelector(
  [
    getCustomDateConditionSelector,
    getDateConditionSelector,
    getFromDateQuerySelector,
    getToDateQuerySelector,
  ],
  (customDateCondition, dateCondition, fromDateResult, toDateResult) => {
    if (customDateCondition) {
      return [fromDateResult, toDateResult, dateCondition];
    }

    if (dateCondition === 'allTime') {
      return ['', '', dateCondition];
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();

    if (dateCondition === 'thisYear') {
      const beginningOfYear = `${currentYear}-01-01`;
      return [beginningOfYear, '', dateCondition];
    }
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0'); // Adding 1 because months are zero-indexed

    if (dateCondition === 'thisMonth') {
      const beginningOfMonth = `${currentYear}-${currentMonth}-01`;
      return [beginningOfMonth, '', dateCondition];
    }

    if (dateCondition === 'thisWeek') {
      const dayOfWeek = currentDate.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday as the start of the week
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - daysToSubtract);

      const startOfWeekYear = startOfWeek.getFullYear().toString();
      const startOfWeekMonth = (startOfWeek.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const startOfWeekDay = startOfWeek.getDate().toString().padStart(2, '0');

      const beginningOfWeek = `${startOfWeekYear}-${startOfWeekMonth}-${startOfWeekDay}`;
      return [beginningOfWeek, '', dateCondition];
    }
    return ['', '', 'allTime'];
  }
);

export const getClientSideToken =
  (token: keyof (typeof appInitialState)['clientSideTokens']) =>
  (state: RootState) =>
    state.app.clientSideTokens[token];

export const getPopupModalDetails = (state: RootState) =>
  state.app.popupModalDetails;
export const getModalState = (state: RootState) =>
  state.app.popupModalDetails.state;

export const getAchievementsOnlyCondition = (state: RootState) =>
  state.app.achievementsOnly;

export const getAchievementEffortView = (state: RootState) =>
  state.app.achievementEffortView;

export default appSlice.reducer;
