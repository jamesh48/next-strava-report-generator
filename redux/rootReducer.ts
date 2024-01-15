import { appReducer, progressBarReducer } from './slices';
const rootReducer = {
  app: appReducer,
  progressBar: progressBarReducer,
};

export default rootReducer;
