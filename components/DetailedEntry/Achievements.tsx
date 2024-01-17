import { useState } from 'react';
import {
  BestEffort,
  SegmentEffort,
} from '@components/StravaEntries/EntryTypes';
import { Wreath } from './Wreath';
import { Box, Slider, Typography, useTheme } from '@mui/material';
import ActivityStreamMap from '@components/StravaEntries/ActivityMap/ActivityStreamMap';
import AchievementList from './AchievementList';
import { useCSX } from '@lib';

const marks = [
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
];

function valuetext(value: number) {
  return `${value}`;
}

interface AchievementsProps {
  bestEfforts: BestEffort[];
  bestSegments: SegmentEffort[];
  activityId: number;
}
const Achievements = (props: AchievementsProps) => {
  const theme = useTheme();
  const [currentSelectedDistance, setCurrentSelectedDistance] = useState(400);
  const mobileColumns = useCSX(
    { flexDirection: 'row' },
    { flexDirection: 'column', justifyContent: 'center' }
  );
  const mobileWreathWidth = useCSX('48.35%', '100%', 'width');
  const mobileTitleCentered = useCSX(
    { width: '80%' },
    { width: '100%', textAlign: 'center' }
  );
  const mobileLabelTransform = useCSX(
    'rotate(45deg) translate(-15%, 25%)',
    'rotate(90deg) translate(-15%, 25%)',
    'transform'
  );
  if (!props.bestEfforts.length) return null;

  // Determing Slider
  const furthestEffortDistance =
    props.bestEfforts[props.bestEfforts.length - 1].distance;

  const marksEndingIndex = marks.findLastIndex(
    (x) => x.value <= furthestEffortDistance
  );
  const marksForSlider = marks.slice(0, marksEndingIndex + 1);

  const currentAchievement = props.bestEfforts.find(
    (effort) => effort.distance === currentSelectedDistance
  );

  return (
    <Box
      sx={{
        height: '40rem',
        width: '97.5%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box
        sx={{
          flex: 1,
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* Map the Entries here for each distance in case there are multiple */}
          {currentAchievement ? (
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                padding: '.5rem',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Typography
                  variant="h3"
                  sx={{
                    borderBottom:
                      '1px solid ' + theme.palette.strava.contrastText,
                    color: theme.palette.strava.contrastText,
                    ...mobileTitleCentered,
                  }}
                >
                  {currentAchievement.name}
                </Typography>
              </Box>
              <Box sx={{ height: '100%', paddingY: '.5rem' }}>
                <Box
                  sx={{
                    height: '30rem',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'absolute',
                    ...mobileWreathWidth,
                  }}
                >
                  <Wreath />
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    height: '100%',
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
          ) : null}
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '1rem',
        }}
      >
        <Slider
          max={furthestEffortDistance}
          min={400}
          value={currentSelectedDistance}
          aria-label="Custom marks"
          defaultValue={400}
          getAriaValueText={valuetext}
          // Restricted values step=null
          step={null}
          valueLabelDisplay="off"
          marks={marksForSlider}
          onChange={(_e, value) => setCurrentSelectedDistance(value as number)}
          sx={{
            '& .MuiSlider-markLabel': {
              ...mobileLabelTransform,
              // 1k Mile Marker
              '&:nth-of-type(8)': {
                transform: 'rotate(45deg) translate(-20%, -50%)',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Achievements;
