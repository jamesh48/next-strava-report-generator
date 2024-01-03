import React from 'react';
import PageNoUl, {
  PageNoUlProps,
} from '@components/PaginationContainer/PageNoUl';
import { screen } from '@testing-library/dom';
import { TestActions, TestState, render } from '../../testUtils/test-utils';

const renderWithState = (
  state: TestState,
  localState: PageNoUlProps,
  preloadedDispatch?: TestActions,
  ui = <PageNoUl {...localState} />
) => {
  return render(ui, { preloadedState: state, actions: preloadedDispatch });
};

describe('PageNoUl Tests', () => {
  it('Should Render a single Page Number', () => {
    renderWithState(
      {},
      {
        handleClick: () => {},
        currentPage: 1,
        entriesPerPage: 1,
        entries: [
          {
            activityId: 123456789,
            name: 'Test Entry',
            start_date: '',
            elapsed_time: 300,
            max_speed: '50.3',
            type: 'Run',
            distance: 5000,
            moving_time: 250,
          },
        ],
      }
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('Should Render a single Page Number', () => {
    renderWithState(
      {},
      {
        handleClick: () => {},
        currentPage: 1,
        entriesPerPage: 1,
        entries: [
          {
            activityId: 123456789,
            name: 'Test Entry',
            start_date: '',
            elapsed_time: 300,
            max_speed: '50.3',
            type: 'Run',
            distance: 5000,
            moving_time: 250,
          },
          {
            activityId: 223456789,
            name: 'Test Entry 2',
            start_date: '',
            elapsed_time: 300,
            max_speed: '50.3',
            type: 'Run',
            distance: 5000,
            moving_time: 250,
          },
        ],
      }
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
