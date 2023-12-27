import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { Entry } from '../../components/StravaEntries/EntryTypes';

export const entriesApi = createApi({
  reducerPath: 'entriesApi',
  tagTypes: ['Activities'],
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getAllEntries: builder.query<Entry[], null>({
      query: () => ({ url: '/allEntries' }),
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
