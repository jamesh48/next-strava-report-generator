import React from 'react';
import style from '../../styles/App.module.scss';
import { RunningTotalsSection as RunningTotalsProps } from './UserProfileTypes';
import { Box } from '@mui/material';
import { useCSX } from '../GlobalStore/globalUtils';

const RunningTotals = ({ profile: { ytd_run_totals } }: RunningTotalsProps) => {
  return (
    <Box
      className={`${style.ytdTotals} ${style.profileBoxes}`}
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
      <h4 className={style.ytdTotalsTitle}>Year To Date Run Totals</h4>
      <p className={style.ytdDescriptor}>
        Number of Runs: {ytd_run_totals.count}
      </p>
      <p className={style.ytdDescriptor}>
        Total Distance: {ytd_run_totals.distance} Meters
      </p>
      <p className={style.ytdDescriptor}>
        {`Average Speed: `}
        {ytd_run_totals.count === 0
          ? 0
          : (ytd_run_totals.distance / ytd_run_totals.elapsed_time).toFixed(
              2
            )}{' '}
        Meters per Second
      </p>
    </Box>
  );
};

export default RunningTotals;
