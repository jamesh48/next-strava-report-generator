import React from 'react';
import SwimmingTotals, {
  SwimmingTotalsProps,
} from '@components/UserProfile/SwimmingTotals';
import { TestActions, TestState, render, screen } from '@testing/test-utils';

const renderWithState = (
  state: TestState,
  localState: SwimmingTotalsProps,
  preloadedDispatch?: TestActions,
  ui = <SwimmingTotals {...localState} />
) => {
  return render(ui, { preloadedState: state, actions: preloadedDispatch });
};

describe('Swimming Totals Test Suite', () => {
  it('Should render swimming totals', () => {
    renderWithState(
      {},
      {
        profile: {
          ytd_swim_totals: { distance: 15000, count: 10, elapsed_time: 3000 },
        },
      }
    );
    expect(screen.getByText(/Year-To-Date Swim Totals/i)).toBeInTheDocument();
    expect(screen.getByText(/Number of Swims:/i)).toBeInTheDocument();
    expect(screen.getByText(/Meters per Second/i)).toBeInTheDocument();
  });
});
