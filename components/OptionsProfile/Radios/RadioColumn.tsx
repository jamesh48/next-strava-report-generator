import React from 'react';
import SingleRadio from './SingleRadio';
import appStyles from '../../../styles/App.module.scss';
import { Box, Typography } from '@mui/material';

export type RadioValueProps = {
  type: string;
  id: string;
  name: string;
  value?: string | undefined;
  labelText?: string | undefined;
};

interface RadioColumnProps {
  title: string;
  radioValues: RadioValueProps[];
  isLoaded: boolean;
  format?: string;
  distance?: number;
  customDistance?: boolean;
  placeholder?: string;
  setCallback: React.MouseEventHandler<HTMLDivElement>;
}

const RadioColumn = (props: RadioColumnProps) => {
  return (
    <Box
      className={appStyles.chooseRadioContainer}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        '&:first-of-type': {
          borderRight: '1px solid coral',
        },
        '&:last-child': {
          borderLeft: '1px solid coral',
        },
      }}
    >
      <Typography
        variant="h6"
        className="chooseTitle"
        id={props.title.split(' ').join('-').toLowerCase()}
        sx={{ color: 'orangered' }}
      >
        {props.title}
      </Typography>
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
