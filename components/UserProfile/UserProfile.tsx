import React from 'react';
import UserNameSection from './UserNameSection';
import RunningTotals from './RunningTotals';
import SwimmingTotals from './SwimmingTotals';
import { ProfileData } from './UserProfileTypes';
import Image from 'next/image';
import { fetchUserData } from '../../lib/FetchUser';
import style from '../../styles/App.module.scss';
import { Box } from '@mui/material';
import { useCSX } from '../GlobalStore/globalUtils';

const Profile: React.FC<{}> = () => {
  const [rateLimit, setRateLimit] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState({
    profile: '',
    firstname: '',
    lastname: '',
    city: '',
    state: '',
    country: '',
    ytd_run_totals: {
      distance: 0,
      count: 0,
      elapsed_time: 0,
    },
    ytd_swim_totals: {
      distance: 0,
      count: 0,
      elapsed_time: 0,
    },
  });
  React.useEffect(() => {
    async function fetchUser() {
      const incomingUserProfile: ProfileData & number = await fetchUserData();
      if (incomingUserProfile === 429) {
        setRateLimit(true);
      } else {
        setUserProfile(incomingUserProfile);
      }
    }
    fetchUser();
  }, []);

  const userProfileCSX = useCSX(
    { flexDirection: 'row' },
    { flexDirection: 'column', alignItems: 'center' }
  );

  return (
    (!rateLimit && userProfile?.profile && (
      <Box
        id={style.userProfile}
        sx={{
          textRendering: 'geometricPrecision',
          display: 'flex',
          margin: '2.5% 0',
          width: '95%',
          backgroundColor: '#52fff3',
          border: '1px solid orangered',
          borderTop: 'none',
          borderLeft: 'none',
          boxShadow: '2.5px 2.5px 5px 0px orangered',
          ...userProfileCSX,
        }}
      >
        <Image
          height="250"
          width="250"
          alt="profile-picture"
          src={userProfile.profile}
        ></Image>
        <UserNameSection profile={userProfile} />
        <RunningTotals profile={userProfile} />
        <SwimmingTotals profile={userProfile} />
      </Box>
    )) || (
      <Box
        id={style.userProfile}
        sx={{
          textRendering: 'geometricPrecision',
          display: 'flex',
          margin: '2.5% 0',
          width: '95%',
          backgroundColor: '#52fff3',
          border: '1px solid orangered',
          borderTop: 'none',
          borderLeft: 'none',
          boxShadow: '2.5px 2.5px 5px 0px orangered',
          ...userProfileCSX,
        }}
      >
        <Box
          id={style.rateLimitContainer}
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
              color: 'orangered',
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
    )
  );
};
export default Profile;
