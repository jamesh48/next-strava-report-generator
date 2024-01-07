import { QueryStatus } from '@reduxjs/toolkit/query';
import allEntries from '@testing/MSW/jsonPayloads/allEntries.json';
import StravaEntry, {
  StravaEntryProps,
} from '@components/StravaEntries/StravaEntry';
import { TestActions, TestState, render, screen } from '@testing/test-utils';

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
        currentActivity: {
          id: 1759438787,
          name: '2014 Barcelona E-Dreams Half Marathon',
          kudos_count: 4,
          comment_count: 3,
          average_heartrate: 180,
          max_heartrate: 195,
          achievement_count: 2,
          description: 'Took it out fast came home slow',
          device_name: 'Apple Watch Ultra',
          laps: [
            {
              max_heartrate: 195,
              average_heartrate: 180,
              distance: 21100,
            },
          ],
          photos: {
            primary: {
              urls: {
                '600': '',
              },
            },
          },
        },
        format: 'avgmpace',
        sport: 'Run',
        entry: {
          activityId: 1759438787,
          type: 'Run',
          start_date: '2014-02-16T16:00:00Z',
          max_speed: '0',
          moving_time: 5544,
          name: '2014 Barcelona E-Dreams Half Marathon',
          distance: 21100,
          elapsed_time: 5544,
        },
      }
    );
    expect(
      screen.getByText(/2014 Barcelona E-Dreams Half Marathon/i)
    ).toBeInTheDocument();
  });
});
