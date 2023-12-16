import React from 'react';
import { Box } from '@mui/material';

export interface SingleRadioProps {
  id: string;
  type: string;
  index: number;
  isLoaded: boolean;
  name: string;
  distance?: number;
  customDistance?: boolean;
  placeholder?: string;
  labelText?: string | undefined;
  value?: string | undefined;
  setCallback: React.MouseEventHandler<HTMLInputElement>;
}

const SingleRadio = (props: SingleRadioProps) => {
  return props.type === 'radio' ? (
    <Box className="singleRadioButtonContainer" sx={{ flex: 1 }}>
      <input
        defaultChecked={props.index === 0}
        disabled={!props.isLoaded ? true : false}
        type={props.type}
        id={props.id}
        name={props.name}
        value={props.value}
        // @ts-ignore
        checked={
          props.name.indexOf('distance') > -1 &&
          props.index === 0 &&
          !props.distance
            ? 'Checked'
            : null
        }
        onClick={props.setCallback}
      />
      <label htmlFor="allresults">{props.labelText}</label>
      <br />
    </Box>
  ) : props.type === 'radioAndText' ? (
    <Box className="singleRadioButtonContainer" sx={{ flex: 1 }}>
      <input
        type="radio"
        name={props.name}
        disabled
        hidden
        checked={props.customDistance}
      />
      <input
        disabled={!props.isLoaded ? true : false}
        id={props.id}
        name={props.name}
        //@ts-ignore
        onChange={props.setCallback}
        type="text"
        placeholder={props.placeholder}
        // @ts-ignore
        value={props.customDistance ? null : ''}
      />
    </Box>
  ) : null;
};

export default SingleRadio;
