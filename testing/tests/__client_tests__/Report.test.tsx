import allEntries from '../../MSW/jsonPayloads/allEntries.json';
import Report, { ReportProps } from '@components/StravaEntries/Report';
import {
  TestActions,
  TestState,
  render,
  screen,
} from '../../testUtils/test-utils';
import { QueryStatus } from '@reduxjs/toolkit/query';

const renderWithState = (
  state: TestState,
  localState: ReportProps,
  preloadedDispatch?: TestActions,
  ui = <Report {...localState} />
) => {
  return render(ui, { preloadedState: state, actions: preloadedDispatch });
};

describe('Report Component tests', () => {
  it('Should Render A Report with default settings', async () => {
    renderWithState(
      {
        entriesApi: {
          queries: {
            'getAllEntries(null)': {
              data: allEntries,
              status: QueryStatus.fulfilled,
            },
          },
        },
      },
      { sport: 'Run', distance: 0, format: 'avgmpace', titleQuery: '' }
    );
    expect(
      screen.getByText(/2014 Barcelona E-Dreams Half Marathon/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/5k on the track/i)).toBeInTheDocument();
    expect(screen.getByText(/Stroke & Stride 5k/i)).toBeInTheDocument();
    expect(screen.getByText(/No stroke, all Stride/i)).toBeInTheDocument();
  });

  it('Should Render A Report with only Swims Displayed', async () => {
    renderWithState(
      {
        app: {
          sportCondition: 'Swim',
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
      { sport: 'Swim', distance: 0, format: 'avgypace', titleQuery: '' }
    );
    expect(
      screen.getByText(/MySwimPro - Afternoon Workout/i)
    ).toBeInTheDocument();
  });

  it('Should Render A Report with only Walks Displayed', async () => {
    renderWithState(
      {
        app: {
          sportCondition: 'Walk',
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
      { sport: 'Walk', distance: 0, format: undefined, titleQuery: '' }
    );
    expect(screen.getByText(/Morning Walk/i)).toBeInTheDocument();
  });
});
