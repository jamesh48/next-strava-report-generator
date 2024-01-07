import React from 'react';
import DetailedEntry, {
  DetailedEntryProps,
} from '@components/StravaEntries/DetailedEntry';
import { TestActions, TestState, render, screen } from '@testing/test-utils';

const renderWithState = (
  state: TestState,
  localState: DetailedEntryProps,
  preloadedDispatch?: TestActions,
  ui = <DetailedEntry {...localState} />
) => {
  return render(ui, { preloadedState: state, actions: preloadedDispatch });
};

describe('Detailed Entry Tests', () => {
  it('Should Render A Detailed Entry', () => {
    renderWithState(
      {},
      {
        editing: false,
        editedDescription: '',
        handleEditingChange: () => {},
        handleDescriptionChange: () => {},
        handleActivityUpdate: () => {},
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
      }
    );
    expect(
      screen.getByText(/Took it out fast came home slow/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Achievement Count/i)).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
    expect(screen.getByText(/Apple Watch Ultra/i)).toBeInTheDocument();
    expect(screen.getByText(/195 bpm/i)).toBeInTheDocument();
    screen.debug();
  });
});
