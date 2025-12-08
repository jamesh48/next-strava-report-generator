import { BestEffort } from '@components/StravaEntries/EntryTypes';
import { formatElapsedTime, useCSX } from '@lib';
import { Box, Typography, useTheme } from '@mui/material';
import { useSelector } from '@redux/reduxHooks';
import { getAchievementEffortView } from '@redux/slices';

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
        gap: '1rem',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '.5rem',
        ...mobileMsgCentered,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: theme.palette.strava.main,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        {props.pr_rank}
        {abbreviation} Best {descriptor}!
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
            Elapsed Time:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {formatElapsedTime(props.elapsed_time)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
            Moving Time:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {formatElapsedTime(props.moving_time)}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, marginTop: '0.5rem' }}>
        {formattedStartTime} - {formattedEndTime}
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
        padding: '2rem',
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        ...mobileMsgCentered,
      }}
    >
      <Typography variant="h5" sx={{ color: theme.palette.text.secondary }}>
        Nothing to see here Champ!
      </Typography>
    </Box>
  );
};

export default AchievementList;
