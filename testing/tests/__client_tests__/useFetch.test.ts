import { renderHook, waitFor } from '@testing-library/react';
import userSettings from '@testing/MSW/jsonPayloads/userSettings.json';
import { useFetchData } from '@lib';

describe('useFetchData tests', () => {
  test('useFetchData hook handles errors', async () => {
    const { result } = renderHook(() =>
      useFetchData<{
        defaultFormat: string;
        defaultSport: string;
        defaultDate: string;
      }>('/api/userSettings')
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.data).toStrictEqual(userSettings);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toStrictEqual(userSettings);
  });
});
