import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import HeartRateChart from './HeartRateChart';
import {
  Box,
  ClickAwayListener,
  TextField,
  Typography,
  useTheme,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Format } from './EntryTypes';
import {
  getAchievementEffortView,
  getCurrentActivity,
  useGetUserProfileQuery,
  useLazyGetKudoersQuery,
  useUpdateShoeIndividualEntryMutation,
} from '@redux/slices';
import { useCSX } from '@lib';
import ActivityMap from './ActivityMap/ActivityMap';
import AchievementsByEffort from '@components/DetailedEntry/AchievementsByEffort';
import AchievementsBySegment from '@components/DetailedEntry/AchievementsBySegment';
import { useSelector } from '@redux/reduxHooks';

export interface DetailedEntryProps {
  editingDescription: boolean;
  editedDescription: string;
  handleEditingDescriptionChange: () => void;
  handleDescriptionChange: (e: { target: { value: string } }) => void;
  format: Format;
  handleCloseCurrentActivity: () => void;
  isSharedActivity?: true;
}

const DetailedEntry = (props: DetailedEntryProps) => {
  const theme = useTheme();
  const currentActivity = useSelector(getCurrentActivity);
  const [editingShoes, setEditingShoes] = useState(false);
  const [updateShoeIndividualEntryMutation] =
    useUpdateShoeIndividualEntryMutation();

  const { data: userProfile } = useGetUserProfileQuery(null);
  const achievementEffortView = useSelector(getAchievementEffortView);
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

  const descriptionRef = useRef<HTMLInputElement>(null);
  const gearRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if (props.editingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
      const textLength = descriptionRef.current.value.length;
      descriptionRef.current.setSelectionRange(textLength, textLength);
    }
  }, [props.editingDescription]);

  useEffect(() => {
    if (editingShoes && gearRef.current) {
      gearRef.current.focus();
    }
  }, [editingShoes]);

  useEffect(() => {
    if (kudoersResults && kudoersResults.data) {
      setCurrentKudoers(kudoersResults.data.kudos);
      setCurrentComments(kudoersResults.data.comments);
    }
  }, [kudoersResults]);

  const handleKudosClick = () => {
    getKudoers(currentActivity.id);
    setCurrentStat((prevStat) => {
      if (prevStat === 'kudosComments') {
        return null;
      }
      return 'kudosComments';
    });
  };

  const handleAchievementsClick = () => {
    setCurrentStat((prevStat) => {
      if (prevStat === 'achievements') {
        return null;
      }
      return 'achievements';
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
        {props.editingDescription && !props.isSharedActivity ? (
          <ClickAwayListener
            onClickAway={(_e) => props.handleEditingDescriptionChange()}
          >
            <TextField
              multiline
              rows={20}
              inputRef={descriptionRef}
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
            {currentActivity.description}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', width: '100%' }}>
        {/* Device */}
        {currentActivity.device_name ? (
          <Box
            id="topActivityDevice"
            sx={{
              alignSelf: 'flex-start',
              marginLeft: '1.25%',
              color: theme.palette.common.white,
              padding: '.5rem',
              marginY: '.75rem',
              border: '1px solid ' + theme.palette.common.white,
              cursor: 'default',
            }}
          >
            <Typography>Device: {currentActivity.device_name}</Typography>
          </Box>
        ) : null}
        {/* Gear */}
        {currentActivity.gear?.name && !editingShoes ? (
          <Box
            id="topActivityGear"
            sx={{
              alignSelf: 'flex-start',
              marginLeft: '1.25%',
              color: theme.palette.common.white,
              padding: '.5rem',
              marginY: '.75rem',
              border: '1px solid ' + theme.palette.common.white,
              cursor: 'default',
            }}
            onClick={() => {
              // Edge case where shoes don't exist or user is rate limited
              if (!props.isSharedActivity && userProfile?.shoes.length) {
                setEditingShoes(true);
              }
            }}
          >
            <Typography>Gear: {currentActivity.gear.name}</Typography>
          </Box>
        ) : (
          <Box sx={{ marginY: '.75rem', marginX: '.5rem' }}>
            {!props.isSharedActivity && userProfile?.shoes.length ? (
              <Select
                ref={gearRef}
                sx={{
                  height: '3rem',
                  width: '15rem',
                  ml: '7.5%',
                  color: theme.palette.common.white,
                  border: '1px solid ' + theme.palette.common.white,
                }}
                defaultValue="shoeChoose"
                onChange={(e: SelectChangeEvent<string>) => {
                  if (e.target.value === 'shoeChoose') {
                    return;
                  }
                  const shoeId = e.target.value;
                  const shoeName = userProfile.shoes.find(
                    (shoe) => shoe.id === shoeId
                  )?.name;
                  if (!shoeName) {
                    return;
                  }
                  updateShoeIndividualEntryMutation({
                    shoeId,
                    activityId: currentActivity.id,
                    shoeName,
                  });
                  setEditingShoes(false);
                }}
              >
                {[
                  <MenuItem key={-1} value="shoeChoose" disabled>
                    Choose Your Shoe!
                  </MenuItem>,
                ].concat(
                  userProfile?.shoes.map((shoe, index) => (
                    <MenuItem value={shoe.id} key={index}>
                      {shoe.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            ) : null}
          </Box>
        )}
      </Box>

      <Box
        id="funStats"
        sx={{
          display: 'flex',
          flex: 1,
          width: '97.5%',
          justifyContent: currentActivity.map.polyline
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
            flex: 0.4,
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
              priority={true}
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
                  {currentActivity.kudos_count}
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
                  {currentActivity.comment_count}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Heart Rate */}
          {currentActivity.average_heartrate ? (
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
                priority={true}
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
                  >{`${currentActivity.average_heartrate} bpm`}</Typography>
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
                  >{`${currentActivity.max_heartrate} bpm`}</Typography>
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
                priority={true}
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
              priority={true}
              onClick={handleAchievementsClick}
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
                  {currentActivity.achievement_count}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {currentActivity.map.polyline ? (
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
            <ActivityMap polyline={currentActivity.map.polyline} />
          </Box>
        ) : null}
        {/* Margin Left 1rem for entries without a map */}
        <Box sx={{ marginLeft: '1rem' }}>
          {currentActivity.photos.primary?.urls['600'] ? (
            <Image
              src={currentActivity.photos.primary.urls['600']}
              height={400}
              width={320}
              layout="responsive"
              alt="highlight-photo"
              priority={true}
            />
          ) : null}
        </Box>
      </Box>
      {currentStat === 'heartRate' ? (
        <HeartRateChart
          currentActivity={currentActivity}
          format={props.format}
          isSharedActivity={props.isSharedActivity}
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
      ) : currentStat === 'achievements' ? (
        (() => {
          const bestEffortsExist = !!currentActivity.best_efforts?.some(
            (bestEffort) => bestEffort.achievements.length
          );

          const segmentEffortsExist = currentActivity.segment_efforts?.some(
            (segmentEffort) => segmentEffort.achievements.length
          );

          // Not only should best_efforts have a length but also at least one bestEffort should have an achievement with a length
          if (
            (achievementEffortView === 'best-effort' && bestEffortsExist) ||
            (bestEffortsExist && !segmentEffortsExist)
          ) {
            return (
              <AchievementsByEffort
                bestEfforts={currentActivity.best_efforts!.filter(
                  (bestEffort) => bestEffort.achievements.length
                )}
                activityId={currentActivity.id}
                toggleable={segmentEffortsExist}
              />
            );
          }

          if (
            (achievementEffortView === 'best-segment' && segmentEffortsExist) ||
            (segmentEffortsExist && !bestEffortsExist)
          ) {
            return (
              <AchievementsBySegment
                bestSegments={currentActivity.segment_efforts.filter(
                  (bestSegment) => bestSegment.achievements.length
                )}
                activityId={currentActivity.id}
                toggleable={bestEffortsExist}
              />
            );
          }

          return null;
        })()
      ) : null}

      {!props.isSharedActivity ? (
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
      ) : (
        // Box for Spacing on Shared Entries
        <Box sx={{ marginBottom: '2rem' }} />
      )}
    </Box>
  );
};

export default DetailedEntry;
