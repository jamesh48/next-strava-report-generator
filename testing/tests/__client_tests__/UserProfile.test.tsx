import React from 'react';
import { QueryStatus } from '@reduxjs/toolkit/query';
import UserProfile from '@components/UserProfile/UserProfile';
import {
  TestActions,
  TestState,
  act,
  render,
  actClick,
  screen,
  waitFor,
} from '@testing/test-utils';

const renderWithState = (
  state: TestState,
  preloadedDispatch?: TestActions,
  ui = <UserProfile />
) => {
  return render(ui, { preloadedState: state, actions: preloadedDispatch });
};
let consoleErrorSpy: any;
describe('User Profile Tests', () => {
  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    // Teardown code that should run after each test
    // Log the number of console.error calls
    const errorCount = consoleErrorSpy.mock.calls.length;
    console.log(`Number of console.error calls: ${errorCount}`);
    // Restore the original console.error method
    consoleErrorSpy.mockRestore();
  });

  test('Should Render a (Loading) User Profile', async () => {
    renderWithState({
      entriesApi: {
        queries: {
          'getAllEntries(null)': { status: QueryStatus.pending },
        },
      },
    });
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('Should Render a User Profile', async () => {
    await act(async () => {
      renderWithState({
        entriesApi: {
          queries: {
            'getAllEntries(null)': { status: QueryStatus.fulfilled },
          },
        },
      });
    });

    const me = await screen.findByText(/James/i);
    expect(me).toBeInTheDocument();
    expect(screen.getByText(/Boulder/i)).toBeInTheDocument();
    expect(screen.getByText(/User Preferences/i)).toBeInTheDocument();
    expect(screen.getByText(/Year-to-Date Run Totals/i)).toBeInTheDocument();
    expect(screen.getByText(/Year-To-Date Swim Totals/i)).toBeInTheDocument();
  });

  test('It should open User Settings', async () => {
    await act(async () => {
      renderWithState({
        entriesApi: {
          queries: {
            'getAllEntries(null)': { status: QueryStatus.fulfilled },
          },
        },
      });
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);

    await actClick(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    expect(screen.getByText(/Default Sort/i)).toBeInTheDocument();
    expect(screen.getByText(/Speed: Fastest First/i)).toBeInTheDocument();
    expect(screen.getByText(/Default Date/i));
    expect(screen.getByText(/All Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Default Sport/i)).toBeInTheDocument();
    expect(screen.getByText(/Running/i)).toBeInTheDocument();
    expect(screen.getByText(/Apply/i)).toBeInTheDocument();
  });

  test('It should Persist changing the default sort to Date: Most Recent in User Settings', async () => {
    await act(async () => {
      renderWithState({
        entriesApi: {
          queries: {
            'getAllEntries(null)': { status: QueryStatus.fulfilled },
          },
        },
      });
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences

    await actClick(userPreferencesLink);

    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const speedFastestFirst = screen.getByText(/Speed: Fastest First/i);

    await actClick(speedFastestFirst);
    const dateMostRecent = await screen.findByText(/Date: Most Recent/i);
    await actClick(dateMostRecent);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/Date: Least Recent/i);
      expect(element).toBeNull();
    });
    // Apply Changes
    await actClick(screen.getByText(/Apply/i));
    // Revisit User Preferences
    await actClick(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Swimming is Default Option
    expect(screen.getByText(/Date: Most Recent/i)).toBeInTheDocument();
  });

  test('It should Persist changing the default sport to Swimming in User Settings', async () => {
    await act(async () => {
      renderWithState({
        entriesApi: {
          queries: {
            'getAllEntries(null)': { status: QueryStatus.fulfilled },
          },
        },
      });
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    await actClick(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const running = screen.getByText(/Running/i);
    await actClick(running);
    const swimming = await screen.findByText(/Swimming/i);
    await actClick(swimming);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/Cycling/i);
      expect(element).toBeNull();
    });
    // Apply Changes
    await actClick(screen.getByText(/Apply/i));
    // Revisit User Preferences
    await actClick(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Swimming is Default Option
    expect(screen.getByText(/Swimming/i)).toBeInTheDocument();
  });

  test('It should Persist changing the default date to This Year in User Settings', async () => {
    await act(async () => {
      renderWithState({
        entriesApi: {
          queries: {
            'getAllEntries(null)': { status: QueryStatus.fulfilled },
          },
        },
      });
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    await actClick(userPreferencesLink);

    await screen.findByText(/SRG User Settings/i);

    // Change Default Sport to Swimming
    const allTime = screen.getByText(/All Time/i);
    await actClick(allTime);
    const thisYear = await screen.findByText(/This Year/i);
    await actClick(thisYear);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/This Month/i);
      expect(element).toBeNull();
    });
    // Apply Changes
    await actClick(screen.getByText(/Apply/i));
    // Revisit User Preferences
    await actClick(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);

    // Check that Swimming is Default Option
    expect(screen.getByText(/This Year/i)).toBeInTheDocument();
  });

  test('It should not persist changing the default sport to Swimming in User Settings when the close button is clicked', async () => {
    await act(async () => {
      renderWithState({
        entriesApi: {
          queries: {
            'getAllEntries(null)': { status: QueryStatus.fulfilled },
          },
        },
      });
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    await actClick(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const running = screen.getByText(/Running/i);
    await actClick(running);
    const swimming = await screen.findByText(/Swimming/i);
    await actClick(swimming);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/Cycling/i);
      expect(element).toBeNull();
    });
    // Close Modal
    await actClick(screen.getByTestId('userpreferences-closebutton'));
    await waitFor(() => {
      const element = screen.queryByText(/SRG User Settings/i);
      expect(element).toBeNull();
    });
    // Revisit User Preferences
    await actClick(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Running is still the Default Option
    expect(screen.getByText(/Running/i)).toBeInTheDocument();
  });

  test('It should not persist changing the default sort to Date: Most Recent in User Settings when the close button is clicked', async () => {
    await act(async () => {
      renderWithState({
        entriesApi: {
          queries: {
            'getAllEntries(null)': { status: QueryStatus.fulfilled },
          },
        },
      });
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    await actClick(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const speedFastestFirst = screen.getByText(/Speed: Fastest First/i);
    await actClick(speedFastestFirst);
    const dateMostRecent = await screen.findByText(/Date: Most Recent/i);
    await actClick(dateMostRecent);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/Date: Least Recent/i);
      expect(element).toBeNull();
    });

    // Close Modal
    await actClick(screen.getByTestId('userpreferences-closebutton'));
    await waitFor(() => {
      const element = screen.queryByText(/SRG User Settings/i);
      expect(element).toBeNull();
    });
    // Revisit User Preferences
    await actClick(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Running is still the Default Option
    expect(screen.getByText(/Speed: Fastest First/i)).toBeInTheDocument();
  });

  test('It should not persist changing the default date to This Year in User Settings when the close button is clicked', async () => {
    await act(async () => {
      renderWithState({
        entriesApi: {
          queries: {
            'getAllEntries(null)': { status: QueryStatus.fulfilled },
          },
        },
      });
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    await actClick(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const allTime = screen.getByText(/All Time/i);
    await actClick(allTime);
    const thisYear = await screen.findByText(/This Year/i);
    await actClick(thisYear);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/This Month/i);
      expect(element).toBeNull();
    });

    // Close Modal
    await actClick(screen.getByTestId('userpreferences-closebutton'));
    await waitFor(() => {
      const element = screen.queryByText(/SRG User Settings/i);
      expect(element).toBeNull();
    });

    // Revisit User Preferences
    await actClick(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Running is still the Default Option
    expect(screen.getByText(/All Time/i)).toBeInTheDocument();
  });

  test('Destroy  User Settings Button should be disabled when Danger Area is closed and enabled when it is open', async () => {
    await act(async () => {
      renderWithState({
        entriesApi: {
          queries: {
            'getAllEntries(null)': { status: QueryStatus.fulfilled },
          },
        },
      });
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    await actClick(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    expect(screen.getByText(/Destroy All User Information/i)).toBeDisabled();
    await actClick(screen.getByText(/Danger Zone/i));
    await waitFor(() => {
      expect(
        screen.getByText(/Destroy All User Information/i)
      ).not.toBeDisabled();
    });
  });
});
