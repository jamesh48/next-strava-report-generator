import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { Entry, Sport } from '@components/StravaEntries/EntryTypes';
import { formatElapsedTime } from '@lib';

interface TQueryListResponse<T> {
  items: T[];
  count: number;
  lastKey?: { activityId: string; athleteId: string };
}
export const entriesApi = createApi({
  reducerPath: 'entriesApi',
  tagTypes: ['Activities'],
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getAllEntries: builder.query<
      TQueryListResponse<Entry>,
      {
        limit?: number;
        activityType: Sport
        lastKey: string | null;
      }
    >({
      query: ({ limit = 50, activityType, lastKey }) => ({
        url: '/allEntries',
        params: {
          limit,
          activityType,
          lastKey,
        },
      }),
      transformResponse: (response: TQueryListResponse<Entry>) => {
        response = {
          ...response,
          items: response.items.map((item) => ({
            ...item,
            elapsed_time: formatElapsedTime(item.elapsed_time),
          })),
        };
        return response;
      },
      providesTags: ['Activities'],
    }),
    addAllActivities: builder.mutation<null, null>({
      query: () => ({ url: '/addAllActivities', method: 'POST' }),
      invalidatesTags: ['Activities'],
    }),
    destroyUserAndActivities: builder.mutation<null, null>({
      query: () => ({ url: '/destroyUser', method: 'POST' }),
      invalidatesTags: ['Activities'],
    }),
  }),
});

export const {
  useGetAllEntriesQuery,
  useAddAllActivitiesMutation,
  useDestroyUserAndActivitiesMutation,
} = entriesApi;
