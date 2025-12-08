import { Format, Sport } from '@components/StravaEntries/EntryTypes';
import { useCSX } from '@lib';
import Image from 'next/image';
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useSelector } from '@redux/reduxHooks';
import {
  getAchievementEffortView,
  useGetIndividualEntryQuery,
  useGetKudoersQuery,
  useGetUserProfileQuery,
  useUpdateShoeIndividualEntryMutation,
} from '@redux/slices';
import { useRef, useState } from 'react';
import { Else, If, Then, When } from 'react-if';
import PlusOneBox from '@components/StravaEntries/PlusOneBox';
import ActivityMap from '@components/StravaEntries/ActivityMap/ActivityMap';
import HeartRateChart from '@components/StravaEntries/HeartRateChart';
import AchievementsBySegment from '@components/DetailedEntry/AchievementsBySegment';
import AchievementsByEffort from '@components/DetailedEntry/AchievementsByEffort';

interface EntryDetailProps {
  activityId: number;
  isSharedActivity?: true;
  sport: Sport;
  format: Format;
}

const EntryDetail = ({
  activityId,
  isSharedActivity,
  sport,
  format,
}: EntryDetailProps) => {
  const gearRef = useRef<HTMLSelectElement>(null);
  const achievementEffortView = useSelector(getAchievementEffortView);
  const [currentStat, setCurrentStat] = useState<null | string>(null);
  const [editingShoes, setEditingShoes] = useState(false);
  const theme = useTheme();
  const { data: entryDetail } = useGetIndividualEntryQuery({
    entryid: activityId,
  });
  const { data: kudoersResults } = useGetKudoersQuery(entryDetail?.id);
  const { data: userProfile } = useGetUserProfileQuery(null);

  const [updateShoeIndividualEntryMutation] =
    useUpdateShoeIndividualEntryMutation();

  const mobileColumns = useCSX('row', 'column', 'flexDirection');

  const handleKudosClick = () => {
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

  return (
    <Stack
      className="detailedEntry"
      sx={{
        boxSizing: 'border-box',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid ' + theme.palette.strava.main,
        // bgcolor: theme.palette.mainBackground.entry,
        textRendering: 'geometricPrecision',
        padding: 1,
      }}
    >
      <Stack
        className="topActivityDescription"
        sx={{
          marginX: '1%',
          width: '100%',
        }}
      >
        <Typography variant="h6" sx={{ textDecoration: 'underline' }}>
          Description:
        </Typography>
        <Typography
          className="topActivityDescription"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            whiteSpace: 'pre-line',
          }}
          // onClick={props.handleEditingDescriptionChange}
        >
          {entryDetail?.description}
        </Typography>
      </Stack>
      <Box sx={{ display: 'flex', width: '100%' }}>
        {/* Device */}
        <When condition={entryDetail?.device_name}>
          <Box
            id="topActivityDevice"
            sx={{
              alignSelf: 'flex-start',
              marginLeft: '1.25%',
              padding: '.5rem',
              marginY: '.75rem',
              cursor: 'default',
              border: '1px solid ' + theme.palette.strava.main,
            }}
          >
            <Typography>Device: {entryDetail?.device_name}</Typography>
          </Box>
        </When>
        {/* Gear - Shoes */}
        <When condition={['Run', 'Walk'].includes(sport)}>
          {entryDetail?.gear?.name && !editingShoes ? (
            <Box
              id="topActivityGear"
              sx={{
                alignSelf: 'flex-start',
                marginLeft: '1.25%',
                padding: '.5rem',
                marginY: '.75rem',
                border: '1px solid ' + theme.palette.strava.main,
                cursor: 'default',
              }}
              onClick={() => {
                // Edge case where shoes don't exist or user is rate limited
                if (!isSharedActivity && userProfile?.shoes.length) {
                  setEditingShoes(true);
                }
              }}
            >
              <Typography>Gear: {entryDetail.gear.name}</Typography>
            </Box>
          ) : (
            <Box sx={{ marginY: '.75rem', marginX: '.5rem' }}>
              <When condition={!isSharedActivity && userProfile?.shoes.length}>
                <Select
                  ref={gearRef}
                  sx={{
                    height: '3rem',
                    width: '15rem',
                    ml: '7.5%',
                    border: '1px solid ' + theme.palette.strava.main,
                  }}
                  defaultValue="shoeChoose"
                  onChange={(e: SelectChangeEvent<string>) => {
                    if (e.target.value === 'shoeChoose') {
                      return;
                    }
                    const shoeId = e.target.value;
                    const shoeName = userProfile?.shoes.find(
                      (shoe) => shoe.id === shoeId
                    )?.name;
                    if (!shoeName) {
                      return;
                    }
                    if (entryDetail?.id) {
                      updateShoeIndividualEntryMutation({
                        shoeId,
                        activityId: entryDetail?.id,
                        shoeName,
                      });
                    }
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
                    )) || []
                  )}
                </Select>
              </When>
            </Box>
          )}
        </When>
      </Box>
      <Box
        id="funStats"
        sx={{
          display: 'flex',
          flex: 1,
          width: '100%',
          justifyContent: entryDetail?.map.polyline ? 'center' : 'flex-start',
          alignItems: 'stretch',
          ...mobileColumns,
        }}
      >
        <Box
          sx={{
            paddingX: '2rem',
            paddingY: '1.5rem',
            border: '1px solid white',
            flex: 1,
            display: 'flex',
            gap: '2rem',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          {/* Kudos & Comments */}
          <Box
            id="kudosX"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
            }}
            onClick={handleKudosClick}
          >
            <Image
              height={100}
              width={100}
              alt="kudos-img"
              layout="static"
              src="/images/kudos.jpeg"
              priority={true}
            />
            <Box
              className="kudosDescriptors"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Typography
                  variant="h6"
                  id="kudosCount"
                  className="kudos"
                  sx={{ fontWeight: 500 }}
                >
                  Kudos:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {kudoersResults?.kudos.length !== undefined
                    ? kudoersResults.kudos.length
                    : entryDetail?.kudos_count}
                </Typography>
                <PlusOneBox
                  incomingCount={kudoersResults?.kudos.length}
                  cachedCount={Number(entryDetail?.kudos_count)}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Typography
                  variant="h6"
                  id="commentCount"
                  className="kudos"
                  sx={{ fontWeight: 500 }}
                >
                  Comments:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {kudoersResults?.comments.length !== undefined
                    ? kudoersResults.comments.length
                    : entryDetail?.comment_count}
                </Typography>
                <PlusOneBox
                  incomingCount={kudoersResults?.comments.length}
                  cachedCount={Number(entryDetail?.comment_count)}
                />
              </Box>
            </Box>
          </Box>

          {/* Heart Rate */}
          {entryDetail?.average_heartrate ? (
            <Box
              id="goldenHeartRate"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => {
                setCurrentStat((prevStat) => {
                  if (prevStat === 'heartRate') {
                    return null;
                  }
                  return 'heartRate';
                });
              }}
            >
              <Image
                alt="heart-rate"
                height={100}
                width={100}
                layout="static"
                src="/images/heartrate.png"
                priority={true}
              />
              <Box
                className="heartRateDescriptors"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Typography
                    id="avgHeartRate"
                    className="heartRate"
                    variant="h6"
                    sx={{ fontWeight: 500 }}
                  >
                    Avg:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                  >{`${entryDetail?.average_heartrate} bpm`}</Typography>
                </Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Typography
                    id="maxHeartRate"
                    className="heartRate"
                    variant="h6"
                    sx={{ fontWeight: 500 }}
                  >
                    Max:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                  >{`${entryDetail?.max_heartrate} bpm`}</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              id="goldenHeartRate"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                minHeight: '6rem',
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
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                No HR Info Available
              </Typography>
            </Box>
          )}
          {/* Trophy Case */}
          <Box
            id="trophyCase"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
            }}
            onClick={handleAchievementsClick}
          >
            <Image
              height={100}
              width={100}
              alt="trophy-img"
              src="/images/trophy.jpeg"
              layout="static"
              priority={true}
            />
            <Box
              className="achievementCountDescriptor"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Typography
                  variant="h6"
                  className="achievements"
                  id="achievementCount"
                  sx={{ fontWeight: 500 }}
                >
                  Achievements:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {entryDetail?.achievement_count}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <If condition={!currentStat && entryDetail?.map?.polyline}>
        <Then>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1.5rem',
              height: '400px',
            }}
          >
            <ActivityMap polyline={entryDetail?.map.polyline} />
          </Box>
        </Then>
      </If>
      <If condition={currentStat === 'heartRate'}>
        <Then>
          <Box sx={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
            <Typography
              variant="body2"
              onClick={() => setCurrentStat(null)}
              sx={{
                cursor: 'pointer',
                color: theme.palette.strava.main,
                textDecoration: 'underline',
                '&:hover': {
                  opacity: 0.7,
                },
              }}
            >
              ← Back to Map
            </Typography>
          </Box>
          <HeartRateChart
            currentActivity={entryDetail}
            format={format}
            isSharedActivity={isSharedActivity}
          />
        </Then>
        <Else>
          <If condition={currentStat === 'kudosComments'}>
            <Then>
              <Box sx={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  onClick={() => setCurrentStat(null)}
                  sx={{
                    cursor: 'pointer',
                    color: theme.palette.strava.main,
                    textDecoration: 'underline',
                    '&:hover': {
                      opacity: 0.7,
                    },
                  }}
                >
                  ← Back to Map
                </Typography>
              </Box>
              <Box
                sx={{
                  padding: '2rem',
                  display: 'flex',
                  width: '100%',
                  gap: '3rem',
                  ...mobileColumns,
                }}
              >
                {/* Kudoers Section */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textDecoration: 'underline',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: theme.palette.text.primary,
                    }}
                  >
                    Kudoers ({kudoersResults?.kudos.length || 0})
                  </Typography>
                  {kudoersResults?.kudos.length ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      {kudoersResults.kudos.map((x, index) => (
                        <Box
                          key={index}
                          sx={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0',
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ color: theme.palette.text.primary }}
                          >
                            {x.firstname} {x.lastname}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        padding: '1rem',
                        backgroundColor: '#fafafa',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        No kudos yet
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Comments Section */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textDecoration: 'underline',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: theme.palette.text.primary,
                    }}
                  >
                    Comments ({kudoersResults?.comments.length || 0})
                  </Typography>
                  {kudoersResults?.comments.length ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                      }}
                    >
                      {kudoersResults.comments.map((comment, index) => (
                        <Box
                          key={index}
                          sx={{
                            padding: '1rem',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.strava.main,
                            }}
                          >
                            {comment.athlete.firstname}{' '}
                            {comment.athlete.lastname}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              lineHeight: 1.6,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {comment.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        padding: '1rem',
                        backgroundColor: '#fafafa',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        No comments yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Then>
            <Else>
              <If condition={currentStat === 'achievements'}>
                <Then>
                  <Box sx={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
                    <Typography
                      variant="body2"
                      onClick={() => setCurrentStat(null)}
                      sx={{
                        cursor: 'pointer',
                        color: theme.palette.strava.main,
                        textDecoration: 'underline',
                        '&:hover': {
                          opacity: 0.7,
                        },
                      }}
                    >
                      ← Back to Map
                    </Typography>
                  </Box>
                  {(() => {
                    const bestEffortsExist = !!entryDetail?.best_efforts?.some(
                      (bestEffort) => bestEffort.achievements.length
                    );

                    const segmentEffortsExist =
                      entryDetail?.segment_efforts?.some(
                        (segmentEffort) => segmentEffort.achievements.length
                      );

                    // Not only should best_efforts have a length but also at least one bestEffort should have an achievement with a length
                    if (
                      (achievementEffortView === 'best-effort' &&
                        bestEffortsExist) ||
                      (bestEffortsExist && !segmentEffortsExist)
                    ) {
                      return (
                        <AchievementsByEffort
                          bestEfforts={entryDetail?.best_efforts!.filter(
                            (bestEffort) => bestEffort.achievements.length
                          )}
                          activityId={entryDetail?.id}
                          toggleable={segmentEffortsExist}
                        />
                      );
                    }

                    if (
                      (achievementEffortView === 'best-segment' &&
                        segmentEffortsExist) ||
                      (segmentEffortsExist && !bestEffortsExist)
                    ) {
                      return (
                        <AchievementsBySegment
                          bestSegments={entryDetail?.segment_efforts.filter(
                            (bestSegment) => bestSegment.achievements.length
                          )}
                          activityId={entryDetail?.id}
                          toggleable={bestEffortsExist}
                        />
                      );
                    }

                    return null;
                  })()}
                </Then>
              </If>
            </Else>
          </If>
        </Else>
      </If>
    </Stack>
  );
};

export default EntryDetail;
