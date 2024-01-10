import React, { useEffect, useRef } from 'react';
import EntryDescriptor from './EntryDescriptor';
import NestedEntryDescriptor from './NestedEntryDescriptor';
import { CurrentActivity, Entry, Format } from './EntryTypes';
import {
  Box,
  ClickAwayListener,
  Link,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useCSX } from '@lib';

interface GeneralEntryProps {
  no: number | undefined;
  editingHeadline: boolean;
  editedName: string;
  entry: Entry;
  sport: string;
  format: Format;
  currentActivity: CurrentActivity;
  handleNameChange: (e: { target: { value: string } }) => void;
  handleEditingHeadlineChange: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | true
  ) => void;
}

const GeneralEntry = (props: GeneralEntryProps) => {
  const m2y = 1.094;
  const mps2kph = 3.6;

  const pastTense =
    props.sport === 'Walk'
      ? 'Walked-'
      : props.sport === 'Swim'
      ? 'Swam-'
      : props.sport === 'Ride'
      ? 'Rode-'
      : props.sport === 'Run'
      ? 'Ran'
      : 'traveled-';

  const handleTime: (movingTime: number, pace?: string) => string = (
    movingTime,
    pace
  ) => {
    if (movingTime !== Infinity) {
      if (pace) {
        return new Date(movingTime * 1000).toISOString().substr(15, 4);
      }
      return new Date(movingTime * 1000).toISOString().substr(11, 8);
    } else {
      return '00:00';
    }
  };

  const isTopThreeEntry = Number(props.no) >= 0 && Number(props.no) <= 2;

  const mobileCentered = useCSX('left', 'center', 'textAlign');

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.editingHeadline && ref.current) {
      ref.current.focus();
      const textLength = ref.current.value.length;
      ref.current.setSelectionRange(textLength, textLength);
    }
  }, [props.editingHeadline]);
  const mobileEntryWidth = useCSX('15%', '100%', 'width');

  return (
    <Box
      id={
        Number(props.no) === 0
          ? 'entry1'
          : Number(props.no) === 1
          ? 'entry2'
          : Number(props.no) === 2
          ? 'entry3'
          : ''
      }
      className="innerEntry"
      sx={{
        border: '1px solid coral',
        backgroundColor: 'paleturquoise',
        '&:hover': {
          backgroundColor: !isTopThreeEntry ? 'darkturquoise' : null,
          p: {
            color: 'ivory',
          },
        },

        ...(() => {
          if (Number(props.no) === 0) {
            return { backgroundColor: 'goldenrod' };
          }
          if (Number(props.no) === 1) {
            return { backgroundColor: 'silver' };
          }

          if (Number(props.no) === 2) {
            return { backgroundColor: '#cd7f32' };
          }
          return {};
        })(),

        ...mobileCentered,
      }}
    >
      <Box
        className={
          isTopThreeEntry ? 'generalEntry specialEntry' : 'generalEntry'
        }
        data-indentry={props.entry.activityId}
        onClick={props.handleEditingHeadlineChange}
        sx={{
          ...(() => {
            if (isTopThreeEntry) {
              return {
                '& > *': {
                  cursor: 'pointer',
                },
                color: 'ivory',
                padding: '1rem',
                '& > p': {
                  paddingLeft: '1.5%',
                },
                ...mobileEntryWidth,
              };
            }
            return {
              // Clickable Area for Detailed Entry
              width: '15%',
              '& > *': {
                cursor: 'pointer',
              },
              padding: '10px',
              '& > p': {
                paddingLeft: '1.5%',
              },
              ...mobileEntryWidth,
            };
          })(),
        }}
      >
        {props.editingHeadline ? (
          <ClickAwayListener
            onClickAway={() => props.handleEditingHeadlineChange(true)}
          >
            <OutlinedInput
              inputRef={ref}
              type="text"
              value={props.editedName}
              onChange={props.handleNameChange}
              sx={{ color: 'ivory', border: '1px solid white', height: '2rem' }}
            />
          </ClickAwayListener>
        ) : (
          <Link
            className="entryTitle"
            href=""
            sx={{
              color: isTopThreeEntry ? 'ivory' : 'orangered',
              textDecorationColor: isTopThreeEntry ? 'ivory' : 'orangered',
            }}
          >
            {props.entry.name}
          </Link>
        )}
        {props.format !== 'avgypace' ? (
          <EntryDescriptor
            title={`Distance ${pastTense}`}
            value={`${props.entry.distance} Meters`}
          />
        ) : (
          <EntryDescriptor
            title={`Distance ${pastTense}`}
            value={`${(props.entry.distance * 1.094).toFixed()} Yards`}
          />
        )}

        <EntryDescriptor
          title="Time Elapsed- "
          value={handleTime(props.entry.elapsed_time)}
        />

        <EntryDescriptor
          title="Moving Time- "
          value={handleTime(props.entry.moving_time)}
        />

        {/* For Debugging  */}
        {/* <p className="entry-descriptor">id = {entry.activityId}</p> */}

        {/* Format */}
        {props.format === 'kph' ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={(
              (props.entry.distance / props.entry.moving_time) *
              mps2kph
            ).toFixed(2)}
            extra="kph"
          />
        ) : props.format === 'mph' ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={(
              (props.entry.distance / props.entry.moving_time) *
              2.237
            ).toFixed(2)}
            extra="mph"
          />
        ) : props.format === 'mps' ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={(props.entry.distance / props.entry.moving_time).toFixed(2)}
            extra="mps"
          />
        ) : props.format === 'avgypace' ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={handleTime(
              props.entry.moving_time / ((props.entry.distance * 1.094) / 100),
              'pace'
            )}
            extra="/100 Yards"
          />
        ) : props.format === 'avgmpace' ? (
          <NestedEntryDescriptor
            title="Avg Pace- "
            value={handleTime(
              props.entry.moving_time / (props.entry.distance / 100),
              'pace'
            )}
            extra="/100 Meters"
          />
        ) : null}
        {/* Max Speed Format  */}

        {props.format === 'kph' ? (
          <NestedEntryDescriptor
            title="Max Speed-"
            value={(Number(props.entry.max_speed) * mps2kph).toFixed(2)}
            extra="kph"
          />
        ) : props.format === 'mph' ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={(Number(props.entry.max_speed) * 2.237).toFixed(2)}
            extra="mph"
          />
        ) : props.format === 'mps' ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={Number(props.entry.max_speed).toFixed(2)}
            extra="mps"
          />
        ) : props.format === 'avgypace' ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={handleTime(
              100 / (Number(props.entry.max_speed) * m2y),
              'pace'
            )}
            extra="/100 yards"
          />
        ) : props.format === 'avgmpace' ? (
          <NestedEntryDescriptor
            title="Max Speed- "
            value={handleTime(100 / Number(props.entry.max_speed), 'pace')}
            extra="/100 Meters"
          />
        ) : null}

        <Typography className="entryDescriptor" sx={{ cursor: 'default' }}>
          {new Date(props.entry.start_date).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default GeneralEntry;
