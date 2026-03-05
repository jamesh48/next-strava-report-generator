import AchievementsByEffort from '@components/DetailedEntry/AchievementsByEffort'
import AchievementsBySegment from '@components/DetailedEntry/AchievementsBySegment'
import ActivityMap from '@components/StravaEntries/ActivityMap/ActivityMap'
import type { Format, Sport } from '@components/StravaEntries/EntryTypes'
import HeartRateChart from '@components/StravaEntries/HeartRateChart'
import PlusOneBox from '@components/StravaEntries/PlusOneBox'
import { useCSX } from '@lib'
import {
  Box,
  Card,
  ClickAwayListener,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useSelector } from '@redux/reduxHooks'
import {
  getAchievementEffortView,
  useGetIndividualEntryQuery,
  useGetKudoersQuery,
  useGetUserProfileQuery,
  useUpdateIndividualEntryMutation,
  useUpdateShoeIndividualEntryMutation,
} from '@redux/slices'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Else, If, Then, When } from 'react-if'

interface EntryDetailProps {
  activityId?: number
  isSharedActivity?: true
  sport: Sport
  format: Format
}

const EntryDetail = ({
  activityId,
  isSharedActivity,
  sport,
  format,
}: EntryDetailProps) => {
  const gearRef = useRef<HTMLSelectElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const achievementEffortView = useSelector(getAchievementEffortView)
  const [currentStat, setCurrentStat] = useState<null | string>(null)
  const [editingShoes, setEditingShoes] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState('')
  const theme = useTheme()
  const { data: entryDetail, isLoading: isLoadingEntry } =
    useGetIndividualEntryQuery(
      {
        entryid: activityId!,
      },
      { skip: activityId === undefined },
    )

  const { data: kudoersResults } = useGetKudoersQuery(entryDetail?.id)
  const { data: userProfile } = useGetUserProfileQuery(null)

  const [updateShoeIndividualEntryMutation] =
    useUpdateShoeIndividualEntryMutation()
  const [updateIndividualEntryMutation, { isLoading: isUpdatingEntry }] =
    useUpdateIndividualEntryMutation()

  const isLoading = isLoadingEntry || isUpdatingEntry
  const mobileColumns = useCSX('row', 'column', 'flexDirection')

  useEffect(() => {
    if (entryDetail?.description) {
      setEditedDescription(entryDetail.description)
    }
  }, [entryDetail?.description])

  useEffect(() => {
    if (editingDescription && descriptionRef.current) {
      descriptionRef.current.focus()
      const textLength = descriptionRef.current.value.length
      descriptionRef.current.setSelectionRange(textLength, textLength)
    }
  }, [editingDescription])

  const handleKudosClick = () => {
    setCurrentStat((prevStat) => {
      if (prevStat === 'kudosComments') {
        return null
      }
      return 'kudosComments'
    })
  }

  const handleAchievementsClick = () => {
    setCurrentStat((prevStat) => {
      if (prevStat === 'achievements') {
        return null
      }
      return 'achievements'
    })
  }

  const handleEditingDescriptionChange = async () => {
    if (isSharedActivity) {
      return
    }
    if (editingDescription) {
      if (entryDetail?.id && entryDetail?.name) {
        try {
          await updateIndividualEntryMutation({
            activityId: entryDetail.id,
            name: entryDetail.name,
            description: editedDescription,
          }).unwrap()
          setEditingDescription(false)
        } catch (err) {
          // Keep editing mode open on error
          console.error('Failed to update description:', err)
        }
      }
    } else {
      setEditingDescription(true)
    }
  }

  const handleDescriptionChange = (e: { target: { value: string } }) => {
    setEditedDescription(e.target.value)
  }

  return (
    <Stack
      className='detailedEntry'
      sx={{
        boxSizing: 'border-box',
        justifyContent: 'center',
        alignItems: 'center',
        border: `2px solid ${theme.palette.strava.main}`,
        // bgcolor: theme.palette.mainBackground.entry,
        textRendering: 'geometricPrecision',
        padding: 1,
        gap: 2,
      }}
    >
      <Stack
        className='topActivityDescription'
        sx={{
          marginX: '1%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Card sx={{ flex: 1, padding: '1rem' }}>
          <If condition={isLoading}>
            <Then>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                <Skeleton variant='text' width='100%' height={24} />
                <Skeleton variant='text' width='95%' height={24} />
                <Skeleton variant='text' width='98%' height={24} />
                <Skeleton variant='text' width='90%' height={24} />
                <Skeleton variant='text' width='93%' height={24} />
              </Box>
            </Then>
            <Else>
              <If condition={editingDescription && !isSharedActivity}>
                <Then>
                  <ClickAwayListener
                    onClickAway={handleEditingDescriptionChange}
                  >
                    <TextField
                      multiline
                      rows={6}
                      inputRef={descriptionRef}
                      value={editedDescription}
                      onChange={handleDescriptionChange}
                      sx={{
                        width: '100%',
                        alignSelf: 'center',
                        display: 'flex',
                      }}
                    />
                  </ClickAwayListener>
                </Then>
                <Else>
                  <Typography
                    className='topActivityDescription'
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: entryDetail?.description
                        ? 'flex-start'
                        : 'center',
                      textAlign: entryDetail?.description ? 'left' : 'center',
                      whiteSpace: 'pre-line',
                      cursor: isSharedActivity ? 'default' : 'pointer',
                      '&:hover': isSharedActivity
                        ? {}
                        : {
                            opacity: 0.7,
                          },
                      fontStyle: entryDetail?.description ? 'normal' : 'italic',
                      color: entryDetail?.description
                        ? 'inherit'
                        : theme.palette.text.secondary,
                    }}
                    onClick={handleEditingDescriptionChange}
                  >
                    {entryDetail?.description || 'No Description Available'}
                  </Typography>
                </Else>
              </If>
            </Else>
          </If>
        </Card>
        {/* Margin Left 1rem for entries without a map */}
        <Card
          sx={{
            marginLeft: '1rem',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
          }}
        >
          <If condition={isLoadingEntry}>
            <Then>
              <Skeleton
                variant='rectangular'
                width={300}
                height={200}
                sx={{ borderRadius: '.25rem' }}
              />
            </Then>
            <Else>
              <If condition={entryDetail?.photos.primary?.urls['600']}>
                <Then>
                  <Image
                    src={entryDetail?.photos.primary?.urls['600'] || ''}
                    width={300}
                    height={200}
                    alt='highlight-photo'
                    priority={true}
                    style={{ objectFit: 'contain', borderRadius: '.25rem' }}
                  />
                </Then>
                <Else>
                  <Typography
                    variant='body1'
                    sx={{
                      fontStyle: 'italic',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    No Photo Available
                  </Typography>
                </Else>
              </If>
            </Else>
          </If>
        </Card>
      </Stack>
      <Stack
        sx={{
          marginX: '1%',
          width: '100%',
        }}
      >
        <Card sx={{ padding: '1rem' }}>
          <If condition={isLoadingEntry}>
            <Then>
              <Box sx={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <Skeleton
                  variant='rectangular'
                  width={200}
                  height={48}
                  sx={{ borderRadius: '4px' }}
                />
                <Skeleton
                  variant='rectangular'
                  width={200}
                  height={48}
                  sx={{ borderRadius: '4px' }}
                />
              </Box>
            </Then>
            <Else>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                {/* Distance */}
                <When condition={entryDetail?.distance}>
                  <Box
                    sx={{
                      alignSelf: 'flex-start',
                      padding: '.75rem 1rem',
                      marginY: '.75rem',
                      backgroundColor: theme.palette.action.hover,
                      borderRadius: '4px',
                    }}
                  >
                    <Typography variant='body1'>
                      <strong>Distance:</strong>{' '}
                      {format === 'mph'
                        ? `${(
                            (entryDetail?.distance || 0) * 0.000621371
                          ).toFixed(2)} mi`
                        : `${((entryDetail?.distance || 0) / 1000).toFixed(
                            2,
                          )} km`}
                    </Typography>
                  </Box>
                </When>
                {/* Calories */}
                <When condition={entryDetail?.calories}>
                  <Box
                    sx={{
                      alignSelf: 'flex-start',
                      padding: '.75rem 1rem',
                      marginY: '.75rem',
                      backgroundColor: theme.palette.action.hover,
                      borderRadius: '4px',
                    }}
                  >
                    <Typography variant='body1'>
                      <strong>Calories:</strong> {entryDetail?.calories}
                    </Typography>
                  </Box>
                </When>
                {/* Start Date */}
                <When condition={entryDetail?.start_date_local}>
                  <Box
                    sx={{
                      alignSelf: 'flex-start',
                      padding: '.75rem 1rem',
                      marginY: '.75rem',
                      backgroundColor: theme.palette.action.hover,
                      borderRadius: '4px',
                    }}
                  >
                    <Typography variant='body1'>
                      <strong>Date:</strong>{' '}
                      {dayjs(
                        entryDetail?.start_date_local.replace('Z', ''),
                      ).format('MMM D, YYYY, h:mm:ss A')}
                    </Typography>
                  </Box>
                </When>
                {/* Device */}
                <When condition={entryDetail?.device_name}>
                  <Box
                    id='topActivityDevice'
                    sx={{
                      alignSelf: 'flex-start',
                      padding: '.75rem 1rem',
                      marginY: '.75rem',
                      cursor: 'default',
                      backgroundColor: theme.palette.action.hover,
                      borderRadius: '.25rem',
                    }}
                  >
                    <Typography variant='body1'>
                      <strong>Device:</strong> {entryDetail?.device_name}
                    </Typography>
                  </Box>
                </When>
                {/* Gear - Shoes */}
                <When condition={['Run', 'Walk'].includes(sport)}>
                  {entryDetail?.gear?.name && !editingShoes ? (
                    <Box
                      id='topActivityGear'
                      sx={{
                        alignSelf: 'flex-start',
                        padding: '.75rem 1rem',
                        marginY: '.75rem',
                        backgroundColor: theme.palette.action.hover,
                        borderRadius: '4px',
                        cursor:
                          isSharedActivity || !userProfile?.shoes.length
                            ? 'default'
                            : 'pointer',
                        '&:hover':
                          isSharedActivity || !userProfile?.shoes.length
                            ? {}
                            : {
                                backgroundColor: theme.palette.action.selected,
                              },
                      }}
                      onClick={() => {
                        if (!isSharedActivity && userProfile?.shoes.length) {
                          setEditingShoes(true)
                        }
                      }}
                    >
                      <Typography variant='body1'>
                        <strong>Gear:</strong> {entryDetail.gear.name}
                      </Typography>
                    </Box>
                  ) : (
                    <When
                      condition={!isSharedActivity && userProfile?.shoes.length}
                    >
                      <ClickAwayListener
                        onClickAway={() => setEditingShoes(false)}
                        mouseEvent='onMouseDown'
                      >
                        <Box sx={{ marginY: '.75rem' }}>
                          <Select
                            ref={gearRef}
                            sx={{
                              height: '3rem',
                              minWidth: '15rem',
                            }}
                            value={entryDetail?.gear?.id || 'none'}
                            onChange={(e: SelectChangeEvent<string>) => {
                              const shoeId = e.target.value
                              if (shoeId === 'none') {
                                return
                              }
                              const shoeName = userProfile?.shoes.find(
                                (shoe) => shoe.id === shoeId,
                              )?.name
                              if (!shoeName) {
                                return
                              }
                              if (entryDetail?.id) {
                                updateShoeIndividualEntryMutation({
                                  shoeId,
                                  activityId: entryDetail?.id,
                                  shoeName,
                                })
                              }
                              setEditingShoes(false)
                            }}
                          >
                            <MenuItem value='none' disabled>
                              {entryDetail?.gear?.name || 'Select Gear'}
                            </MenuItem>
                            {userProfile?.shoes.map((shoe) => (
                              <MenuItem value={shoe.id} key={shoe.id}>
                                {shoe.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                      </ClickAwayListener>
                    </When>
                  )}
                </When>
              </Box>
            </Else>
          </If>
        </Card>
      </Stack>
      <Stack
        sx={{
          marginX: '1%',
          width: '100%',
        }}
      >
        <Card sx={{ padding: '1rem' }}>
          <If condition={isLoadingEntry}>
            <Then>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  padding: '2rem',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <Skeleton
                    variant='rectangular'
                    width={150}
                    height={100}
                    sx={{ borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant='rectangular'
                    width={150}
                    height={100}
                    sx={{ borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant='rectangular'
                    width={150}
                    height={100}
                    sx={{ borderRadius: '4px' }}
                  />
                </Box>
                <Skeleton
                  variant='rectangular'
                  width='100%'
                  height={400}
                  sx={{ borderRadius: '4px' }}
                />
              </Box>
            </Then>
            <Else>
              <Box
                id='funStats'
                sx={{
                  display: 'flex',
                  flex: 1,
                  width: '100%',
                  justifyContent: entryDetail?.map.polyline
                    ? 'center'
                    : 'flex-start',
                  alignItems: 'stretch',
                  ...mobileColumns,
                }}
              >
                <Box
                  sx={{
                    paddingX: '2rem',
                    paddingY: '1.5rem',
                    flex: 1,
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}
                >
                  {/* Kudos & Comments */}
                  <Box
                    id='kudosX'
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
                      alt='kudos-img'
                      layout='static'
                      src='/images/kudos.jpeg'
                      priority={true}
                    />
                    <Box
                      className='kudosDescriptors'
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <Typography
                          variant='h6'
                          id='kudosCount'
                          className='kudos'
                          sx={{ fontWeight: 500 }}
                        >
                          Kudos:
                        </Typography>
                        <Typography variant='h6' sx={{ fontWeight: 600 }}>
                          {kudoersResults?.kudos.length ??
                            entryDetail?.kudos_count}
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
                          variant='h6'
                          id='commentCount'
                          className='kudos'
                          sx={{ fontWeight: 500 }}
                        >
                          Comments:
                        </Typography>
                        <Typography variant='h6' sx={{ fontWeight: 600 }}>
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
                      id='goldenHeartRate'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setCurrentStat((prevStat) => {
                          if (prevStat === 'heartRate') {
                            return null
                          }
                          return 'heartRate'
                        })
                      }}
                    >
                      <Image
                        alt='heart-rate'
                        height={100}
                        width={100}
                        layout='static'
                        src='/images/heartrate.png'
                        priority={true}
                      />
                      <Box
                        className='heartRateDescriptors'
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <Typography
                            id='avgHeartRate'
                            className='heartRate'
                            variant='h6'
                            sx={{ fontWeight: 500 }}
                          >
                            Avg:
                          </Typography>
                          <Typography
                            variant='h6'
                            sx={{ fontWeight: 600 }}
                          >{`${entryDetail?.average_heartrate} bpm`}</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <Typography
                            id='maxHeartRate'
                            className='heartRate'
                            variant='h6'
                            sx={{ fontWeight: 500 }}
                          >
                            Max:
                          </Typography>
                          <Typography
                            variant='h6'
                            sx={{ fontWeight: 600 }}
                          >{`${entryDetail?.max_heartrate} bpm`}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      id='goldenHeartRate'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        minHeight: '6rem',
                      }}
                    >
                      <Image
                        alt='heart-rate'
                        height={50}
                        width={50}
                        src='/images/heartrate.png'
                        layout='static'
                        priority={true}
                      />
                      <Typography variant='h6' sx={{ fontWeight: 500 }}>
                        No HR Info Available
                      </Typography>
                    </Box>
                  )}
                  {/* Trophy Case */}
                  <Box
                    id='trophyCase'
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
                      alt='trophy-img'
                      src='/images/trophy.jpeg'
                      layout='static'
                      priority={true}
                    />
                    <Box
                      className='achievementCountDescriptor'
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <Typography
                          variant='h6'
                          className='achievements'
                          id='achievementCount'
                          sx={{ fontWeight: 500 }}
                        >
                          Achievements:
                        </Typography>
                        <Typography variant='h6' sx={{ fontWeight: 600 }}>
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
                  <Box
                    sx={{ width: '100%', padding: '1rem', textAlign: 'center' }}
                  >
                    <Typography
                      variant='body2'
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
                      <Box
                        sx={{
                          width: '100%',
                          padding: '1rem',
                          textAlign: 'center',
                        }}
                      >
                        <Typography
                          variant='body2'
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
                            variant='h5'
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
                              {kudoersResults.kudos.map((kudoer) => (
                                <Box
                                  key={`${kudoer.firstname} ${kudoer.lastname}`}
                                  sx={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '.25rem',
                                    border: '1px solid #e0e0e0',
                                  }}
                                >
                                  <Typography
                                    variant='body1'
                                    sx={{ color: theme.palette.text.primary }}
                                  >
                                    {kudoer.firstname} {kudoer.lastname}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                padding: '1rem',
                                backgroundColor: '#fafafa',
                                borderRadius: '.25rem',
                                border: '1px solid #e0e0e0',
                                textAlign: 'center',
                              }}
                            >
                              <Typography
                                variant='body1'
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
                            variant='h5'
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
                                    borderRadius: '.25rem',
                                    border: '1px solid #e0e0e0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                  }}
                                >
                                  <Typography
                                    variant='body1'
                                    sx={{
                                      fontWeight: 600,
                                      color: theme.palette.strava.main,
                                    }}
                                  >
                                    {comment.athlete.firstname}{' '}
                                    {comment.athlete.lastname}
                                  </Typography>
                                  <Typography
                                    variant='body1'
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
                                variant='body1'
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
                          <Box
                            sx={{
                              width: '100%',
                              padding: '1rem',
                              textAlign: 'center',
                            }}
                          >
                            <Typography
                              variant='body2'
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
                            const bestEffortsExist =
                              !!entryDetail?.best_efforts?.some(
                                (bestEffort) => bestEffort.achievements.length,
                              )

                            const segmentEffortsExist =
                              entryDetail?.segment_efforts?.some(
                                (segmentEffort) =>
                                  segmentEffort.achievements.length,
                              )

                            // Not only should best_efforts have a length but also at least one bestEffort should have an achievement with a length
                            if (
                              (achievementEffortView === 'best-effort' &&
                                bestEffortsExist) ||
                              (bestEffortsExist && !segmentEffortsExist)
                            ) {
                              return (
                                <AchievementsByEffort
                                  bestEfforts={
                                    entryDetail?.best_efforts?.filter(
                                      (bestEffort) =>
                                        bestEffort.achievements.length,
                                    ) || []
                                  }
                                  activityId={entryDetail?.id}
                                  toggleable={segmentEffortsExist}
                                />
                              )
                            }

                            if (
                              (achievementEffortView === 'best-segment' &&
                                segmentEffortsExist) ||
                              (segmentEffortsExist && !bestEffortsExist)
                            ) {
                              return (
                                <AchievementsBySegment
                                  bestSegments={entryDetail?.segment_efforts.filter(
                                    (bestSegment) =>
                                      bestSegment.achievements.length,
                                  )}
                                  activityId={entryDetail?.id}
                                  toggleable={bestEffortsExist}
                                />
                              )
                            }

                            return null
                          })()}
                        </Then>
                      </If>
                    </Else>
                  </If>
                </Else>
              </If>
            </Else>
          </If>
        </Card>
      </Stack>
    </Stack>
  )
}

export default EntryDetail
