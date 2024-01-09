import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { CurrentActivity } from '@components/StravaEntries/EntryTypes';
import { entriesApi } from './entriesSlice';

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
        method: 'POST',
        url: '/putActivityUpdate',
        body: event,
      }),
      // Optimistic Update for the new Activity Name
      onQueryStarted: async (payload, { dispatch, queryFulfilled }) => {
        dispatch(
          individualEntrySlice.util.updateQueryData(
            'getIndividualEntry',
            payload.activityId,
            (draft) => {
              draft.description = payload.description;
            }
          )
        );
        dispatch(
          entriesApi.util.updateQueryData('getAllEntries', null, (draft) => {
            const draftIndex = draft.findIndex((existingActivity) => {
              return (
                String(existingActivity.activityId) ===
                String(payload.activityId)
              );
            });

            draft[draftIndex].name = payload.name;
          })
        );

        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
          // Refetch all Activities on Failure
          dispatch(entriesApi.util.invalidateTags(['Activities']));
        }
      },
    }),
  }),
});

export const {
  useLazyGetIndividualEntryQuery,
  useLazyGetKudoersQuery,
  useUpdateIndividualEntryMutation,
} = individualEntrySlice;
