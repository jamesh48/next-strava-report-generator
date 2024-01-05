import React from 'react';
import UserProfile from '@components/UserProfile/UserProfile';
import { screen, waitFor } from '@testing-library/dom';
import { TestActions, TestState, render } from '../../testUtils/test-utils';
import { QueryStatus } from '@reduxjs/toolkit/query';
import userEvent from '@testing-library/user-event';

const renderWithState = (
  state: TestState,
  preloadedDispatch?: TestActions,
  ui = <UserProfile />
) => {
  return render(ui, { preloadedState: state, actions: preloadedDispatch });
};

describe('User Profile Tests', () => {
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
    renderWithState({
      entriesApi: {
        queries: {
          'getAllEntries(null)': { status: QueryStatus.fulfilled },
        },
      },
    });

    const me = await screen.findByText(/James/i);
    expect(me).toBeInTheDocument();
    expect(screen.getByText(/Boulder/i)).toBeInTheDocument();
    expect(screen.getByText(/User Preferences/i)).toBeInTheDocument();
    expect(screen.getByText(/Year-to-Date Run Totals/i)).toBeInTheDocument();
    expect(screen.getByText(/Year-To-Date Swim Totals/i)).toBeInTheDocument();
  });

  test('It should open User Settings', async () => {
    renderWithState({
      entriesApi: {
        queries: {
          'getAllEntries(null)': { status: QueryStatus.fulfilled },
        },
      },
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);

    userEvent.click(userPreferencesLink);
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
    renderWithState({
      entriesApi: {
        queries: {
          'getAllEntries(null)': { status: QueryStatus.fulfilled },
        },
      },
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    userEvent.click(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const speedFastestFirst = screen.getByText(/Speed: Fastest First/i);
    userEvent.click(speedFastestFirst);
    const dateMostRecent = await screen.findByText(/Date: Most Recent/i);
    userEvent.click(dateMostRecent);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/Date: Least Recent/i);
      expect(element).toBeNull();
    });
    // Apply Changes
    userEvent.click(screen.getByText(/Apply/i));
    // Revisit User Preferences
    userEvent.click(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Swimming is Default Option
    expect(screen.getByText(/Date: Most Recent/i)).toBeInTheDocument();
  });

  test('It should Persist changing the default sport to Swimming in User Settings', async () => {
    renderWithState({
      entriesApi: {
        queries: {
          'getAllEntries(null)': { status: QueryStatus.fulfilled },
        },
      },
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    userEvent.click(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const running = screen.getByText(/Running/i);
    userEvent.click(running);
    const swimming = await screen.findByText(/Swimming/i);
    userEvent.click(swimming);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/Cycling/i);
      expect(element).toBeNull();
    });
    // Apply Changes
    userEvent.click(screen.getByText(/Apply/i));
    // Revisit User Preferences
    userEvent.click(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Swimming is Default Option
    expect(screen.getByText(/Swimming/i)).toBeInTheDocument();
  });

  test('It should Persist changing the default date to This Year in User Settings', async () => {
    renderWithState({
      entriesApi: {
        queries: {
          'getAllEntries(null)': { status: QueryStatus.fulfilled },
        },
      },
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    userEvent.click(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const allTime = screen.getByText(/All Time/i);
    userEvent.click(allTime);
    const thisYear = await screen.findByText(/This Year/i);
    userEvent.click(thisYear);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/This Month/i);
      expect(element).toBeNull();
    });
    // Apply Changes
    userEvent.click(screen.getByText(/Apply/i));
    // Revisit User Preferences
    userEvent.click(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Swimming is Default Option
    expect(screen.getByText(/This Year/i)).toBeInTheDocument();
  });

  test('It should not persist changing the default sport to Swimming in User Settings when the close button is clicked', async () => {
    renderWithState({
      entriesApi: {
        queries: {
          'getAllEntries(null)': { status: QueryStatus.fulfilled },
        },
      },
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    userEvent.click(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const running = screen.getByText(/Running/i);
    userEvent.click(running);
    const swimming = await screen.findByText(/Swimming/i);
    userEvent.click(swimming);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/Cycling/i);
      expect(element).toBeNull();
    });
    // Close Modal
    userEvent.click(screen.getByTestId('userpreferences-closebutton'));
    await waitFor(() => {
      const element = screen.queryByText(/SRG User Settings/i);
      expect(element).toBeNull();
    });
    // Revisit User Preferences
    userEvent.click(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Running is still the Default Option
    expect(screen.getByText(/Running/i)).toBeInTheDocument();
  });

  test('It should not persist changing the default sort to Date: Most Recent in User Settings when the close button is clicked', async () => {
    renderWithState({
      entriesApi: {
        queries: {
          'getAllEntries(null)': { status: QueryStatus.fulfilled },
        },
      },
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    userEvent.click(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const speedFastestFirst = screen.getByText(/Speed: Fastest First/i);
    userEvent.click(speedFastestFirst);
    const dateMostRecent = await screen.findByText(/Date: Most Recent/i);
    userEvent.click(dateMostRecent);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/Date: Least Recent/i);
      expect(element).toBeNull();
    });

    // Close Modal
    userEvent.click(screen.getByTestId('userpreferences-closebutton'));
    await waitFor(() => {
      const element = screen.queryByText(/SRG User Settings/i);
      expect(element).toBeNull();
    });
    // Revisit User Preferences
    userEvent.click(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Running is still the Default Option
    expect(screen.getByText(/Speed: Fastest First/i)).toBeInTheDocument();
  });

  test('It should not persist changing the default date to This Year in User Settings when the close button is clicked', async () => {
    renderWithState({
      entriesApi: {
        queries: {
          'getAllEntries(null)': { status: QueryStatus.fulfilled },
        },
      },
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    userEvent.click(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    // Change Default Sport to Swimming
    const allTime = screen.getByText(/All Time/i);
    userEvent.click(allTime);
    const thisYear = await screen.findByText(/This Year/i);
    userEvent.click(thisYear);
    // Waiting for the options to not be seen ensures that they dont render when the User Preferences Reloads
    await waitFor(() => {
      const element = screen.queryByText(/This Month/i);
      expect(element).toBeNull();
    });

    // Close Modal
    userEvent.click(screen.getByTestId('userpreferences-closebutton'));
    await waitFor(() => {
      const element = screen.queryByText(/SRG User Settings/i);
      expect(element).toBeNull();
    });

    // Revisit User Preferences
    userEvent.click(screen.getByText(/User Preferences/i));
    await screen.findByText(/SRG User Settings/i);
    // Check that Running is still the Default Option
    expect(screen.getByText(/All Time/i)).toBeInTheDocument();
  });

  test('Destroy  User Settings Button should be disabled when Danger Area is closed and enabled when it is open', async () => {
    renderWithState({
      entriesApi: {
        queries: {
          'getAllEntries(null)': { status: QueryStatus.fulfilled },
        },
      },
    });
    await screen.findByText(/James/i);
    const userPreferencesLink = screen.getByText(/User Preferences/i);
    // Click User Preferences
    userEvent.click(userPreferencesLink);
    await screen.findByText(/SRG User Settings/i);
    expect(screen.getByText(/Destroy All User Information/i)).toBeDisabled();
    userEvent.click(screen.getByText(/Danger Zone/i));
    await waitFor(() => {
      expect(
        screen.getByText(/Destroy All User Information/i)
      ).not.toBeDisabled();
    });
  });
});
