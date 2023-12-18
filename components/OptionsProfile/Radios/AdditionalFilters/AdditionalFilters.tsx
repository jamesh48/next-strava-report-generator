import React from 'react';

import { Box, OutlinedInput, SxProps } from '@mui/material';

const muiAdditionalFilterContainerSx: SxProps = {
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  '&:first-of-type': {
    borderRight: '1px solid orangered',
  },
};

const muiAdditionalFilterSx: SxProps = {
  backgroundColor: 'deepskyblue',
  color: 'ivory',
  border: '1px solid orangered',
  // height: 'auto',
  padding: '.25% 0',
  textAlign: 'center',
  height: '2rem',
  '&::placeholder': {
    color: 'white',
  },
};

const muiDateFilterSx: SxProps = {
  display: 'flex',
  flex: 0.25,
  label: {
    color: 'orangered',
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
};

interface AdditionalFilterProps {
  setTitleQuery: React.ChangeEventHandler<HTMLInputElement>;
  setFromDateQuery: React.ChangeEventHandler<HTMLInputElement>;
  setToDateQuery: React.ChangeEventHandler<HTMLInputElement>;
  titleQuery: string;
}

const AdditionalFilters = (props: AdditionalFilterProps) => {
  return (
    <Box
      className="additionalFilters"
      sx={{
        backgroundColor: '#52fff3',
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '95%',
        margin: '2.5% auto 0 auto',
        padding: '.5% 0',
        border: '1px solid orangered',
        borderTop: 'none',
        borderLeft: 'none',
        boxShadow: '2.5px 2.5px 5px 0px orangered',
      }}
    >
      <Box
        className="additionalFilterContainer"
        sx={muiAdditionalFilterContainerSx}
      >
        <Box className="dateFilter" sx={muiDateFilterSx}>
          <label>From...</label>
          <OutlinedInput
            className="additionalFilter"
            type="date"
            onChange={props.setFromDateQuery}
            sx={muiAdditionalFilterSx}
          />
        </Box>
        <Box className="dateFilter" sx={muiDateFilterSx}>
          <label>To...</label>
          <OutlinedInput
            className="additionalFilter"
            type="date"
            onChange={props.setToDateQuery}
            sx={muiAdditionalFilterSx}
          />
        </Box>
      </Box>
      <Box
        className="additionalFilterContainer"
        sx={muiAdditionalFilterContainerSx}
      >
        <OutlinedInput
          className="additionalFilter"
          placeholder="Title Includes..."
          onChange={props.setTitleQuery}
          value={props.titleQuery}
          type="text"
          sx={muiAdditionalFilterSx}
        />
      </Box>
    </Box>
  );
};

export default AdditionalFilters;
