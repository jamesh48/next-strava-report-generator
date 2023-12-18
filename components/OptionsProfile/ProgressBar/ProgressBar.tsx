import React from 'react';
import axios from 'axios';
import {
  Box,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  SxProps,
} from '@mui/material';
import { useProgressBarProgressStore } from './useProgressBarProgress';
import { useInterval } from './useInterval';
import { useGlobalContext } from '../../GlobalStore/globalStore.js';

const muiUpdateButtonContainerSx: SxProps = {
  minHeight: '5vmax',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '95%',
};

const muiUpdateButtonSx: SxProps = {
  cursor: 'pointer',
  textRendering: 'geometricPrecision',
  backgroundColor: '#52fff3',
  color: 'orangered',
  border: '2px solid coral',
  boxShadow: '0 0 5px coral',
  padding: '0.5vmax 1vmax',
  minWidth: '10%',
  margin: '0 0.5vmax',
  height: '3rem',
  '&:hover': {
    backgroundColor: 'coral',
    color: 'ivory',
    border: '2px solid ivory',
  },
};

const ProgressBar = () => {
  const [{ isLoaded }, globalDispatch] = useGlobalContext();
  const {
    progressBarProgress,
    incrementProgressBarProgress,
    completeProgressBarProgress,
    resetProgressBarProgress,
  } = useProgressBarProgressStore((state) => state);

  useInterval(
    () => {
      if (isLoaded) {
        completeProgressBarProgress();
        setTimeout(() => {
          resetProgressBarProgress();
        }, 750);
      } else if (isLoaded === false) {
        incrementProgressBarProgress();
      }
    },
    isLoaded === true || isLoaded === null ? -1 : 75
  );

  const fillerStyles = {
    width: `${progressBarProgress}%`,
  };

  const updateEntries: () => Promise<void> = async () => {
    globalDispatch({ type: 'TOGGLE LOADED OFF' });
    const { data: allActivities } = await axios({
      url: '/api/addAllActivities',
      method: 'POST',
    });
    globalDispatch({ type: 'TOGGLE LOADED ON' });
    globalDispatch({
      type: 'SET TOTAL ENTRIES',
      payload: allActivities,
    });
  };

  const setSortCondition = (event: SelectChangeEvent) => {
    globalDispatch({
      type: 'SET SORT CONDITION',
      payload: event.target.value,
    });
  };

  const destroyUser: React.MouseEventHandler<HTMLInputElement> = async () => {
    globalDispatch({ type: 'TOGGLE LOADED OFF' });
    const { data } = await axios({ url: '/api/destroyUser', method: 'GET' });

    globalDispatch({ type: 'TOGGLE LOADED ON' });
    if (data === 'deleted') {
      globalDispatch({
        type: 'SET TOTAL ENTRIES',
        payload: [],
      });
    }
  };

  return progressBarProgress === 0 ? (
    <Box className="updateButtonContainer" sx={muiUpdateButtonContainerSx}>
      <Select
        className="updateButton"
        onChange={setSortCondition}
        sx={muiUpdateButtonSx}
        defaultValue="speedDesc"
      >
        <MenuItem value="speedDesc">Speed: Fastest First</MenuItem>
        <MenuItem value="dateDesc">Date: Most Recent</MenuItem>
        <MenuItem value="dateAsc">Date: Least Recent</MenuItem>
        <MenuItem value="movingTimeDesc">Moving Time: Longest First</MenuItem>
        <MenuItem value="movingTimeAsc">Moving Time: Shortest First</MenuItem>
        <MenuItem value="timeElapsedDesc">Time Elapsed: Longest First</MenuItem>
        <MenuItem value="timeElapsedAsc">Time Elapsed: Shortest First</MenuItem>
      </Select>
      <OutlinedInput
        type="button"
        className="updateButton"
        value="Update!"
        onClick={updateEntries}
        sx={muiUpdateButtonSx}
      />
      <OutlinedInput
        type="button"
        className="updateButton"
        value="Destroy!"
        onClick={destroyUser}
        sx={muiUpdateButtonSx}
      />
    </Box>
  ) : (
    <Box className="updateButtonContainer" sx={muiUpdateButtonContainerSx}>
      <Box
        id="progressBarContainer"
        sx={{
          width: '95%',
          border: '1px solid coral',
          boxShadow: '0 0 5px ccoral',
          backgroundColor: 'coral',
          borderRadius: '50px',
          margin: '1% 2.5%',
        }}
      >
        <Box
          className="progressBarFiller"
          style={fillerStyles}
          sx={{
            height: '100%',
            background: `linear-gradient(
              99deg,
              rgba(73, 81, 255, 1) 15%,
              rgba(0, 241, 255, 1) 42%,
              rgba(21, 221, 51, 1) 100%)`,
            borderRadius: 'inherit',
            textAlign: 'right',
            transition: 'width 0.1s ease-in-out',
          }}
        >
          <Box
            className="progressBarCounter"
            sx={{ padding: 5, color: 'ivory', fontWeight: 900 }}
          >{`${progressBarProgress}%`}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressBar;
