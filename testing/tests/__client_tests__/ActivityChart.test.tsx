import React from 'react';
import ActivityChart, {
  ActivityChartProps,
} from '@components/UserProfile/ActivityChart';
import {
  TestActions,
  TestState,
  actClick,
  render,
  screen,
} from '@testing/test-utils';

const renderWithState = (
  state: TestState,
  localState: ActivityChartProps,
  preloadedDispatch?: TestActions,
  ui = <ActivityChart {...localState} />
) => {
  return render(ui, { preloadedState: state, actions: preloadedDispatch });
};

describe('Activity Chart Tests', () => {
  it('should render', async () => {
    renderWithState({}, { activityType: 'Run' });
    expect(screen.getByText(/Distance/i)).toBeInTheDocument();
    expect(screen.getByText(/Count/i)).toBeInTheDocument();
    await actClick(screen.getByText(/Distance/i));
    await actClick(screen.getByText(/Count/i));
    // screen.debug();
  });
});
