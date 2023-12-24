import React from 'react';
import { Box, Typography } from '@mui/material';
import { useCSX } from '../GlobalStore/globalUtils';
import { YTDRunTotals } from './UserProfileTypes';

export interface RunningTotalsProps {
  profile: {
    ytd_run_totals: YTDRunTotals;
  };
}

const RunningTotals = (props: RunningTotalsProps) => {
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
        Year To Date Run Totals
      </Typography>
      <Typography className="ytdDescriptor" sx={{ cursor: 'default' }}>
        Number of Runs: {props.profile.ytd_run_totals.count}
      </Typography>
      <Typography className="ytdDescriptor" sx={{ cursor: 'default' }}>
        Total Distance: {props.profile.ytd_run_totals.distance} Meters
      </Typography>
      <Typography className="ytdDescriptor" sx={{ cursor: 'default' }}>
        {`Average Speed: `}
        {props.profile.ytd_run_totals.count === 0
          ? 0
          : (
              props.profile.ytd_run_totals.distance /
              props.profile.ytd_run_totals.elapsed_time
            ).toFixed(2)}{' '}
        Meters per Second
      </Typography>
    </Box>
  );
};

export default RunningTotals;
