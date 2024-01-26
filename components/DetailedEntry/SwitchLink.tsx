import { Link, useTheme } from '@mui/material';
import { useDispatch, useSelector } from '@redux/reduxHooks';
import {
  getAchievementEffortView,
  toggleAchievementEffortView,
} from '@redux/slices';

const SwitchLink = () => {
  const dispatch = useDispatch();
  const achievementEffortView = useSelector(getAchievementEffortView);
  const theme = useTheme();
  return (
    <Link
      sx={{
        flex: 1,
        color: theme.palette.common.white,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '.25rem',
      }}
      onClick={() => {
        dispatch(toggleAchievementEffortView());
      }}
    >
      {achievementEffortView === 'best-segment'
        ? 'Switch to Best Effort View?'
        : 'Switch to Best Segment View?'}
    </Link>
  );
};

export default SwitchLink;
