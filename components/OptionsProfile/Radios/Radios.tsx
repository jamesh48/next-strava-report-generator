import React from 'react';
// @ts-ignore
import InputJSON from './input.json';
import RadioColumn from '../Radios/RadioColumn';
import ProgressBar from '../ProgressBar/ProgressBar';
import { useGlobalContext } from '../../GlobalStore/globalStore.js';
import { RadiosProps } from './RadioTypes';
import AdditionalFilters from './AdditionalFilters/AdditionalFilters';
import { Box } from '@mui/material';

const Radios: React.FC<RadiosProps> = (props) => {
  const [{ totalEntries }] = useGlobalContext();

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
          : [],
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
          : [],
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
          justifyContent: 'center',
          width: '95%',
          margin: '2.5% auto 0 auto',
          border: '1px solid orangered',
          borderTop: 'none',
          borderLeft: 'none',
          backgroundColor: '#52fff3',
          boxShadow: '2.5px 2.5px 5px 0px orangered',
        }}
      >
        {initArr.map((radioColumn, index) => {
          return (
            <RadioColumn
              key={index}
              {...radioColumn}
              isLoaded={!!totalEntries?.length}
            />
          );
        })}
      </Box>
      <AdditionalFilters
        setTitleQuery={props.setTitleQuery}
        titleQuery={props.titleQuery}
        setFromDateQuery={props.setFromDateQuery}
        setToDateQuery={props.setToDateQuery}
      />
      <ProgressBar />
    </Box>
  );
};

export default Radios;
