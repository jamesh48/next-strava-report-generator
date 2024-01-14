import React from 'react';
import PageNoUl, {
  PageNoUlProps,
} from '@components/PaginationContainer/PageNoUl';
import { TestActions, TestState, render, screen } from '@testing/test-utils';

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
            average_heartrate: 150.6,
            max_heartrate: 180,
            kudos_count: 2,
            comment_count: 2,
            achievement_count: 7,
          },
        ],
      }
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('Should Render more than one page Number', () => {
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
            average_heartrate: 150.6,
            max_heartrate: 180,
            kudos_count: 2,
            comment_count: 2,
            achievement_count: 7,
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
            average_heartrate: 150.6,
            max_heartrate: 180,
            kudos_count: 2,
            comment_count: 2,
            achievement_count: 7,
          },
        ],
      }
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  describe('Mobile Browser Tests', () => {
    beforeAll(() => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        writable: true,
      });
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
              average_heartrate: 150.6,
              max_heartrate: 180,
              kudos_count: 2,
              comment_count: 2,
              achievement_count: 7,
            },
          ],
        }
      );
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('Should not Render a Select when there are no Entries in Mobile Browser', () => {
      renderWithState(
        {},
        {
          handleClick: () => {},
          currentPage: 1,
          entriesPerPage: 1,
          entries: [],
        }
      );
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      const element = screen.queryByTestId('pageNumbers');
      expect(element).not.toBeInTheDocument();
    });
  });
});
