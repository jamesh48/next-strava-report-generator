import { QueryStatus } from '@reduxjs/toolkit/query';
import allEntries from '@testing/MSW/jsonPayloads/allEntries.json';
import StravaEntry, {
  StravaEntryProps,
} from '@components/StravaEntries/StravaEntry';
import { TestActions, TestState, render, screen } from '@testing/test-utils';
import {
  detailedEntryCurrentActivity,
  stravaEntryGeneralEntry,
} from '@testing/testFixtures';

const renderWithState = (
  state: TestState,
  localState: StravaEntryProps,
  preloadedDispatch?: TestActions,
  ui = <StravaEntry {...localState} />
) => {
  return render(ui, { preloadedState: state, actions: preloadedDispatch });
};

describe('StravaEntry Tests', () => {
  it('Should render a Strava Entry', () => {
    renderWithState(
      {
        app: {
          sportCondition: 'Run',
          customDateCondition: false,
          dateCondition: 'allTime',
          fromDate: '',
          toDate: '',
        },
        entriesApi: {
          queries: {
            'getAllEntries(null)': {
              data: allEntries,
              status: QueryStatus.fulfilled,
            },
          },
        },
      },
      {
        no: 1,
        showIndividualEntry: () => {},
        currentActivity: detailedEntryCurrentActivity,
        format: 'avgmpace',
        sport: 'Run',
        entry: stravaEntryGeneralEntry,
      }
    );
    expect(
      screen.getByText(/2014 Barcelona E-Dreams Half Marathon/i)
    ).toBeInTheDocument();
  });
});
