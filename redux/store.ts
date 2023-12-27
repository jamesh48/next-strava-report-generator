import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

import { entriesApi, individualEntrySlice } from './slices';

export default class GlobalStore {
  public store: ReturnType<typeof GlobalStore.prototype.configureGlobalStore>;

  static EnhancedStore: ReturnType<typeof this.prototype.configureGlobalStore>;

  static RootState: ReturnType<(typeof this.EnhancedStore)['getState']>;

  static AppDispatch: (typeof this.EnhancedStore)['dispatch'];

  configureGlobalStore(initialState: {}) {
    const innerStore = configureStore({
      reducer: {
        ...rootReducer,
        [entriesApi.reducerPath]: entriesApi.reducer,
        [individualEntrySlice.reducerPath]: individualEntrySlice.reducer,
      },
      preloadedState: initialState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: { warnAfter: 100 } }).concat(
          entriesApi.middleware,
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
