import React from 'react';
import Image from 'next/image';
import { Box, Typography, useTheme } from '@mui/material';
//
import UserNameSection from './UserNameSection';
import RunningTotals from './RunningTotals';
import SwimmingTotals from './SwimmingTotals';
// import { ProfileData } from './UserProfileTypes';
import { authorizeApp, useCSX } from '@lib';
import { useGetUserProfileQuery } from '@redux/slices';

const hasStatus = (error: any): error is { status: number } => {
  return typeof error?.status === 'number';
};

const LoadingContainer = () => {
  const userProfileCSX = useCSX(
    { flexDirection: 'row' },
    { flexDirection: 'column', alignItems: 'center' }
  );

  const theme = useTheme();
  return (
    <Box
      id="userProfile"
      sx={{
        textRendering: 'geometricPrecision',
        display: 'flex',
        margin: '2.5% 0',
        width: '95%',
        backgroundColor: theme.palette.mainBackground.main,
        border: '1px solid ' + theme.palette.strava.main,
        borderTop: 'none',
        borderLeft: 'none',
        boxShadow: '2.5px 2.5px 5px 0px ' + theme.palette.strava.main,
        ...userProfileCSX,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          paddingY: '6rem',
          color: theme.palette.strava.main,
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};
const RateLimitContainer = () => {
  const theme = useTheme();
  const userProfileCSX = useCSX(
    { flexDirection: 'row' },
    { flexDirection: 'column', alignItems: 'center' }
  );
  return (
    <Box
      id="userProfile"
      sx={{
        textRendering: 'geometricPrecision',
        display: 'flex',
        margin: '2.5% 0',
        width: '95%',
        borderTop: 'none',
        borderLeft: 'none',
        backgroundColor: theme.palette.mainBackground.main,
        border: '1px solid ' + theme.palette.strava.main,
        boxShadow: '2.5px 2.5px 5px 0px ' + theme.palette.strava.main,
        ...userProfileCSX,
      }}
    >
      <Box
        id="rateLimitContainer"
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          className="rate-limit-message"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            color: theme.palette.strava.main,
            width: '100%',
            padding: '0.5% 0',
            '&:first-of-type': {
              textDecoration: 'underline',
            },
          }}
        >
          Collective Rate Limit Exceeded
        </Box>
        <Box
          className="rate-limit-message"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            color: 'orangered',
            width: '100%',
            padding: '0.5% 0',
            '&:first-of-type': {
              textDecoration: 'underline',
            },
          }}
        >
          Come again tomorrow champ
        </Box>
      </Box>
    </Box>
  );
};

const UserProfile = () => {
  const theme = useTheme();

  const {
    data: userProfile,
    isError,
    error,
    isLoading,
  } = useGetUserProfileQuery(null);

  if (isError && hasStatus(error) && error.status !== 429) {
    authorizeApp();
  }

  const userProfileCSX = useCSX(
    { flexDirection: 'row' },
    { flexDirection: 'column', alignItems: 'center' }
  );

  if (isError && hasStatus(error) && error.status === 429) {
    return <RateLimitContainer />;
  }

  if (isLoading) {
    return <LoadingContainer />;
  }

  return userProfile?.profile ? (
    <Box
      id="userProfile"
      sx={{
        textRendering: 'geometricPrecision',
        display: 'flex',
        margin: '2.5% 0',
        width: '95%',
        backgroundColor: theme.palette.mainBackground.main,
        border: '1px solid ' + theme.palette.strava.main,
        borderTop: 'none',
        borderLeft: 'none',
        boxShadow: '2.5px 2.5px 5px 0px ' + theme.palette.strava.main,
        ...userProfileCSX,
      }}
    >
      <Image
        height="250"
        width="250"
        alt="profile-picture"
        src={userProfile.profile}
        style={{ zIndex: 5 }}
      />
      <UserNameSection profile={userProfile} />
      <RunningTotals profile={userProfile} />
      <SwimmingTotals profile={userProfile} />
    </Box>
  ) : null;
};
export default UserProfile;
