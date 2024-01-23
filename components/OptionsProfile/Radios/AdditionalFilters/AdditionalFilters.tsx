import React from 'react';

import {
  Box,
  Checkbox,
  OutlinedInput,
  SxProps,
  Theme,
  useTheme,
} from '@mui/material';
import { useCSX } from '@lib';
import { useDispatch, useSelector } from '@redux/reduxHooks';
import {
  getDateCondition,
  setFromDateQuery,
  setAchievementsOnlyCondition,
  setToDateQuery,
} from '@redux/slices';

const muiAdditionalFilterContainerSx: (
  sxProps: SxProps,
  theme: Theme
) => SxProps = (sxProps, theme) => ({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  '&:first-of-type': {
    borderRight: '1px solid ' + theme.palette.strava.main,
  },
  '&:last-of-type': {
    borderLeft: '1px solid ' + theme.palette.strava.main,
  },
  ...sxProps,
});

const muiAdditionalFilterSx = (theme: Theme) => ({
  backgroundColor: theme.palette.mainBackground.accent,
  color: theme.palette.strava.contrastText,
  border: '1px solid ' + theme.palette.strava.main,
  // height: 'auto',
  textAlign: 'center',
  height: '2rem',
  '&::placeholder': {
    color: theme.palette.strava.contrastText,
  },
});

const muiDateFilterSx: (sxProps: SxProps, theme: Theme) => SxProps = (
  sxProps,
  theme
) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  label: {
    color: theme.palette.strava.main,
    display: 'flex',
    flex: 0.25,
    height: '75%',
    marginY: '.5rem',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  ...sxProps,
});

interface AdditionalFilterProps {
  setTitleQuery: React.ChangeEventHandler<HTMLInputElement>;
  titleQuery: string;
}

const AdditionalFilters = (props: AdditionalFilterProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const mobileStyleContainer = useCSX('row', 'column', 'flexDirection');
  const mobileStyleInput = useCSX('unset', '.5rem', 'padding');
  const [fromDateQuery, toDateQuery] = useSelector(getDateCondition);

  const handleFromDateQueryChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    dispatch(setFromDateQuery(event.currentTarget.value));
  };

  const handleToDateQueryChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    dispatch(setToDateQuery(event.currentTarget.value));
  };

  return (
    <Box
      className="additionalFilters"
      sx={{
        backgroundColor: theme.palette.mainBackground.main,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '95%',
        margin: '2.5% auto 0 auto',
        padding: '.5% 0',
        borderTop: 'none',
        borderLeft: 'none',
        border: '1px solid ' + theme.palette.strava.main,
        boxShadow: '2.5px 2.5px 5px 0px ' + theme.palette.strava.main,
        ...mobileStyleContainer,
      }}
    >
      <Box
        className="additionalFilterContainer"
        sx={muiAdditionalFilterContainerSx(mobileStyleContainer, theme)}
      >
        <Box
          className="dateFilter"
          sx={muiDateFilterSx(mobileStyleInput, theme)}
        >
          <label>From...</label>
          <OutlinedInput
            className="additionalFilter"
            type="date"
            value={fromDateQuery}
            onChange={handleFromDateQueryChange}
            sx={muiAdditionalFilterSx(theme)}
          />
        </Box>
        <Box
          className="dateFilter"
          sx={muiDateFilterSx(mobileStyleInput, theme)}
        >
          <label>To...</label>
          <OutlinedInput
            className="additionalFilter"
            type="date"
            value={toDateQuery}
            onChange={handleToDateQueryChange}
            sx={muiAdditionalFilterSx(theme)}
          />
        </Box>
      </Box>
      <Box
        className="additionalFilterContainer"
        sx={muiAdditionalFilterContainerSx(mobileStyleContainer, theme)}
      >
        <Box
          className="dateFilter"
          sx={muiDateFilterSx(mobileStyleInput, theme)}
        >
          <OutlinedInput
            className="additionalFilter"
            placeholder="Title Includes..."
            onChange={props.setTitleQuery}
            value={props.titleQuery}
            type="text"
            sx={muiAdditionalFilterSx(theme)}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          ...muiAdditionalFilterContainerSx(mobileStyleContainer, theme),
        }}
      >
        <label style={{ color: theme.palette.strava.main }}>
          Show Activities with Achievements Only?
        </label>
        <Checkbox
          sx={{ color: theme.palette.strava.main }}
          aria-label="Achievements Only"
          onChange={(_e, checked) =>
            dispatch(setAchievementsOnlyCondition(checked))
          }
        />
      </Box>
    </Box>
  );
};

export default AdditionalFilters;
