import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

import { entriesSlice } from './slices/entriesSlice';

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
      },
      preloadedState: initialState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: { warnAfter: 100 } }).concat(
          entriesSlice.middleware
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
