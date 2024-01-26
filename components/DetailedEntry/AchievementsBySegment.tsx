import { CSSProperties, useState } from 'react';
import { SegmentEffort } from '@components/StravaEntries/EntryTypes';
import { Wreath } from './Wreath';
import { Box, Slider, useTheme } from '@mui/material';
import ActivityStreamMap from '@components/StravaEntries/ActivityMap/ActivityStreamMap';
import AchievementList from './AchievementList';
import { useCSX } from '@lib';
import AchievementHeader from './AchievementHeader';
import Swipeable from './Swipeable';

interface AchievementsProps {
  bestSegments: SegmentEffort[];
  activityId: number;
  toggleable: boolean;
}

const AchievementsBySegment = (props: AchievementsProps) => {
  const theme = useTheme();
  const [position, setPosition] = useState(0);

  const handleSetPosition = (p: number) => {
    setPosition(p);
  };

  const reduced = props.bestSegments.reduce(
    (total, item, index) => {
      if (!total[item.name]) {
        total[item.name] = {
          name: item.name,
          value: index * 10,
          data: [item],
        };
      } else {
        total[item.name].data.push(item);
      }
      return total;
    },
    {} as {
      [name: string]: {
        name: string;
        value: number;
        data: SegmentEffort[];
      };
    }
  );

  let marksForSlider = [];
  for (let key in reduced) {
    marksForSlider.push({
      label: reduced[key].name,
      value: reduced[key].value,
    });
  }

  const [currentlySelectedEffort, setCurrentlySelectedEffort] = useState(0);
  const mobileColumns = useCSX(
    { flexDirection: 'row' },
    { flexDirection: 'column', justifyContent: 'center' }
  );
  const mobileWreathWidth = useCSX('48.35%', '100%', 'width');

  const mobileLabelTransform = useCSX(
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
    }
  ) as CSSProperties;

  const entries = Object.entries(reduced);
  const [currentSegmentName, currentSegment] = entries.find(
    (segmentArr) => segmentArr[1].value === currentlySelectedEffort
  )!;

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
        <AchievementHeader
          achievementHeaderTitle={currentSegmentName}
          handleSetPosition={handleSetPosition}
          position={position}
          toggleable={props.toggleable}
          currentSegmentDataLength={currentSegment.data.length}
        />
        <Box
          id="outer-slider"
          sx={{
            overflow: 'hidden',
            position: 'relative',
            height: '80%',
          }}
        >
          <Box
            id="inner-slider"
            sx={{
              transform: `translateX(${position * -100}%)`,
              display: 'flex',
              position: 'absolute',
              height: '100%',
              width: '100%',
            }}
          >
            <Swipeable>
              {currentSegment.data?.map((currentEffort, key) => {
                return (
                  <Box
                    sx={{ height: '100%', paddingY: '.5rem', minWidth: '100%' }}
                    key={key}
                  >
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
                      <AchievementList {...currentEffort} />

                      {currentEffort?.achievements.length ? (
                        <ActivityStreamMap
                          startIndex={currentEffort.start_index}
                          endIndex={currentEffort.end_index}
                          activityId={props.activityId}
                        />
                      ) : null}
                    </Box>
                  </Box>
                );
              })}
            </Swipeable>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingBottom: '1rem',
        }}
      >
        <Slider
          min={0}
          max={(marksForSlider.length - 1) * 10}
          value={currentlySelectedEffort}
          aria-label="Custom marks"
          defaultValue={currentlySelectedEffort}
          getAriaValueText={() => 'valuetext'}
          // Restricted values step=null
          step={null}
          valueLabelDisplay="off"
          marks={marksForSlider}
          onChange={(_e, value) => {
            setCurrentlySelectedEffort(value as number);
          }}
          sx={{
            '.MuiSlider-thumb': {
              border: `1px solid ${theme.palette.common.white}`,
            },
            ...(() => {
              if (entries.length === 1) {
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
                };
              }
              return {};
            })(),
            marginY: '1rem',
            marginX: '2rem',
            '& .MuiSlider-markLabel': { ...mobileLabelTransform },
          }}
        />
      </Box>
    </Box>
  );
};

export default AchievementsBySegment;
