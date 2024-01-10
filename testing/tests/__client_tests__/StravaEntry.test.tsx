import { QueryStatus } from '@reduxjs/toolkit/query';
import allEntries from '@testing/MSW/jsonPayloads/allEntries.json';
import StravaEntry, {
  StravaEntryProps,
} from '@components/StravaEntries/StravaEntry';
import {
  TestActions,
  TestState,
  actClick,
  actKeyboard,
  render,
  screen,
} from '@testing/test-utils';
import {
  detailedEntryCurrentActivity,
  stravaEntryGeneralEntry,
} from '@testing/testFixtures';
import userEvent from '@testing-library/user-event';

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

  it('Detailed Entry Activity Description should switch to textarea on click and immediately be editable', async () => {
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
    const activityDescriptionDiv = screen.getByText(
      /Took it out fast came home slow/i
    );

    await actClick(activityDescriptionDiv);
    // No Additional Click is needed
    await actKeyboard(' hello world');
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });

  it('Detailed Entry Activity Name should switch to Input on click and immediately be editable', async () => {
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
    const activityNameLink = screen.getByText(
      /2014 Barcelona E-Dreams Half Marathon/i
    );

    await actClick(activityNameLink);
    // // No Additional Click is needed
    await actKeyboard(' hello world');
    expect(screen.getByDisplayValue(/hello world/i)).toBeInTheDocument();
  });
});
