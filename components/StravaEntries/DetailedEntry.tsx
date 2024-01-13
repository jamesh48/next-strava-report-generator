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
import ActivityMap from './ActivityMap/ActivityMap';

export interface DetailedEntryProps {
  editingDescription: boolean;
  editedDescription: string;
  currentActivity: CurrentActivity;
  handleEditingDescriptionChange: () => void;
  handleDescriptionChange: (e: { target: { value: string } }) => void;
  format: Format;
  handleCloseCurrentActivity: () => void;
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
  const alignGear = useCSX('flex-start', 'center', 'alignSelf');
  return (
    <Box
      className="detailedEntry"
      sx={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid ' + theme.palette.strava.main,
        display: 'flex',
        bgcolor: theme.palette.mainBackground.entry,
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
        <Typography
          variant="h6"
          color={theme.palette.common.white}
          sx={{ textDecoration: 'underline' }}
        >
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
                  color: theme.palette.common.white,
                  border: '1px solid ' + theme.palette.common.white,
                },
              }}
            />
          </ClickAwayListener>
        ) : (
          <Typography
            className="topActivityDescription"
            sx={{
              color: theme.palette.common.white,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              whiteSpace: 'pre-line',
              border: '1px solid ' + theme.palette.common.white,
              padding: '1rem',
            }}
            onClick={props.handleEditingDescriptionChange}
          >
            {props.currentActivity.description}
          </Typography>
        )}
      </Box>
      {/* Gear */}
      {props.currentActivity.device_name ? (
        <Box
          id="topActivityGear"
          sx={{
            marginLeft: '1.25%',
            color: theme.palette.common.white,
            padding: '.5rem',
            marginY: '.75rem',
            border: '1px solid ' + theme.palette.common.white,
            ...alignGear,
          }}
        >
          <Typography>Gear: {props.currentActivity.device_name}</Typography>
        </Box>
      ) : (
        <Box sx={{ marginY: '.75rem' }}></Box>
      )}
      <Box
        id="funStats"
        sx={{
          display: 'flex',
          flex: 1,
          width: '97.5%',
          justifyContent: props.currentActivity.map.polyline
            ? 'center'
            : 'flex-start',
          alignItems: 'center',
          ...mobileColumns,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingX: '1rem',
            border: '1px solid white',
            flex: 1,
          }}
        >
          {/* Kudos & Comments */}
          <Box
            id="kudosX"
            sx={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              marginY: '1rem',
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
                  color={theme.palette.common.white}
                >
                  Kudos-
                </Typography>
                <Typography variant="h6" color={theme.palette.common.white}>
                  {props.currentActivity.kudos_count}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography
                  variant="h6"
                  id="commentCount"
                  className="kudos"
                  color={theme.palette.common.white}
                >
                  Comments-
                </Typography>
                <Typography variant="h6" color={theme.palette.common.white}>
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
                marginY: '1rem',
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
                    color={theme.palette.common.white}
                  >
                    Avg-
                  </Typography>
                  <Typography
                    variant="h6"
                    color={theme.palette.common.white}
                  >{`${props.currentActivity.average_heartrate} bpm`}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    id="maxHeartRate"
                    className="heartRate"
                    variant="h6"
                    color={theme.palette.common.white}
                  >
                    Max-
                  </Typography>
                  <Typography
                    variant="h6"
                    color={theme.palette.common.white}
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
                marginY: '1rem',
                minHeight: '6rem',
                alignItems: 'center',
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
                <Typography variant="h6" color={theme.palette.common.white}>
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
              marginY: '1rem',
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
                  color={theme.palette.common.white}
                >
                  Achievement Count-
                </Typography>
                <Typography variant="h6" color={theme.palette.common.white}>
                  {props.currentActivity.achievement_count}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {props.currentActivity.map.polyline ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              marginX: '1rem',
            }}
          >
            <ActivityMap polyline={props.currentActivity.map.polyline} />
          </Box>
        ) : null}
        {/* Margin Left 1rem for entries without a map */}
        <Box
          sx={{
            flex: 1,
            justifyContent: 'flex-end',
            display: 'flex',
          }}
        >
          {props.currentActivity.photos.primary ? (
            <Image
              src={props.currentActivity.photos.primary.urls['600']}
              height={400}
              width={320}
              layout="responsive"
              alt="highlight-photo"
            />
          ) : null}
        </Box>
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
            color: theme.palette.common.white,
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
      <Typography
        variant="h6"
        color={theme.palette.common.white}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '95%',
          cursor: 'pointer',
          '&:hover': {
            color: 'lightgray',
          },
        }}
        onClick={props.handleCloseCurrentActivity}
      >
        Close Detail
      </Typography>
    </Box>
  );
};

export default DetailedEntry;
