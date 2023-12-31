import { WarningAmberOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { useDispatch, useSelector } from '@redux/reduxHooks';
import { getPopupModalDetails, setModalState } from '@redux/slices';

const PopupModal = () => {
  const { title, body, severity, state } = useSelector(getPopupModalDetails);
  const open = state !== 'closed' && Boolean(body) && Boolean(title);
  const dispatch = useDispatch();

  return (
    <Dialog
      transitionDuration={{ exit: 0, appear: 300, enter: 300 }}
      PaperProps={{ sx: { padding: '1rem', gap: '1rem' } }}
      open={open}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        {severity === 'error' && (
          <WarningAmberOutlined
            sx={() => ({
              fontSize: '1.5rem',
              color: 'red',
            })}
          />
        )}
        <Typography
          id="alert-dialog-title"
          sx={{ fontSize: '1.25rem', fontWeight: 600 }}
        >
          {title}
        </Typography>
      </Box>
      <Typography id="alert-dialog-description">{body}</Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: '1rem',
          gap: '1rem',
        }}
      >
        {severity === 'warning' && (
          <Button
            value="Cancel"
            onClick={() => dispatch(setModalState('canceled'))}
            variant="outlined"
          >
            No, cancel
          </Button>
        )}
        <Button
          value="OK"
          sx={{ minWidth: '7.5rem' }}
          onClick={() => dispatch(setModalState('confirmed'))}
          variant="contained"
        >
          {severity === 'warning' ? 'Yes, continue' : 'OK'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default PopupModal;
