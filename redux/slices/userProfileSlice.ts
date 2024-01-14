import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

export interface UserProfile {
  id: number;
  profile: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
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

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { RootState } from '@redux/store';

// export const userInitialState: { x: UserProfile } = {
//   x: {
//     id: 0,
//     profile: '',
//     firstname: '',
//     lastname: '',
//     city: '',
//     state: '',
//     country: '',
//     ytd_run_totals: {
//       distance: 0,
//       count: 0,
//       elapsed_time: 0,
//     },
//     ytd_swim_totals: {
//       distance: 0,
//       count: 0,
//       elapsed_time: 0,
//     },
//   },
// };

// export const userProfileSlice = createSlice({
//   name: 'user',
//   initialState: userInitialState,
//   reducers: {
//     setUserProfile: (state, action: PayloadAction<UserProfile>) => {
//       state.x = action.payload;
//     },
//   },
// });

// export const { setUserProfile } = userProfileSlice.actions;

// export const getUserProfile = (state: RootState) => state.userProfile.x;
// export const getAthleteId = (state: RootState) => state.userProfile.x.id;

// export default userProfileSlice.reducer;
