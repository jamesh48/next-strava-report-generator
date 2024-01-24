import { useEffect, useState } from 'react';
import { useCSX } from '@lib';
import { Box, Button, Link, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from '@redux/reduxHooks';
import {
  toggleAchievementEffortView,
  getAchievementEffortView,
} from '@redux/slices';

interface AchievementHeaderProps {
  achievementHeaderTitle: string;
  handleSetPosition: (p: number) => void;
  position: number;
  currentSegmentDataLength: number;
  toggleable: boolean;
}

const AchievementHeader = (props: AchievementHeaderProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [direction, setDirection] = useState('neutral');
  const achievementEffortView = useSelector(getAchievementEffortView);
  useEffect(() => {
    if (direction !== 'neutral') {
      let counter = Number(props.position);
      const wholeNumber = setInterval(() => {
        props.handleSetPosition(
          direction === 'forward'
            ? Number((counter += 0.1).toFixed(1))
            : Number((counter -= 0.1).toFixed(1))
        );
        if (Number(counter.toFixed(1)) % 1 === 0) {
          clearInterval(wholeNumber);
          setDirection('neutral');
        }
      }, 35);
      return () => {
        clearInterval(wholeNumber);
      };
    }
  }, [direction]);

  const changeEffort = (event: React.MouseEvent<HTMLElement>) => {
    const nextResult = /next-button/g.test(event.currentTarget.id);
    nextResult ? setDirection('forward') : setDirection('backward');
  };

  const mobileTitleCentered = useCSX(
    { width: '50%' },
    { width: '100%', textAlign: 'center' }
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minWidth: '100%',
        flexDirection: 'column',
        padding: '.5rem',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Typography
          variant="h3"
          sx={{
            borderBottom: '1px solid ' + theme.palette.strava.contrastText,
            color: theme.palette.common.white,
            ...mobileTitleCentered,
          }}
        >
          {props.achievementHeaderTitle}
        </Typography>
        <Box
          sx={{
            height: '5rem',
            flex: 1,
            display: 'flex',
            border: '1px solid white',
            alignItems: 'center',
          }}
        >
          <Button
            className={`arrow-button prev-next-button`}
            id="prev-button"
            disabled={Number(props.position) - 1 < 0 ? true : false}
            onClick={changeEffort}
            sx={{
              flex: 1,
              position: 'relative',
              border: 'none',
              width: '5rem',
              height: '5rem',
              background: 'transparent',
              transform: 'rotate(180deg)',
              borderRadius: '50%',
              '&:disabled': {
                display: 'none',
              },
            }}
          >
            <svg
              className="arrow-button-icon"
              viewBox="0 0 100 100"
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                left: '20%',
                top: '20%',
                height: '60%',
                width: '60%',
              }}
            >
              <path
                className="arrow"
                style={{
                  fill: 'red',
                  pointerEvents: 'none',
                  opacity: 1,
                }}
                d="M33.8352105,100 C31.4906934,99.997936 29.2429547,99.0649124 27.5861629,97.4060557 C24.1379457,93.9535448 24.1379457,88.3604714 27.5861629,84.9079605 L62.6044109,49.8897124 L27.5861629,14.8714644 C24.3395013,11.3872106 24.4353002,5.95761395 27.8028539,2.59006023 C31.1704076,-0.777493487 36.6000043,-0.873292384 40.0842581,2.37336919 L87.6006014,49.8897124 L40.0842581,97.4060557 C38.4274663,99.0649124 36.1797276,99.997936 33.8352105,100 L33.8352105,100 Z"
              />
            </svg>
          </Button>
          <Button
            sx={{
              flex: 1,
              border: 'none',
              width: '5rem',
              height: '5rem',
              background: 'transparent',
              transform: 'rotate(180deg)',
              borderRadius: '50%',
              '&:disabled': {
                display: 'none',
              },
            }}
            className={`arrow-button prev-next-button`}
            id="next-button"
            disabled={
              Number(props.position) + 1 > props.currentSegmentDataLength - 1
                ? true
                : false
            }
            onClick={changeEffort}
          >
            <svg
              className="arrow-button-icon"
              viewBox="0 0 100 100"
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                left: '20%',
                top: '20%',
                height: '60%',
                width: '60%',
              }}
            >
              <path
                className="arrow"
                style={{
                  fill: 'red',
                  pointerEvents: 'none',
                  opacity: 1,
                }}
                d="M33.8352105,100 C31.4906934,99.997936 29.2429547,99.0649124 27.5861629,97.4060557 C24.1379457,93.9535448 24.1379457,88.3604714 27.5861629,84.9079605 L62.6044109,49.8897124 L27.5861629,14.8714644 C24.3395013,11.3872106 24.4353002,5.95761395 27.8028539,2.59006023 C31.1704076,-0.777493487 36.6000043,-0.873292384 40.0842581,2.37336919 L87.6006014,49.8897124 L40.0842581,97.4060557 C38.4274663,99.0649124 36.1797276,99.997936 33.8352105,100 L33.8352105,100 Z"
                transform="translate(100, 100) rotate(180)"
              />
            </svg>
          </Button>
          {props.toggleable ? (
            <Link
              sx={{
                flex: 1,
                color: theme.palette.common.white,
                cursor: 'pointer',
              }}
              onClick={() => {
                dispatch(toggleAchievementEffortView());
              }}
            >
              {achievementEffortView === 'best-segment'
                ? 'Switch to Best Effort View?'
                : 'Switch to Best Segment View?'}
            </Link>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default AchievementHeader;
