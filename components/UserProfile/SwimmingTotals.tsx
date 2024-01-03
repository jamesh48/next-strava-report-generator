import React from 'react';
import { Box, Typography } from '@mui/material';
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
  return (
    <Box
      className="ytdTotals profileBoxes"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#52fff3',
        paddingLeft: '5px',
        ...useCSX('1px solid coral', 'none', 'borderLeft'),
      }}
    >
      <Typography
        variant="h6"
        className="ytdTotalsTitle"
        sx={{
          color: 'orangered',
          textDecoration: 'underline',
          cursor: 'default',
        }}
      >
        Year-To-Date Swim Totals
      </Typography>
      <Typography className="ytdDescriptor" sx={{ cursor: 'default' }}>
        Number of Swims: {ytd_swim_totals.count}
      </Typography>
      <Typography className="ytdDescriptor" sx={{ cursor: 'default' }}>
        Total Distance: {ytd_swim_totals.distance} Meters
      </Typography>
      <Typography className="ytdDescriptor" sx={{ cursor: 'default' }}>
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
