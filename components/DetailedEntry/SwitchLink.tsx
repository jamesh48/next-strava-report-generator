import { Link, useTheme } from '@mui/material';
import { useDispatch, useSelector } from '@redux/reduxHooks';
import {
  getAchievementEffortView,
  toggleAchievementEffortView,
} from '@redux/slices';

const SwitchLink = () => {
  const dispatch = useDispatch();
  const achievementEffortView = useSelector(getAchievementEffortView);

  return (
    <Link
      sx={{
        flex: 1,
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
