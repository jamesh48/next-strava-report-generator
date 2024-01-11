import React, { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import UserSettings from './UserSettings';

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
  const theme = useTheme();
  const [showPreferences, setShowPreferences] = useState(false);

  const closeUserSettingsCB = () => {
    setShowPreferences(false);
  };

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
        borderLeft: 'none',
      }}
    >
      <Typography
        variant="h4"
        id="userName"
        color={theme.palette.strava.main}
        sx={{
          cursor: 'default',
          textAlign: 'center',
        }}
      >
        {props.profile.firstname} {props.profile.lastname}
      </Typography>
      <Typography
        id="userLocation"
        variant="h5"
        sx={{ cursor: 'default', textAlign: 'center' }}
        color={theme.palette.strava.main}
      >
        {props.profile.city}, {props.profile.state} {props.profile.country}
      </Typography>
      {/* {showPreferencesButton ? ( */}
      <Box
        sx={{
          mt: '1rem',
          bottom: '1.5rem',
        }}
      >
        <Button
          sx={{
            height: '1.5rem',
            transition: 'right 2s ease-in-out',
            right: '0rem',
            zIndex: 4,
          }}
          onClick={() => setShowPreferences(true)}
        >
          <Typography
            sx={{
              transition: 'font-style 2s ease-in-out',
              fontSize: '.75rem',
            }}
          >
            User Preferences
          </Typography>
        </Button>
      </Box>
      {/* ) : (
        <Box
          sx={{
            mt: '1rem',
            bottom: '1.5rem',
          }}
        >
          <Button
            sx={{
              height: '1.5rem',
              transition: 'right 2s ease-in-out',
              right: '200%',
              zIndex: 4,
            }}
          >
            <Typography
              sx={{
                transition: 'font-style 2s ease-in-out',
                fontStyle: 'italic',
              }}
            >
              User Preferences
            </Typography>
          </Button>
        </Box>
      )} */}
      {showPreferences && (
        <UserSettings closeUserSettingsCB={closeUserSettingsCB} />
      )}
    </Box>
  );
};

export default UserNameSection;
