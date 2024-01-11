import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import HeartRateChart from './HeartRateChart';
import {
  Box,
  ClickAwayListener,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { CurrentActivity, Format } from './EntryTypes';
import { useLazyGetKudoersQuery } from '@redux/slices';
import { useCSX } from '@lib';

export interface DetailedEntryProps {
  editingDescription: boolean;
  editedDescription: string;
  currentActivity: CurrentActivity;
  handleEditingDescriptionChange: () => void;
  handleDescriptionChange: (e: { target: { value: string } }) => void;
  format: Format;
}

const DetailedEntry = (props: DetailedEntryProps) => {
  const theme = useTheme();
  const [getKudoers, kudoersResults] = useLazyGetKudoersQuery();
  const [currentStat, setCurrentStat] = useState<null | string>(null);
  const [currentKudoers, setCurrentKudoers] = useState<
    { firstname: string; lastname: string }[]
  >([]);
  const [currentComments, setCurrentComments] = useState<
    {
      text: string;
      athlete: { firstname: string; lastname: string };
    }[]
  >([]);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.editingDescription && ref.current) {
      ref.current.focus();
      const textLength = ref.current.value.length;
      ref.current.setSelectionRange(textLength, textLength);
    }
  }, [props.editingDescription]);

  useEffect(() => {
    if (kudoersResults && kudoersResults.data) {
      setCurrentKudoers(kudoersResults.data.kudos);
      setCurrentComments(kudoersResults.data.comments);
    }
  }, [kudoersResults]);

  const handleKudosClick = () => {
    getKudoers(props.currentActivity.id);
    setCurrentStat((prevStat) => {
      if (prevStat === 'kudosComments') {
        return null;
      }
      return 'kudosComments';
    });
  };

  const mobileColumns = useCSX('row', 'column', 'flexDirection');
  return (
    <Box
      className="detailedEntry"
      sx={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid ' + theme.palette.strava.main,
        display: 'flex',
        bgcolor: theme.palette.strava.contrastColor,
        flexDirection: 'column',
        textRendering: 'geometricPrecision',
        '& > p': {
          paddingLeft: '1.5%',
        },
      }}
    >
      {/* Description */}
      <Box
        className="topActivityDescription"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginX: '1%',
          width: '97.5%',
        }}
      >
        <Typography variant="h6" color={theme.palette.strava.contrastText}>
          Activity Description:
        </Typography>
        {props.editingDescription ? (
          <ClickAwayListener
            onClickAway={(_e) => props.handleEditingDescriptionChange()}
          >
            <TextField
              multiline
              rows={20}
              inputRef={ref}
              value={props.editedDescription}
              onChange={props.handleDescriptionChange}
              sx={{
                width: '100%',
                alignSelf: 'center',
                display: 'flex',
                marginBottom: '1%',
              }}
              InputProps={{
                sx: {
                  color: theme.palette.strava.contrastText,
                  border: '1px solid ' + theme.palette.strava.contrastText,
                },
              }}
            />
          </ClickAwayListener>
        ) : (
          <Typography
            className="topActivityDescription"
            sx={{
              color: theme.palette.strava.contrastText,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              whiteSpace: 'pre-line',
              border: '1px solid ' + theme.palette.strava.contrastText,
              padding: '1rem',
            }}
            onClick={props.handleEditingDescriptionChange}
          >
            {props.currentActivity.description}
          </Typography>
        )}
      </Box>
      {/* Gear */}
      <Box
        id="topActivityGear"
        sx={{
          alignSelf: 'flex-start',
          marginLeft: '1.25%',
          color: theme.palette.strava.contrastText,
          padding: '.5rem',
          marginY: '.75rem',
          border: '1px solid ' + theme.palette.strava.contrastText,
        }}
      >
        <Typography>Gear: {props.currentActivity.device_name}</Typography>
      </Box>

      <Box
        id="funStats"
        sx={{
          display: 'flex',
          width: '90%',
          justifyContent: 'center',
          alignItems: 'center',
          ...mobileColumns,
        }}
      >
        {/* Kudos & Comments */}
        <Box
          id="kudosX"
          sx={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Image
            height={100}
            width={100}
            alt="kudos-img"
            layout="static"
            src="/images/kudos.jpeg"
            onClick={handleKudosClick}
          />
          <Box
            className="kudosDescriptors"
            sx={{
              paddingLeft: '2.5%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="h6"
                id="kudosCount"
                className="kudos"
                color={theme.palette.strava.contrastText}
              >
                Kudos-
              </Typography>
              <Typography
                variant="h6"
                color={theme.palette.strava.contrastText}
              >
                {props.currentActivity.kudos_count}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="h6"
                id="commentCount"
                className="kudos"
                color={theme.palette.strava.contrastText}
              >
                Comments-
              </Typography>
              <Typography
                variant="h6"
                color={theme.palette.strava.contrastText}
              >
                {props.currentActivity.comment_count}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Heart Rate */}
        {props.currentActivity.average_heartrate ? (
          <Box
            id="goldenHeartRate"
            sx={{
              display: 'flex',
              flex: 1,
            }}
          >
            <Image
              alt="heart-rate"
              height={100}
              width={100}
              layout="static"
              src="/images/heartrate.png"
              onClick={() => {
                setCurrentStat((prevStat) => {
                  if (prevStat === 'heartRate') {
                    return null;
                  }
                  return 'heartRate';
                });
              }}
            />
            <Box
              className="heartRateDescriptors"
              sx={{ paddingLeft: '2.5%', flex: 1 }}
            >
              <Box sx={{ display: 'flex' }}>
                <Typography
                  id="avgHeartRate"
                  className="heartRate"
                  variant="h6"
                  color={theme.palette.strava.contrastText}
                >
                  Avg-
                </Typography>
                <Typography
                  variant="h6"
                  color={theme.palette.strava.contrastText}
                >{`${props.currentActivity.average_heartrate} bpm`}</Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography
                  id="maxHeartRate"
                  className="heartRate"
                  variant="h6"
                  color={theme.palette.strava.contrastText}
                >
                  Max-
                </Typography>
                <Typography
                  variant="h6"
                  color={theme.palette.strava.contrastText}
                >{`${props.currentActivity.max_heartrate} bpm`}</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            id="goldenHeartRate"
            sx={{
              display: 'flex',
              flex: 1,
            }}
          >
            <Image
              alt="heart-rate"
              height={50}
              width={50}
              src="/images/heartrate.png"
              layout="static"
            />
            <Box
              className="heartRate"
              id="avgHeartRate"
              sx={{ paddingLeft: '1.5%' }}
            >
              <Typography
                variant="h6"
                color={theme.palette.strava.contrastText}
              >
                No HR Info Available
              </Typography>
            </Box>

            <Typography
              variant="h6"
              className="heartRate"
              id="maxHeartRate"
              sx={{ display: 'inline-block' }}
            >
              <Typography sx={{ display: 'inline-block' }}></Typography>
            </Typography>
          </Box>
        )}

        {/* Trophy Case */}
        <Box
          id="trophyCase"
          sx={{
            display: 'flex',
            flex: 1,
          }}
        >
          <Image
            height={100}
            width={100}
            alt="trophy-img"
            src="/images/trophy.jpeg"
            layout="static"
          />
          <Box
            className="achievementCountDescriptor"
            sx={{ paddingLeft: '2.5%', flex: 1, display: 'flex' }}
          >
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="h6"
                className="achievements"
                id="achievementCount"
                color={theme.palette.strava.contrastText}
              >
                Achievement Count-
              </Typography>
              <Typography
                variant="h6"
                color={theme.palette.strava.contrastText}
              >
                {props.currentActivity.achievement_count}
              </Typography>
            </Box>
          </Box>
        </Box>

        {props.currentActivity.photos.primary ? (
          <Image
            src={props.currentActivity.photos.primary.urls['600']}
            height={150}
            width={150}
            layout="fixed"
            alt="highlight-photo"
          />
        ) : null}
      </Box>

      {currentStat === 'heartRate' ? (
        <HeartRateChart
          currentActivity={props.currentActivity}
          format={props.format}
        />
      ) : currentStat === 'kudosComments' ? (
        <Box
          sx={{
            paddingLeft: '2.5%',
            color: theme.palette.strava.contrastText,
            display: 'flex',
            width: '100%',
            ...mobileColumns,
          }}
        >
          {currentKudoers.length ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                paddingLeft: '5rem',
              }}
            >
              <Typography
                variant="h5"
                sx={{ textDecoration: 'underline', width: '100%' }}
              >
                Kudoers
              </Typography>
              <Box>
                {currentKudoers.map((x, index) => (
                  <Typography key={index}>
                    {x.firstname} {x.lastname}
                  </Typography>
                ))}
              </Box>
            </Box>
          ) : null}
          {currentComments.length ? (
            <Box sx={{ marginLeft: '1rem' }}>
              <Typography variant="h5" sx={{ textDecoration: 'underline' }}>
                Comments
              </Typography>
              <Box>
                {currentComments.map((x, index) => (
                  <Box key={index} sx={{ display: 'flex' }}>
                    <Typography>
                      {x.athlete.firstname} {x.athlete.lastname}:
                    </Typography>
                    <Typography>{x.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
};

export default DetailedEntry;
