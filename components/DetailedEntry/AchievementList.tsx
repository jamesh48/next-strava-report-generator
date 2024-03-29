import { BestEffort } from '@components/StravaEntries/EntryTypes';
import { useCSX } from '@lib';
import { Box, Typography, useTheme } from '@mui/material';
import { useSelector } from '@redux/reduxHooks';
import { getAchievementEffortView } from '@redux/slices';

const formatTime = (elapsedTime: number) => {
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  let formattedTime = '';

  if (hours > 0) {
    formattedTime += `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  } else {
    formattedTime += `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return formattedTime;
};

const AchievementList = (
  props: Omit<BestEffort, 'start_index' | 'end_index'>
) => {
  const theme = useTheme();
  const abbreviation = props.pr_rank?.toString().endsWith('1')
    ? 'st'
    : props.pr_rank?.toString().endsWith('2')
    ? 'nd'
    : props.pr_rank?.toString().endsWith('3')
    ? 'rd'
    : null;
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZoneName: 'short',
    userTimeZone,
  } as const;
  const startOfEffort = new Date(props.start_date);
  const endOfEffort = new Date(
    new Date(props.start_date).getTime() + props.elapsed_time * 1000
  );
  const achievementEffortView = useSelector(getAchievementEffortView);
  const descriptor =
    achievementEffortView === 'best-effort' ? 'Effort' : 'Segment';
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedStartTime = formatter.format(startOfEffort);
  const formattedEndTime = formatter.format(endOfEffort);

  const mobileMsgCentered = useCSX(
    { width: '50%' },
    { width: '100%', flex: 1 }
  );
  return props.achievements.length ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: theme.palette.common.white,
        ...mobileMsgCentered,
      }}
    >
      <Typography variant="h4">
        {props.pr_rank}
        {abbreviation} Best {descriptor}!
      </Typography>
      <Typography variant="h5">
        Elapsed Time: {formatTime(props.elapsed_time)}
      </Typography>
      <Typography variant="h5">
        Moving Time: {formatTime(props.moving_time)}
      </Typography>
      <Typography>
        {formattedStartTime}-{formattedEndTime}
      </Typography>
    </Box>
  ) : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        color: theme.palette.strava.contrastText,
        ...mobileMsgCentered,
      }}
    >
      <Typography variant="h5" sx={{ opacity: 0.9 }}>
        Nothing to see here Champ!
      </Typography>
    </Box>
  );
};

export default AchievementList;
