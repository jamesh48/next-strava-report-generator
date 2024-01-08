import React from 'react';
import DetailedEntry, {
  DetailedEntryProps,
} from '@components/StravaEntries/DetailedEntry';
import { TestActions, TestState, render, screen } from '@testing/test-utils';
import { detailedEntryCurrentActivity } from '@testing/testFixtures';

const renderWithState = (
  state: TestState,
  localState: DetailedEntryProps,
  preloadedDispatch?: TestActions,
  ui = <DetailedEntry {...localState} />
) => {
  return render(ui, { preloadedState: state, actions: preloadedDispatch });
};

describe('Detailed Entry Tests', () => {
  it('Should Render A Detailed Entry (non editing)', () => {
    renderWithState(
      {},
      {
        editing: false,
        editedDescription: '',
        handleEditingChange: () => {},
        handleDescriptionChange: () => {},
        handleActivityUpdate: () => {},
        currentActivity: detailedEntryCurrentActivity,
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
  });
  it('Should Render A Detailed Entry (Editing)', () => {
    renderWithState(
      {},
      {
        editing: true,
        editedDescription: 'Took it out fast came home slow',
        handleEditingChange: () => {},
        handleDescriptionChange: () => {},
        handleActivityUpdate: () => {},
        currentActivity: detailedEntryCurrentActivity,
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
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });
});
