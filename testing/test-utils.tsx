import React, { ReactNode } from 'react';
import { act, render as rtlRender } from '@testing-library/react';
import { AnyAction } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import GlobalStore, { RootState } from '@redux/store';
import userEvent from '@testing-library/user-event';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type TestState = DeepPartial<RootState>;
export type TestActions = AnyAction | AnyAction[];

interface RenderProps {
  preloadedState?: TestState;
  actions?: TestActions;
}

/**
 * Re-wraps the test component with theme and store provider so that you can pass in
 * your own initial state when testing.

 * The key passed in to the preloadedState object should match
 * the name used in the Root Reducer file ("map" in the below example)
 * `render (<EventForm />, { preloadedState: {map: mapTestState}})`
 */
function render(
  ui: JSX.Element,
  { preloadedState = {}, actions, ...renderOptions }: RenderProps = {}
) {
  // const modifiedTheme = theme(true);
  // modifiedTheme.transitions.create = () => 'none';
  GlobalStore.prototype.configureGlobalStore({
    ...preloadedState,
  });
  const testStore = GlobalStore.prototype.getStore();
  if (actions) {
    if (Array.isArray(actions)) {
      actions.forEach((action) => {
        testStore.dispatch(action);
      });
    } else {
      testStore.dispatch(actions);
    }
  }

  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return <Provider store={testStore}>{children}</Provider>;
  }
  return rtlRender(ui, {
    wrapper: Wrapper as React.ComponentType,
    ...renderOptions,
  });
}

export const actClick = async (selector: Element) => {
  await act(async () => {
    userEvent.click(selector);
  });
};

export * from '@testing-library/react';
export { render };
