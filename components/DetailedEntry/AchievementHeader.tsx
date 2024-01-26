import { useCSX, useMobileBrowserCheck } from '@lib';
import { Box, Typography, useTheme } from '@mui/material';
import CarouselArrows from './CarouselArrows';
import { useState, useEffect } from 'react';
import SwitchLink from './SwitchLink';

interface AchievementHeaderProps {
  achievementHeaderTitle: string;
  handleSetPosition: (p: number) => void;
  position: number;
  currentSegmentDataLength: number;
  toggleable: boolean;
}

const AchievementHeader = (props: AchievementHeaderProps) => {
  const theme = useTheme();
  const [direction, setDirection] = useState('neutral');
  const isMobile = useMobileBrowserCheck();

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
    return;
  }, [direction]);

  const mobileTitleCentered = useCSX(
    { width: '50%', flex: 1 },
    {
      flex: 1,
      width: '100%',
      textAlign: 'center',
      alignItems: 'center',
      display: 'flex',
    }
  );

  const changeEffort = (event: React.MouseEvent<HTMLElement>) => {
    const nextResult = /next-button/g.test(event.currentTarget.id);
    nextResult ? setDirection('forward') : setDirection('backward');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minWidth: '100%',
        flexDirection: 'column',
        padding: '.5rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
        }}
      >
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
        {!isMobile ? (
          <CarouselArrows
            position={props.position}
            changeEffort={changeEffort}
            currentSegmentDataLength={props.currentSegmentDataLength}
          />
        ) : null}
        {props.toggleable && !isMobile ? <SwitchLink /> : null}
      </Box>
      {props.toggleable && isMobile ? <SwitchLink /> : null}
    </Box>
  );
};

export default AchievementHeader;
