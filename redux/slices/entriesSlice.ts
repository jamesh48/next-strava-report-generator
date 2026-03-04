import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import {
  APIEntry,
  Format,
  Sport,
  UIEntry,
} from '@components/StravaEntries/EntryTypes';
import { formatElapsedTime } from '@lib';

interface TQueryListResponse<T> {
  items: T[];
  count: number;
  lastKey?: { activityId: string; athleteId: string };
}

const handleTime = (movingTime: number, pace?: boolean) => {
  if (movingTime !== Infinity) {
    if (pace) {
      return new Date(movingTime * 1000).toISOString().substr(15, 4);
    }
    return new Date(movingTime * 1000).toISOString().substr(11, 8);
  } else {
    return '00:00';
  }
};
export const entriesApi = createApi({
  reducerPath: 'entriesApi',
  tagTypes: ['Activities', 'MonthlyStats'],
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getAllEntries: builder.query<
      TQueryListResponse<UIEntry>,
      {
        limit?: number;
        activityType: Sport;
        lastKey: string | null;
        format: Format;
        beforeDate?: string;
        afterDate?: string;
        hasAchievements?: boolean;
        search: string;
        sortCondition: string;
        minDistance?: number;
      }
    >({
      query: ({
        limit = 50,
        activityType,
        afterDate,
        beforeDate,
        lastKey,
        hasAchievements,
        search,
        sortCondition,
        minDistance,
      }) => ({
        url: '/allEntries',
        params: {
          limit,
          activityType,
          lastKey,
          beforeDate,
          afterDate,
          hasAchievements,
          search,
          sortCondition,
          minDistance,
        },
      }),
      transformResponse: (
        response: TQueryListResponse<APIEntry>,
        _meta,
        arg
      ) => {
        const mps2kph = 3.6;
        const m2y = 1.094;
        const mph = 2.237;

        const uiEntryResponse = {
          ...response,
          items: response.items.map((entry) => ({
            ...entry,
            elapsed_time: formatElapsedTime(entry.elapsed_time),
            max_speed: (() => {
              if (arg.format === 'kph') {
                return `${(Number(entry.max_speed) * mps2kph).toFixed(2)} kph`;
              }

              if (arg.format === 'mph') {
                return `${(Number(entry.max_speed) * mph).toFixed(2)} mph`;
              }

              if (arg.format === 'mps') {
                return `${Number(entry.max_speed).toFixed(2)} mps`;
              }

              return entry.max_speed;
            })(),
            distance: (() => {
              // Swimming
              if (arg.format === 'avgypace') {
                return `${(entry.distance * m2y).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })} Yards`;
              }

              return `${Number(entry.distance).toLocaleString()} Meters`;
            })(),
            average_pace: (() => {
              if (arg.format === 'kph') {
                return `${(
                  (entry.distance / entry.moving_time) *
                  mps2kph
                ).toFixed(2)} kph`;
              }

              if (arg.format === 'mph') {
                return `${((entry.distance / entry.moving_time) * mph).toFixed(
                  2
                )} mph`;
              }

              if (arg.format === 'mps') {
                return `${(entry.distance / entry.moving_time).toFixed(2)} mps`;
              }

              // Swimming Formats
              if (arg.format === 'avgypace') {
                return `${handleTime(
                  entry.moving_time / ((entry.distance * m2y) / 100),
                  true
                )}/100 Yards`;
              }

              if (arg.format === 'avgmpace') {
                return `${handleTime(
                  entry.moving_time / (entry.distance / 100),
                  true
                )}/100 Meters`;
              }

              return '';
            })(),
          })),
        };
        return uiEntryResponse;
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
    getMonthlyStats: builder.query<
      { [key: string]: { count: number; distance: number } },
      { activityType: Sport }
    >({
      query: ({ activityType }) => ({
        url: 'monthlyStats',
        method: 'GET',
        params: { activityType },
      }),
      providesTags: ['MonthlyStats'],
    }),
  }),
});

export const {
  useGetAllEntriesQuery,
  useAddAllActivitiesMutation,
  useDestroyUserAndActivitiesMutation,
  useGetMonthlyStatsQuery,
} = entriesApi;
