import {
  getProgressBarProgress,
  incrementProgressBarProgress,
  resetProgressBarProgress,
  progressBarSlice,
  initialState as progressBarInitialState,
} from '@redux/slices/progressBarSlice';

describe('progressBar reducers', () => {
  it('should handle incrementProgressBarProgress', () => {
    const nextState = progressBarSlice.reducer(
      progressBarInitialState,
      incrementProgressBarProgress(0)
    );

    expect(nextState.progressBarProgress).toEqual(1);
  });

  it('should handle incrementProgressBarProgress staying at 95', () => {
    const nextState = progressBarSlice.reducer(
      progressBarInitialState,
      incrementProgressBarProgress(95)
    );

    expect(nextState.progressBarProgress).toEqual(95);
  });

  it('should handle incrementProgressBarProgress', () => {
    const nextState = progressBarSlice.reducer(
      progressBarInitialState,
      resetProgressBarProgress()
    );

    expect(nextState.progressBarProgress).toEqual(0);
  });
});
describe('progressBar selectors', () => {
  it('should select progressBarProgress from the state', () => {
    // @ts-expect-error
    const result = getProgressBarProgress({
      progressBar: progressBarInitialState,
    });

    expect(result).toEqual(0);
  });
});
