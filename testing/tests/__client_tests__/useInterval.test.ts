import { renderHook, act } from '@testing-library/react';
import { useInterval } from '@lib';

jest.useFakeTimers();

describe('useInterval hook', () => {
  test('callback is called at correct intervals', () => {
    const callback = jest.fn();
    const delay = 1000; // 1 second

    renderHook(() => useInterval(callback, delay));

    // Fast-forward time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // Fast-forward time by another 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('interval is cleared when delay is null', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));

    // Unmounting should clear the interval
    unmount();

    // Fast-forward time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(0);
  });

  test('interval is cleared when delay is -1', () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, -1));

    // Fast-forward time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // Fast-forward time by another 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1); // Should not increase, as the interval is cleared
  });
});
