import { useState } from 'react';
import { SegmentEffort } from '@components/StravaEntries/EntryTypes';
import { Wreath } from './Wreath';
import { Box, Slider, Tooltip, useTheme } from '@mui/material';
import ActivityStreamMap from '@components/StravaEntries/ActivityMap/ActivityStreamMap';
import AchievementList from './AchievementList';
import { useCSX } from '@lib';
import AchievementHeader from './AchievementHeader';
import Swipeable from './Swipeable';

interface AchievementsProps {
  bestSegments: SegmentEffort[] | undefined;
  activityId: number | undefined;
  toggleable: boolean;
}

const AchievementsBySegment = (props: AchievementsProps) => {
  const theme = useTheme();
  const [position, setPosition] = useState(0);

  const handleSetPosition = (p: number) => {
    setPosition(p);
  };

  const reduced = props.bestSegments?.reduce(
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
    const markLabel = reduced[key].name;
    marksForSlider.push({
      label: (
        <Tooltip title={markLabel} arrow placement="top">
          <span>{markLabel}</span>
        </Tooltip>
      ),
      value: reduced[key].value,
    });
  }

  const [currentlySelectedEffort, setCurrentlySelectedEffort] = useState(0);
  const mobileColumns = useCSX(
    { flexDirection: 'row' },
    { flexDirection: 'column', justifyContent: 'center' }
  );
  const mobileWreathWidth = useCSX('48.35%', '100%', 'width');

  const entries = Object.entries(reduced || {});
  const [currentSegmentName, currentSegment] = entries.find(
    (segmentArr) => segmentArr[1].value === currentlySelectedEffort
  )!;

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
            achievementHeaderTitle={currentSegmentName}
            handleSetPosition={handleSetPosition}
            position={position}
            toggleable={props.toggleable}
            currentSegmentDataLength={currentSegment.data.length}
          />
        </Box>
        <Box
          id="outer-slider"
          sx={{
            overflow: 'hidden',
            position: 'relative',
            height: '80%',
            boxSizing: 'border-box',
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
                    key={key}
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
                          border: '2px solid ' + theme.palette.strava.main,
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
          paddingTop: '1rem',
          paddingBottom: '8rem',
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
            marginBottom: 0,
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
            marginX: '6rem',
            width: 'calc(100% - 8rem)',
            '& .MuiSlider-markLabel': {
              top: '3rem !important',
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: '0.75rem',
              transform: 'rotate(-35deg) translateX(-8rem) !important',
              transformOrigin: 'top left !important',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'right',
              '&:nth-of-type(even)': {
                top: '2rem !important',
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
  );
};

export default AchievementsBySegment;
