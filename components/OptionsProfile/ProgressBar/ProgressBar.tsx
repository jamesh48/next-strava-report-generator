import React, { useState, useEffect } from 'react';
import {
  Box,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  SxProps,
} from '@mui/material';
import { useCSX, useInterval } from '@lib';
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
  margin: '1rem 0.5rem',
  height: '3rem',
  '&:hover': {
    backgroundColor: 'coral',
    color: 'ivory',
    border: '2px solid ivory',
    cursor: 'pointer',
  },
};

const menuItemStyles = (indicator: boolean) => ({
  textAlign: 'center !important',
  display: 'flex',
  justifyContent: 'center',
  bgcolor: indicator ? 'turquoise !important' : 'paleturquoise !important',
  color: indicator ? 'orangered' : 'black',
});

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
  const mobileStyleSelect = useCSX('unset', '1', 'flex');
  const mobileStyleUpdateButton = useCSX('unset', '.5', 'flex');

  return progressBarProgress === 0 ? (
    <Box className="updateButtonContainer" sx={muiUpdateButtonContainerSx}>
      {sortCondition ? (
        <Select
          className="updateButton"
          onChange={setSortConditionCallback}
          sx={{
            ...muiUpdateButtonSx,
            ...mobileStyleSelect,
          }}
          value={sortCondition || 'speedDesc'}
        >
          <MenuItem
            value="speedDesc"
            sx={menuItemStyles(sortCondition === 'speedDesc')}
          >
            Speed: Fastest First
          </MenuItem>
          <MenuItem
            value="dateDesc"
            sx={menuItemStyles(sortCondition === 'dateDesc')}
          >
            Date: Most Recent
          </MenuItem>
          <MenuItem
            value="dateAsc"
            sx={menuItemStyles(sortCondition === 'dateAsc')}
          >
            Date: Least Recent
          </MenuItem>
          <MenuItem
            value="movingTimeDesc"
            sx={menuItemStyles(sortCondition === 'movingTimeDesc')}
          >
            Moving Time: Longest First
          </MenuItem>
          <MenuItem
            value="movingTimeAsc"
            sx={menuItemStyles(sortCondition === 'movingTimeAsc')}
          >
            Moving Time: Shortest First
          </MenuItem>
          <MenuItem
            value="timeElapsedDesc"
            sx={menuItemStyles(sortCondition === 'timeElaspedDesc')}
          >
            Time Elapsed: Longest First
          </MenuItem>
          <MenuItem
            value="timeElapsedAsc"
            sx={menuItemStyles(sortCondition === 'timeElaspedAsc')}
          >
            Time Elapsed: Shortest First
          </MenuItem>
        </Select>
      ) : (
        <Box
          sx={{
            ...muiUpdateButtonSx,
            height: '1rem',
            width: '1rem',
          }}
        />
      )}
      <OutlinedInput
        type="button"
        className="updateButton"
        value="Update!"
        onClick={updateEntries}
        sx={{
          ...muiUpdateButtonSx,
          ...mobileStyleUpdateButton,
        }}
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
