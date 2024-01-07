import React from 'react';
import {
  TestActions,
  TestState,
  actClick,
  render,
  screen,
} from '@testing/test-utils';

import AccessDenied from '@pages/AccessDenied';

const renderWithState = (
  state: TestState,
  localState: {},
  preloadedDispatch?: TestActions,
  ui = <AccessDenied {...localState} />
) => {
  return render(ui, { preloadedState: state, actions: preloadedDispatch });
};

describe('Access Denied Test Suite', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { replace: jest.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  });

  it('Should Render the Access Denied Page', () => {
    renderWithState({}, {});
    expect(
      screen.getByText('Access Denied: You chose to not authorize...')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/See you in the Winner's Circle Champ./i)
    ).toBeInTheDocument();
  });

  it('Calls window.location.replace when Authorize is clicked', () => {
    expect(jest.isMockFunction(window.location.replace)).toBe(true);
    renderWithState({}, {});
    const reloadButton = screen.getByText('Authorize');
    actClick(reloadButton);
    expect(window.location.replace).toHaveBeenCalled();
  });
});
