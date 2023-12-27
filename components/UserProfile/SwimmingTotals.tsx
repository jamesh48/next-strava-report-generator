import React from 'react';
import { Box, Typography } from '@mui/material';
import { useCSX } from '../../lib/globalUtils';
import { YTDSwimTotals } from './UserProfileTypes';

interface SwimmingTotalsSection {
  profile: {
    ytd_swim_totals: YTDSwimTotals;
  };
}

const SwimmingTotals: React.FC<SwimmingTotalsSection> = ({
  profile: { ytd_swim_totals },
}) => {
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
    </Box>
  );
};

export default SwimmingTotals;
