import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

interface Shoe {
  name: string;
  primary: boolean;
  id: string;
  retired: boolean;
  nickname: string;
  distance: number;
}
export interface UserProfile {
  id: number;
  profile: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  shoes: Shoe[];
  ytd_run_totals: {
    distance: number;
    count: number;
    elapsed_time: number;
  };
  ytd_swim_totals: {
    distance: number;
    count: number;
    elapsed_time: number;
  };
}

export const userProfileApi = createApi({
  reducerPath: 'userProfile',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, null>({
      query: () => ({ url: '/loggedInUser' }),
    }),
  }),
});

export const { useGetUserProfileQuery } = userProfileApi;
