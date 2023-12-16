import React from 'react';
import { RadioColumnProps } from './RadioTypes';
import SingleRadio from './SingleRadio';
import appStyles from '../../../styles/App.module.scss';
import { Box } from '@mui/material';
const RadioColumn = (props: RadioColumnProps) => {
  return (
    <Box
      className={appStyles.chooseRadioContainer}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        '&:first-child': {
          borderRight: '1px solid coral',
        },
        '&:last-child': {
          borderLeft: '1px solid coral',
        },
      }}
    >
      <h4
        className={appStyles.chooseTitle}
        id={props.title.split(' ').join('-').toLowerCase()}
      >
        {props.title}
      </h4>
      <Box
        className={appStyles.multipleRadioButtonContainer}
        sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {props.radioValues.map((radio, index) => {
          return (
            <SingleRadio key={index} {...radio} {...props} index={index} />
          );
        })}
      </Box>
    </Box>
  );
};

export default RadioColumn;
