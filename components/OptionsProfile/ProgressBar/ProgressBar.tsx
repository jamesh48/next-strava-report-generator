import React, { useState, useEffect } from 'react';
import {
  Box,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  SxProps,
} from '@mui/material';
import { useInterval } from '@lib';
import { useDispatch, useSelector } from '@redux/reduxHooks';
import {
  setSortCondition,
  getSortCondition,
  useAddAllActivitiesMutation,
  useDestroyUserAndActivitiesMutation,
  completeProgressBarProgress,
  getProgressBarProgress,
  incrementProgressBarProgress,
  resetProgressBarProgress,
  useGetAllEntriesQuery,
} from '@redux/slices';

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
    cursor: 'pointer',
  },
};

// time it takes to delete one dynamodb record in ms
const dynamoDBDeletionRatePerRecord = 110;

const ProgressBar = () => {
  const [deletionRate, setDeletionRate] = useState(75);
  const dispatch = useDispatch();
  const { data: allEntries } = useGetAllEntriesQuery(null);
  const sortCondition = useSelector(getSortCondition);
  useEffect(() => {
    const numberOfEntries = allEntries?.length;
    if (numberOfEntries) {
      const currentDeletionRate =
        (numberOfEntries * dynamoDBDeletionRatePerRecord) / 100;
      setDeletionRate(currentDeletionRate);
    }
  }, [allEntries?.length]);

  const progressBarProgress = useSelector(getProgressBarProgress);
  const [
    addAllActivities,
    {
      isSuccess: isSuccessAdd,
      isLoading: isLoadingAdd,
      isUninitialized: isUninitializedAdd,
    },
  ] = useAddAllActivitiesMutation();
  const [
    _,
    {
      isSuccess: isSuccessDestroy,
      isLoading: isLoadingDestroy,
      isUninitialized: isUninitializedDestroy,
    },
  ] = useDestroyUserAndActivitiesMutation({
    fixedCacheKey: 'destroy-user-key',
  });

  useInterval(
    () => {
      if (isSuccessAdd) {
        dispatch(completeProgressBarProgress());
        setTimeout(() => {
          dispatch(resetProgressBarProgress());
        }, 750);
      } else if (isLoadingAdd) {
        dispatch(incrementProgressBarProgress(progressBarProgress));
      }
    },
    isSuccessAdd || isUninitializedAdd ? -1 : 75
  );

  useInterval(
    () => {
      if (isSuccessDestroy) {
        dispatch(completeProgressBarProgress());
        setTimeout(() => {
          dispatch(resetProgressBarProgress());
          window.location.reload();
        }, 1000);
      } else if (isLoadingDestroy) {
        dispatch(incrementProgressBarProgress(progressBarProgress));
      }
    },
    isSuccessDestroy || isUninitializedDestroy ? -1 : deletionRate
  );

  const fillerStyles = {
    width: `${progressBarProgress}%`,
  };

  const updateEntries: () => Promise<void> = async () => {
    await addAllActivities(null);
  };

  const setSortConditionCallback = (event: SelectChangeEvent) => {
    dispatch(setSortCondition(event.target.value));
  };

  return progressBarProgress === 0 ? (
    <Box className="updateButtonContainer" sx={muiUpdateButtonContainerSx}>
      {sortCondition ? (
        <Select
          className="updateButton"
          onChange={setSortConditionCallback}
          sx={muiUpdateButtonSx}
          value={sortCondition || 'speedDesc'}
        >
          <MenuItem value="speedDesc">Speed: Fastest First</MenuItem>
          <MenuItem value="dateDesc">Date: Most Recent</MenuItem>
          <MenuItem value="dateAsc">Date: Least Recent</MenuItem>
          <MenuItem value="movingTimeDesc">Moving Time: Longest First</MenuItem>
          <MenuItem value="movingTimeAsc">Moving Time: Shortest First</MenuItem>
          <MenuItem value="timeElapsedDesc">
            Time Elapsed: Longest First
          </MenuItem>
          <MenuItem value="timeElapsedAsc">
            Time Elapsed: Shortest First
          </MenuItem>
        </Select>
      ) : (
        <Box sx={{ ...muiUpdateButtonSx, height: '1rem', width: '1rem' }} />
      )}
      <OutlinedInput
        type="button"
        className="updateButton"
        value="Update!"
        onClick={updateEntries}
        sx={muiUpdateButtonSx}
        inputProps={{ sx: { cursor: 'pointer' } }}
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
