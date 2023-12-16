import React from 'react';
import UserNameSection from './UserNameSection';
import RunningTotals from './RunningTotals';
import SwimmingTotals from './SwimmingTotals';
import { ProfileData } from './UserProfileTypes';
import Image from 'next/image';
import { fetchUserData } from '../../lib/FetchUser';
import style from '../../styles/App.module.scss';
import { Box } from '@mui/material';

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
  return (
    //@ts-ignore
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
        }}
      >
        <div id={style.rateLimitContainer}>
          <span className="rate-limit-message">
            Collective Rate Limit Exceeded
          </span>
          <span className="rate-limit-message">Come again tomorrow champ</span>
        </div>
      </Box>
    )
  );
};
export default Profile;
