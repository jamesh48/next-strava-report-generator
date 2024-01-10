import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import { useSelector } from '@redux/reduxHooks';
import { getSportCondition } from '@redux/slices';

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
  setCallback:
    | React.MouseEventHandler<HTMLLabelElement> &
        React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const RadioColumn = (props: RadioColumnProps) => {
  const theme = useTheme();
  const sportCondition = useSelector(getSportCondition);

  return (
    <Box
      className="chooseRadioContainer"
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
        color={theme.palette.strava.main}
      >
        {props.title}
      </Typography>
      <Box
        className="multipleRadioButtonContainer"
        sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        <FormControl>
          <RadioGroup
            value={(() => {
              if (props.title === 'Choose Sport' && sportCondition) {
                return sportCondition;
              }
              return props.radioValues[0]?.value;
            })()}
          >
            {props.radioValues.map((radio, index) => {
              if (radio.type === 'radioAndText') {
                return (
                  <Box key={index}>
                    <FormControlLabel
                      value="x"
                      label=""
                      disabled={!props.isLoaded ? true : false}
                      control={<Radio checked={props.customDistance} />}
                      onClick={props.setCallback}
                    />
                    <FormControlLabel
                      disabled={!props.isLoaded ? true : false}
                      id={radio.id}
                      name=""
                      label=""
                      control={
                        <OutlinedInput
                          onChange={props.setCallback}
                          value={props.customDistance ? null : ''}
                          placeholder={'Custom Distance'}
                          sx={{ height: '3rem' }}
                          label=""
                        />
                      }
                    />
                  </Box>
                );
              }
              return (
                <FormControlLabel
                  key={index}
                  value={radio.value}
                  disabled={!props.isLoaded ? true : false}
                  checked={(() => {
                    if (radio.name.indexOf('distance') > -1) {
                      if (props.customDistance) {
                        return false;
                      }
                      if (radio.value === '0' && props.distance === 0) {
                        return true;
                      }
                      if (
                        radio.value !== '0' &&
                        props.distance === Number(radio.value)
                      ) {
                        return true;
                      }
                      return false;
                    }
                    return undefined;
                  })()}
                  label={radio.labelText}
                  onClick={props.setCallback}
                  control={<Radio />}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};

export default RadioColumn;
