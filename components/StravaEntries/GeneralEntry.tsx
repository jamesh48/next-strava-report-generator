import React, { useEffect, useRef } from 'react';
import EntryDescriptor from './EntryDescriptor';
import NestedEntryDescriptor from './NestedEntryDescriptor';
import { Format, UIEntry } from './EntryTypes';
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
import { hasStatus } from '@components/UserProfile/UserProfile';

interface GeneralEntryProps {
  no: number | undefined;
  editingHeadline: boolean;
  editedName: string;
  entry: UIEntry;
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
  const entryIsCached = props.entry.individualActivityCached;
  const { isError, error } = useGetUserProfileQuery(null);

  const rateLimitExceeded = isError && hasStatus(error) && error.status === 429;

  const preventDetailedEntryClick = rateLimitExceeded && !entryIsCached;

  const theme = useTheme();
  const { data: userProfile } = useGetUserProfileQuery(null);

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
  const mobileTitleCentered = useCSX('flex-start', 'center', 'justifyContent');
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              ...mobileTitleCentered,
            }}
          >
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
                cursor: preventDetailedEntryClick
                  ? 'not-allowed'
                  : props.isSharedActivity
                  ? 'default'
                  : 'pointer',
              }}
              onClick={(e) => {
                e.preventDefault();
                // Prevent caching a entry when rate limit is exceeded
                if (!preventDetailedEntryClick) {
                  props.handleEditingHeadlineChange(e);
                }
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
                  position: 'relative',
                  left: '.6rem',
                  top: '.1rem',
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
        <EntryDescriptor
          title={`Distance ${pastTense}`}
          value={props.entry.distance.toString()}
        />

        {/* <EntryDescriptor
          title="Time Elapsed- "
          value={handleTime(props.entry.elapsed_time)}
        /> */}

        {/* <EntryDescriptor
          title="Moving Time- "
          value={handleTime(props.entry.moving_time)}
        /> */}

        {/* For Debugging  */}
        {/* <p className="entry-descriptor">id = {entry.activityId}</p> */}

        {/* Format */}

        <NestedEntryDescriptor
          title="Avg Pace- "
          value={props.entry.average_pace}
          extra=""
        />

        {/* Max Speed Format  */}
        <NestedEntryDescriptor
          title="Max Speed-"
          value={props.entry.max_speed}
          extra=""
        />

        <Typography className="entryDescriptor" sx={{ cursor: 'default' }}>
          {new Date(props.entry.start_date).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default GeneralEntry;
