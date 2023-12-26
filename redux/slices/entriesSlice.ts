import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { Entry } from '../../components/StravaEntries/EntryTypes';

export const entriesSlice = createApi({
  reducerPath: 'entriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getAllEntries: builder.query<Entry[], null>({
      query: () => ({ url: '/allEntries' }),
    }),
  }),
});

export const { useGetAllEntriesQuery } = entriesSlice;
