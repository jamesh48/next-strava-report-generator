import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

import { entriesSlice, individualEntrySlice } from './slices';

export default class GlobalStore {
  public store: ReturnType<typeof GlobalStore.prototype.configureGlobalStore>;

  static EnhancedStore: ReturnType<typeof this.prototype.configureGlobalStore>;

  static RootState: ReturnType<(typeof this.EnhancedStore)['getState']>;

  static AppDispatch: (typeof this.EnhancedStore)['dispatch'];

  configureGlobalStore(initialState: {}) {
    const innerStore = configureStore({
      reducer: {
        ...rootReducer,
        [entriesSlice.reducerPath]: entriesSlice.reducer,
        [individualEntrySlice.reducerPath]: individualEntrySlice.reducer,
      },
      preloadedState: initialState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: { warnAfter: 100 } }).concat(
          entriesSlice.middleware,
          individualEntrySlice.middleware
        ),
    });
    this.store = innerStore;
    return innerStore;
  }

  getStore() {
    return this.store;
  }
}

export type RootState = typeof GlobalStore.RootState;
export type AppDispatch = typeof GlobalStore.AppDispatch;
