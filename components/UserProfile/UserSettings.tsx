import {
  Box,
  Dialog,
  Typography,
  Button,
  Select,
  MenuItem,
  Divider,
  Collapse,
  useTheme,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Close, Warning } from '@mui/icons-material';
import { useDispatch, useSelector } from '@redux/reduxHooks';
import {
  getSortCondition,
  getSportCondition,
  getDarkModeCondition,
  getDateCondition,
  setSortCondition,
  setSportCondition,
  setDateCondition,
  useDestroyUserAndActivitiesMutation,
  DateCondition,
  setDarkMode,
} from '@redux/slices';
import axios from 'axios';
import { useState } from 'react';
import { usePopupModal } from '@lib';
import { Sport } from '@components/StravaEntries/EntryTypes';

interface UserSettingsProps {
  closeUserSettingsCB: () => void;
}
const UserSettings = (props: UserSettingsProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [destroyUserAndActivities] = useDestroyUserAndActivitiesMutation({
    fixedCacheKey: 'destroy-user-key',
  });

  const defaultSortCondition = useSelector(getSortCondition);
  const defaultSportCondition = useSelector(getSportCondition);
  const defaultDarkModeCondition = useSelector(getDarkModeCondition);
  const [_fromDate, _toDate, defaultDateCondition] =
    useSelector(getDateCondition);
  const [selectedDarkMode, setSelectedDarkMode] = useState(
    defaultDarkModeCondition
  );
  const [selectedFormat, setSelectedFormat] = useState(defaultSortCondition);
  const [selectedSport, setSelectedSport] = useState<Sport>(
    defaultSportCondition
  );
  const [selectedDate, setSelectedDate] = useState<DateCondition>(
    defaultDateCondition as DateCondition
  );
  const [dangerArea, setDangerArea] = useState(false);

  const destroyUser = async () => {
    await destroyUserAndActivities(null);
  };

  const [open] = usePopupModal();

  return (
    <Dialog
      open={true}
      PaperProps={{
        sx: {
          border: '1px solid ' + theme.palette.strava.main,
          boxShadow: '2.5px 2.5px .25rem 0px ' + theme.palette.strava.main,
        },
      }}
    >
      <Box
        sx={{
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '25rem',
          top: '10rem',

          bgcolor: theme.palette.mainBackground.main,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            borderBottom: '1px solid lightslategray',
            height: '3rem',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              color: theme.palette.strava.main,
              cursor: 'default',
            }}
          >
            SRG User Settings
          </Typography>
          <Button
            onClick={props.closeUserSettingsCB}
            sx={{
              display: 'flex',
              height: '1.5rem',
              outline: '1px solid ' + theme.palette.strava.main,
              padding: '1rem .5rem',
              margin: '.5rem',
              color: theme.palette.strava.main,
            }}
          >
            <Close data-testid="userpreferences-closebutton" />
          </Button>
        </Box>
        <Box>
          <Box
            sx={{
              display: 'flex',
              paddingX: '1.5rem',
              paddingY: '.75rem',
              justifyContent: 'flex-start',
            }}
          >
            <Typography
              sx={{ cursor: 'default', flex: 1 }}
              color={theme.palette.strava.main}
            >
              Default Sport
            </Typography>
            <Select
              sx={{ height: '2rem', width: '15rem' }}
              defaultValue={defaultSportCondition}
              inputProps={{ sx: { color: theme.palette.strava.contrastColor } }}
              onChange={(event) =>
                setSelectedSport(event.target.value as Sport)
              }
            >
              {/* Values correspond with radio values */}
              <MenuItem value="Run">Running</MenuItem>
              <MenuItem value="Swim">Swimming</MenuItem>
              <MenuItem value="Ride">Cycling</MenuItem>
              <MenuItem value="Walk">Walking</MenuItem>
            </Select>
          </Box>
        </Box>
        {/* Default Sort */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              paddingX: '1.5rem',
              paddingY: '.75rem',
              justifyContent: 'flex-start',
            }}
          >
            <Typography
              color={theme.palette.strava.main}
              sx={{ cursor: 'default', flex: 1 }}
            >
              Default Sort
            </Typography>
            <Select
              sx={{ height: '2rem', width: '15rem' }}
              defaultValue={defaultSortCondition}
              inputProps={{ sx: { color: theme.palette.strava.contrastColor } }}
              onChange={(event) => setSelectedFormat(event.target.value)}
            >
              <MenuItem value="speedDesc">Speed: Fastest First</MenuItem>
              <MenuItem value="dateDesc">Date: Most Recent</MenuItem>
              <MenuItem value="dateAsc">Date: Least Recent</MenuItem>
              <MenuItem value="movingTimeDesc">
                Moving Time: Longest First
              </MenuItem>
              <MenuItem value="movingTimeAsc">
                Moving Time: Shortest First
              </MenuItem>
              <MenuItem value="timeElapsedDesc">
                Time Elapsed: Longest First
              </MenuItem>
              <MenuItem value="timeElapsedAsc">
                Time Elapsed: Shortest First
              </MenuItem>
            </Select>
          </Box>
        </Box>
        {/* Default Date */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              paddingX: '1.5rem',
              paddingY: '.75rem',
              justifyContent: 'flex-start',
            }}
          >
            <Typography
              color={theme.palette.strava.main}
              sx={{ cursor: 'default', flex: 1 }}
            >
              Default Date
            </Typography>
            <Select
              sx={{ height: '2rem', width: '15rem' }}
              defaultValue={defaultDateCondition}
              inputProps={{ sx: { color: theme.palette.strava.contrastColor } }}
              onChange={(event) =>
                setSelectedDate(event.target.value as DateCondition)
              }
            >
              <MenuItem value="allTime">All Time</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
            </Select>
          </Box>
        </Box>
        {/* Dark Mode */}
        <Box>
          <FormControlLabel
            labelPlacement="start"
            label="Dark Mode"
            sx={{
              color: theme.palette.strava.contrastColor,
              display: 'flex',
            }}
            checked={selectedDarkMode}
            onChange={() => setSelectedDarkMode((x) => !x)}
            control={
              <Switch
                disableRipple
                sx={{
                  width: 42,
                  height: 26,
                  padding: 0,
                  marginRight: '2rem',
                  marginLeft: '1rem',
                  marginY: '.5rem',
                  '& .MuiSwitch-switchBase': {
                    padding: 0,
                    margin: 0.3,
                    transitionDuration: '300ms',
                    '&.Mui-checked': {
                      transform: 'translateX(16px)',
                      color: '#fff',
                      '& + .MuiSwitch-track': {
                        backgroundColor: 'orangered',
                        opacity: 1,
                        border: 0,
                      },
                      '&.Mui-disabled + .MuiSwitch-track': {
                        opacity: 0.5,
                      },
                    },
                    '&.Mui-focusVisible .MuiSwitch-thumb': {
                      color: '#33cf4d',
                      border: '6px solid #fff',
                    },
                    '&.Mui-disabled .MuiSwitch-thumb': {
                      color:
                        theme.palette.mode === 'light'
                          ? theme.palette.grey[100]
                          : theme.palette.grey[600],
                    },
                    '&.Mui-disabled + .MuiSwitch-track': {
                      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
                    },
                  },
                  '& .MuiSwitch-thumb': {
                    boxSizing: 'border-box',
                    width: 22,
                    height: 22,
                  },
                  '& .MuiSwitch-track': {
                    borderRadius: 26 / 2,
                    backgroundColor:
                      theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
                    opacity: 1,
                    transition: theme.transitions.create(['background-color'], {
                      duration: 500,
                    }),
                  },
                }}
              />
            }
          />
        </Box>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '.5rem',
            }}
          >
            <Button
              sx={{ color: theme.palette.strava.main }}
              onClick={() => {
                const asyncFn = async () => {
                  await axios({
                    url: '/api/userSettings',
                    method: 'POST',
                    data: {
                      selectedDarkMode,
                      selectedFormat,
                      selectedSport,
                      selectedDate,
                    },
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  dispatch(setSportCondition(selectedSport));
                  dispatch(setSortCondition(selectedFormat));
                  dispatch(setDateCondition(selectedDate));
                  dispatch(setDarkMode(selectedDarkMode));
                  props.closeUserSettingsCB();
                };

                asyncFn();
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
        <Divider color="white" />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            cursor: 'pointer',
            paddingY: '.5rem',
          }}
          onClick={() => setDangerArea((ex) => !ex)}
        >
          <Warning sx={{ color: 'red', paddingX: '.25rem' }} />
          <Typography color="red">Danger Zone</Typography>
        </Box>
        <Collapse in={dangerArea} collapsedSize={'0'} orientation="vertical">
          <Box
            sx={{
              padding: '.75rem',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              disabled={!dangerArea}
              sx={{
                color: theme.palette.strava.main,
                border: '1px solid ' + theme.palette.strava.main,
                width: '75%',
                display: 'flex',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() =>
                open({
                  body: 'This will destroy all saved user information including cached activities, api tokens, and user profile and settings, This may take some time, but when completed you will be redirected to the auth page, continue?',
                  title: 'Destroy User Information?',
                  severity: 'warning',
                  onConfirm: () => {
                    props.closeUserSettingsCB();
                    destroyUser();
                  },
                })
              }
            >
              Destroy All User Information
            </Button>
          </Box>
        </Collapse>
      </Box>
    </Dialog>
  );
};

export default UserSettings;
