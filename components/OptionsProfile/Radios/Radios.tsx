import React from 'react';
import InputJSON from './input.json';
import RadioColumn from '@components/OptionsProfile/Radios/RadioColumn';
import ProgressBar from '@components/OptionsProfile/ProgressBar/ProgressBar';
import AdditionalFilters from './AdditionalFilters/AdditionalFilters';
import { Box, useTheme } from '@mui/material';
import { Format } from '@components/StravaEntries/EntryTypes';
import { useCSX } from '@lib';
import { useGetAllEntriesQuery } from '@redux/slices';

export interface RadiosProps {
  setSport: React.MouseEventHandler<HTMLLabelElement> &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  setDistance: React.MouseEventHandler<HTMLLabelElement> &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  setFormat: React.MouseEventHandler<HTMLLabelElement> &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  setTitleQuery: React.ChangeEventHandler<HTMLInputElement>;
  titleQuery: string;
  sport: string;
  customDistance: boolean;
  distance: number;
  format: Format;
}

const Radios = (props: RadiosProps) => {
  const theme = useTheme();
  const { isSuccess } = useGetAllEntriesQuery(null);
  const initArr = [
    {
      title: 'Choose Sport',
      setCallback: props.setSport,
      radioValues: InputJSON.chooseSportRadios,
    },
    {
      title: 'Choose Distance',
      setCallback: props.setDistance,
      radioValues:
        props.sport === 'Run'
          ? InputJSON.distanceRunRadios
          : props.sport === 'Swim'
          ? InputJSON.distanceSwimRadios
          : props.sport === 'Ride'
          ? InputJSON.distanceRideRadios
          : InputJSON.distanceRunRadios,
      customDistance: props.customDistance,
      distance: props.distance,
    },
    {
      title: 'Choose Format',
      setCallback: props.setFormat,
      radioValues:
        props.sport === 'Run'
          ? InputJSON.formatRunRadios
          : props.sport === 'Swim'
          ? InputJSON.formatSwimRadios
          : props.sport === 'Ride'
          ? InputJSON.formatRideRadios
          : InputJSON.formatRunRadios,
      format: props.format,
    },
  ];

  return (
    <Box
      id="buttonsAndBar"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        id="buttonLayout"
        sx={{
          display: 'flex',
          ...useCSX('row', 'column', 'flexDirection'),
          justifyContent: 'center',
          width: '95%',
          margin: '2.5% auto 0 auto',
          border: '1px solid ' + theme.palette.strava.main,
          borderTop: 'none',
          borderLeft: 'none',
          backgroundColor: theme.palette.mainBackground.main,
          boxShadow: '2.5px 2.5px 5px 0px ' + theme.palette.strava.main,
        }}
      >
        {initArr.map((radioColumn, index) => {
          return (
            <RadioColumn
              key={index}
              {...radioColumn}
              isLoaded={isSuccess}
              format={props.format}
            />
          );
        })}
      </Box>

      <AdditionalFilters
        setTitleQuery={props.setTitleQuery}
        titleQuery={props.titleQuery}
      />
      <ProgressBar />
    </Box>
  );
};

export default Radios;
