import React from 'react';
import { Box, Typography } from '@mui/material';

interface UserNameSectionProps {
  profile: {
    firstname: string;
    lastname: string;
    city: string;
    state: string;
    country: string;
  };
}

const UserNameSection = (props: UserNameSectionProps) => {
  return (
    <Box
      className="profileBoxes"
      id="userInfo"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.6,
        color: 'orangered',
        borderLeft: 'none',
      }}
    >
      <Typography variant="h4" id="userName" sx={{ cursor: 'default' }}>
        {props.profile.firstname} {props.profile.lastname}
      </Typography>
      <Typography id="userLocation" variant="h5" sx={{ cursor: 'default' }}>
        {props.profile.city}, {props.profile.state} {props.profile.country}
      </Typography>
    </Box>
  );
};

export default UserNameSection;
