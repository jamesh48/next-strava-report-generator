import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useCSX } from '@lib';
import { YTDRunTotals } from './UserProfileTypes';
import ActivityChart from './ActivityChart';

export interface RunningTotalsProps {
  profile: {
    ytd_run_totals: YTDRunTotals;
  };
}

const RunningTotals = (props: RunningTotalsProps) => {
  const theme = useTheme();
  return (
    <Box
      className="ytdTotals profileBoxes"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: theme.palette.mainBackground.main,
        paddingLeft: '.25rem',
        ...useCSX(
          '1px solid ' + theme.palette.strava.contrastColor,
          'none',
          'borderLeft'
        ),
      }}
    >
      <Typography
        variant="h6"
        className="ytdTotalsTitle"
        color={theme.palette.strava.main}
        sx={{
          textDecoration: 'underline',
          cursor: 'default',
          marginY: 1,
        }}
      >
        Year-To-Date Run Totals
      </Typography>
      <Typography
        variant="h6"
        className="ytdDescriptor"
        sx={{ cursor: 'default', marginY: 1 }}
        color={theme.palette.strava.main}
      >
        Number of Runs: {props.profile.ytd_run_totals.count}
      </Typography>
      <Typography
        variant="h6"
        className="ytdDescriptor"
        color={theme.palette.strava.main}
        sx={{ cursor: 'default', marginY: 1 }}
      >
        Total Distance: {props.profile.ytd_run_totals.distance} Meters
      </Typography>
      <Typography
        variant="h6"
        className="ytdDescriptor"
        sx={{ cursor: 'default', marginY: 1 }}
        color={theme.palette.strava.main}
      >
        {`Average Speed: `}
        {props.profile.ytd_run_totals.count === 0
          ? 0
          : (
              props.profile.ytd_run_totals.distance /
              props.profile.ytd_run_totals.elapsed_time
            ).toFixed(2)}{' '}
        Meters per Second
      </Typography>
      <ActivityChart activityType="Run" />
    </Box>
  );
};

export default RunningTotals;
