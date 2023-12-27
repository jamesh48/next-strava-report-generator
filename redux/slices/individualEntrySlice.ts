import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { CurrentActivity } from '../../components/StravaEntries/EntryTypes';

type Athlete = { firstname: string; lastname: string };
export const individualEntrySlice = createApi({
  tagTypes: ['IndividualEntry'],
  reducerPath: 'individualEntriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getIndividualEntry: builder.query<CurrentActivity, number>({
      providesTags: ['IndividualEntry'],
      query: (entryid) => ({ url: '/individualEntry', params: { entryid } }),
    }),
    getKudoers: builder.query<
      {
        kudos: Athlete[];
        comments: {
          text: string;
          athlete: Athlete;
        }[];
      },
      number
    >({
      query: (entryid) => ({ url: '/kudoers', params: { entryid } }),
    }),
    updateIndividualEntry: builder.mutation<
      string,
      {
        activityId: number;
        name: string;
        description: string;
      }
    >({
      invalidatesTags: ['IndividualEntry'],
      query: (event) => ({
        method: 'GET',
        url: 'putActivityUpdate',
        params: event,
      }),
    }),
  }),
});

export const {
  useLazyGetIndividualEntryQuery,
  useLazyGetKudoersQuery,
  useUpdateIndividualEntryMutation,
} = individualEntrySlice;
