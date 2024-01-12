import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useCSX } from '@lib';
import { YTDSwimTotals } from './UserProfileTypes';
import ActivityChart from './ActivityChart';

export interface SwimmingTotalsProps {
  profile: {
    ytd_swim_totals: YTDSwimTotals;
  };
}

const SwimmingTotals = ({
  profile: { ytd_swim_totals },
}: SwimmingTotalsProps) => {
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
        paddingLeft: '5px',
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
        sx={{
          textDecoration: 'underline',
          cursor: 'default',
          marginY: 1,
        }}
        color={theme.palette.strava.main}
      >
        Year-To-Date Swim Totals
      </Typography>
      <Typography
        variant="h6"
        className="ytdDescriptor"
        sx={{ cursor: 'default', marginY: 1 }}
        color={theme.palette.strava.main}
      >
        Number of Swims: {ytd_swim_totals.count}
      </Typography>
      <Typography
        variant="h6"
        className="ytdDescriptor"
        sx={{ cursor: 'default', marginY: 1 }}
        color={theme.palette.strava.main}
      >
        Total Distance: {ytd_swim_totals.distance} Meters
      </Typography>
      <Typography
        variant="h6"
        className="ytdDescriptor"
        sx={{ cursor: 'default', marginY: 1 }}
        color={theme.palette.strava.main}
      >
        {`Average Speed: `}
        {ytd_swim_totals.count !== 0
          ? (ytd_swim_totals.distance / ytd_swim_totals.elapsed_time).toFixed(2)
          : 0}{' '}
        Meters per Second
      </Typography>
      <ActivityChart activityType="Swim" />
    </Box>
  );
};

export default SwimmingTotals;
