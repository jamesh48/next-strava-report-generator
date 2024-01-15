import React, { useEffect, useRef } from 'react';
import EntryDescriptor from './EntryDescriptor';
import NestedEntryDescriptor from './NestedEntryDescriptor';
import { Entry, Format } from './EntryTypes';
import {
  Box,
  ClickAwayListener,
  Link,
  OutlinedInput,
  Typography,
  useTheme,
} from '@mui/material';

import { Share } from '@mui/icons-material';
import { useCSX } from '@lib';
import { useGetUserProfileQuery } from '@redux/slices';

interface GeneralEntryProps {
  no: number | undefined;
  editingHeadline: boolean;
  editedName: string;
  entry: Entry;
  sport: string;
  format: Format;
  isCurrentActivity: boolean;
  handleNameChange: (e: { target: { value: string } }) => void;
  handleEditingHeadlineChange: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | true
  ) => void;
  isSharedActivity?: true;
}

const GeneralEntry = (props: GeneralEntryProps) => {
  const theme = useTheme();
  const { data: userProfile } = useGetUserProfileQuery(null);
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
  const mobileEntryWidth = useCSX('20%', '90%', 'width');

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
        border: '1px solid ' + theme.palette.strava.contrastColor,
        backgroundColor: props.isCurrentActivity
          ? theme.palette.mainBackground.main
          : theme.palette.mainBackground.light,
        '&:hover': {
          backgroundColor: !isTopThreeEntry
            ? theme.palette.mainBackground.main
            : null,
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
        display: 'flex',
        ...mobileCentered,
      }}
    >
      <Box
        className={
          isTopThreeEntry ? 'generalEntry specialEntry' : 'generalEntry'
        }
        sx={{
          ...(() => {
            if (isTopThreeEntry) {
              return {
                '& > *': {
                  cursor: props.isSharedActivity ? 'default' : 'pointer',
                },
                color: theme.palette.strava.contrastText,
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
              color: theme.palette.mode === 'dark' ? 'ivory' : 'black',
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
              sx={{
                color: theme.palette.strava.contrastText,
                border: '1px solid white',
                height: '2rem',
              }}
            />
          </ClickAwayListener>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link
              className="entryTitle"
              href=""
              sx={{
                color: isTopThreeEntry
                  ? theme.palette.strava.contrastText
                  : theme.palette.strava.main,
                textDecorationColor: isTopThreeEntry
                  ? theme.palette.strava.contrastText
                  : theme.palette.strava.main,
                cursor: props.isSharedActivity ? 'default' : 'pointer',
              }}
              onClick={(e) => {
                e.preventDefault();
                props.handleEditingHeadlineChange(e);
              }}
              data-indentry={props.entry.activityId}
            >
              {props.entry.name}
            </Link>
            {props.isCurrentActivity && !props.isSharedActivity ? (
              <Share
                sx={{
                  height: '1rem',
                  width: '1rem',
                  marginLeft: '1rem',
                  color: theme.palette.strava.main,
                  borderRadius: '50%',
                  padding: '.25rem',
                  backgroundColor: theme.palette.strava.contrastText,
                  '&:hover': {
                    color: (() => {
                      if (props.no === 0) {
                        return 'goldenrod';
                      }
                      if (props.no === 1) {
                        return 'silver';
                      }
                      if (props.no === 2) {
                        return '#cd7f32';
                      }
                      return theme.palette.mainBackground.main;
                    })(),
                  },
                  '&:active': {
                    backgroundColor: 'green',
                    color: theme.palette.strava.main,
                  },
                }}
                onClick={() => {
                  const handleCopyUrl = async () => {
                    await navigator.clipboard.writeText(
                      `https://stravareportgenerator.com/SharedEntry?athleteId=${userProfile?.id}&activityId=${props.entry.activityId}`
                    );
                  };
                  handleCopyUrl();
                }}
              />
            ) : null}
          </Box>
        )}
        {props.format !== 'avgypace' ? (
          <EntryDescriptor
            title={`Distance ${pastTense}:`}
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
