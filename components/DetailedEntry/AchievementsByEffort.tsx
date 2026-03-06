import ActivityStreamMap from '@components/StravaEntries/ActivityMap/ActivityStreamMap'
import type { BestEffort } from '@components/StravaEntries/EntryTypes'
import { useCSX } from '@lib'
import { Box, Slider, Tooltip, useTheme } from '@mui/material'
import { type CSSProperties, useState } from 'react'
import AchievementHeader from './AchievementHeader'
import AchievementList from './AchievementList'
import { Wreath } from './Wreath'

const staticMarks = [
  {
    value: 400,
    label: '400m',
  },
  {
    value: 805,
    label: '1/2 Mile',
  },
  {
    value: 1000,
    label: '1k',
  },
  {
    value: 1609,
    label: '1 Mile',
  },
  {
    value: 3219,
    label: '2 Miles',
  },
  {
    value: 5000,
    label: '5k',
  },
  {
    value: 10000,
    label: '10k',
  },
  {
    value: 15000,
    label: '15k',
  },
  {
    value: 16090,
    label: '10 Miles',
  },
  {
    value: 20000,
    label: '20k',
  },
  {
    value: 21097,
    label: '1/2 Marathon',
  },
]

function valuetext(value: number) {
  return `${value}`
}

interface AchievementsProps {
  bestEfforts: BestEffort[] | undefined
  activityId: number | undefined
  toggleable: boolean | undefined
}

const calculateSliderValues = (bestEfforts: BestEffort[]) => {
  // Determing Slider
  const closestEffortDistance = bestEfforts[0].distance
  const furthestEffortDistance = bestEfforts[bestEfforts.length - 1].distance

  const staticMarksEndingIndex = staticMarks.findLastIndex(
    (x) => x.value <= furthestEffortDistance,
  )
  const staticMarksStartingIndex = staticMarks.findIndex(
    (x) => x.value >= closestEffortDistance,
  )

  const marksForSlider = staticMarks.slice(
    staticMarksStartingIndex,
    staticMarksEndingIndex + 1,
  )

  return [closestEffortDistance, furthestEffortDistance, marksForSlider]
}

const AchievementsByEffort = (props: AchievementsProps) => {
  const theme = useTheme()

  const [closestEffortDistance, furthestEffortDistance, baseMarks] =
    calculateSliderValues(props.bestEfforts || []) as [
      number,
      number,
      {
        value: number
        label: string
      }[],
    ]

  const marksForSlider = baseMarks.map((mark) => ({
    value: mark.value,
    label: (
      <Tooltip title={mark.label} arrow placement='top'>
        <span>{mark.label}</span>
      </Tooltip>
    ),
  }))

  const [currentSelectedDistance, setCurrentSelectedDistance] = useState(
    closestEffortDistance,
  )

  const [position, setPosition] = useState(0)

  const handleSetPosition = (p: number) => {
    setPosition(p)
  }
  const mobileColumns = useCSX(
    { flexDirection: 'row' },
    { flexDirection: 'column', justifyContent: 'center' },
  )
  const mobileWreathWidth = useCSX('48.35%', '100%', 'width')

  useCSX(
    {
      transform: 'rotate(45deg) translate(-15%, 25%)',
      '&:nth-of-type(8)': {
        transform: 'rotate(45deg) translate(-20%, -50%)',
      },
    },
    {
      transform: 'rotate(90deg) translate(0%, 54%)',
      '&:nth-of-type(6)': {
        transform: 'rotate(90deg) translate(0%, 120%)',
      },
      '&:nth-last-of-type(2)': {
        transform: 'rotate(90deg) translate(0%, 150%)',
      },
    },
  ) as CSSProperties

  const currentAchievements = props.bestEfforts?.filter(
    (effort) => effort.distance === currentSelectedDistance,
  )

  return (
    <Box
      sx={{
        height: '50rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box
        sx={{
          flex: 1,
          boxSizing: 'border-box',
          width: '100%',
          height: '100%',
        }}
      >
        <Box sx={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
          <AchievementHeader
            achievementHeaderTitle={currentAchievements?.[0]?.name || ''}
            currentSegmentDataLength={currentAchievements?.length}
            toggleable={props.toggleable}
            position={position}
            handleSetPosition={handleSetPosition}
          />
        </Box>
        <Box
          id='outer-slider'
          sx={{
            overflow: 'hidden',
            position: 'relative',
            height: '80%',
            boxSizing: 'border-box',
          }}
        >
          <Box
            id='inner-slider'
            sx={{
              transform: `translateX(${position * -100}%)`,
              display: 'flex',
              position: 'absolute',
              height: '100%',
              width: '100%',
            }}
          >
            {currentAchievements?.map((currentAchievement) => {
              return (
                <Box
                  key={currentAchievement.name}
                  sx={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    height: '100%',
                    paddingY: '.5rem',
                    minWidth: '100%',
                    padding: '.5rem',
                  }}
                >
                  <Box
                    sx={{
                      height: '30rem',
                      left: '50px',
                      position: 'absolute',
                      ...mobileWreathWidth,
                    }}
                  >
                    <Wreath />
                  </Box>
                  <Box
                    sx={{
                      height: '95%',
                      paddingY: '.5rem',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        height: '100%',
                        width: '95%',

                        border: `2px solid ${theme.palette.strava.main}`,
                        ...mobileColumns,
                      }}
                    >
                      <AchievementList {...currentAchievement} />
                      {currentAchievement?.achievements.length ? (
                        <ActivityStreamMap
                          startIndex={currentAchievement.start_index}
                          endIndex={currentAchievement.end_index}
                          activityId={props.activityId}
                        />
                      ) : null}
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '1rem',
          paddingBottom: '8rem',
        }}
      >
        <Slider
          max={furthestEffortDistance}
          min={closestEffortDistance}
          value={currentSelectedDistance}
          aria-label='Custom marks'
          defaultValue={closestEffortDistance}
          getAriaValueText={valuetext}
          // Restricted values step=null
          step={null}
          valueLabelDisplay='off'
          marks={marksForSlider}
          onChange={(_e, value) => setCurrentSelectedDistance(value as number)}
          sx={{
            '.MuiSlider-thumb': {
              border: `1px solid ${theme.palette.common.white}`,
            },
            ...(() => {
              if (closestEffortDistance === furthestEffortDistance) {
                return {
                  justifyContent: 'center',
                  display: 'flex',
                  '.MuiSlider-thumb': {
                    border: `1px solid ${theme.palette.common.white}`,
                    bgcolor: theme.palette.common.black,
                  },
                  '.MuiSlider-rail': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: theme.palette.common.black,
                    opacity: '0.2',
                  },
                }
              }
              return {}
            })(),
            marginX: '4rem',
            width: 'calc(100% - 8rem)',
            '& .MuiSlider-markLabel': {
              top: '3rem !important',
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: '0.75rem',
              transform: 'rotate(-35deg) translateX(-4rem) !important',
              transformOrigin: 'top left !important',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'right',
              '&:nth-of-type(even)': {
                top: '4rem !important',
              },
              '& span': {
                display: 'inline-block',
                color: theme.palette.text.primary,
              },
            },
          }}
        />
      </Box>
    </Box>
  )
}

export default AchievementsByEffort
