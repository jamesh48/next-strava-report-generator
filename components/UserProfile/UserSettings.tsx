import {
  Box,
  Dialog,
  Typography,
  Button,
  Select,
  MenuItem,
  Divider,
  Collapse,
} from '@mui/material';
import { Close, Warning } from '@mui/icons-material';
import { useDispatch, useSelector } from '@redux/reduxHooks';
import {
  getSortCondition,
  getSportCondition,
  getDateCondition,
  setSortCondition,
  setSportCondition,
  setDateCondition,
  useDestroyUserAndActivitiesMutation,
  DateCondition,
} from '@redux/slices';
import axios from 'axios';
import { useState } from 'react';
import usePopupModal from 'lib/usePopupModal';

interface UserSettingsProps {
  closeUserSettingsCB: () => void;
}
const UserSettings = (props: UserSettingsProps) => {
  const dispatch = useDispatch();
  const [destroyUserAndActivities] = useDestroyUserAndActivitiesMutation({
    fixedCacheKey: 'destroy-user-key',
  });
  const defaultSortCondition = useSelector(getSortCondition);
  const defaultSportCondition = useSelector(getSportCondition);
  const [_fromDate, _toDate, defaultDateCondition] =
    useSelector(getDateCondition);

  const [selectedFormat, setSelectedFormat] = useState(defaultSortCondition);
  const [selectedSport, setSelectedSport] = useState(defaultSportCondition);
  const [selectedDate, setSelectedDate] = useState<DateCondition>(
    defaultDateCondition as DateCondition
  );
  const [dangerArea, setDangerArea] = useState(false);

  const destroyUser = async () => {
    await destroyUserAndActivities(null);
  };

  const [open] = usePopupModal();

  return (
    <Dialog open={true}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '25rem',
          top: '10rem',
          bgcolor: 'darkslategray',
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
              color: 'turquoise',
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
              outline: '1px solid orangered',
              padding: '1rem .5rem',
              margin: '.5rem',
              color: 'turquoise',
            }}
          >
            <Close />
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
              sx={{ color: 'darkturquoise', cursor: 'default', flex: 1 }}
            >
              Default Sport
            </Typography>
            <Select
              sx={{ height: '2rem', width: '15rem' }}
              defaultValue={defaultSportCondition}
              inputProps={{ sx: { color: 'coral' } }}
              onChange={(event) => setSelectedSport(event.target.value)}
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
              sx={{ color: 'darkturquoise', cursor: 'default', flex: 1 }}
            >
              Default Sort
            </Typography>
            <Select
              sx={{ height: '2rem', width: '15rem' }}
              defaultValue={defaultSortCondition}
              inputProps={{ sx: { color: 'coral' } }}
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
              sx={{ color: 'darkturquoise', cursor: 'default', flex: 1 }}
            >
              Default Date
            </Typography>
            <Select
              sx={{ height: '2rem', width: '15rem' }}
              defaultValue={defaultDateCondition}
              inputProps={{ sx: { color: 'coral' } }}
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
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '.5rem',
            }}
          >
            <Button
              sx={{ color: 'darkturquoise' }}
              onClick={() => {
                const asyncFn = async () => {
                  await axios({
                    url: '/api/userSettings',
                    method: 'POST',
                    data: {
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
          <Warning sx={{ color: 'orangered', paddingX: '.25rem' }} />
          <Typography sx={{ color: 'darkturquoise' }}>Danger Zone</Typography>
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
              sx={{
                color: 'darkturquoise',
                border: '1px solid white',
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
