import {
  Box,
  Dialog,
  Typography,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

interface UserSettingsProps {
  closeUserSettingsCB: () => void;
}
const UserSettings = (props: UserSettingsProps) => {
  const [selectedFormat, setSelectedFormat] = useState('speedDesc');
  const [selectedSport, setSelectedSport] = useState('running');

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
              padding: '.5rem',
              margin: '.5rem',
              color: 'turquoise',
            }}
          >
            X
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
              defaultValue="running"
              inputProps={{ sx: { color: 'coral' } }}
              onChange={(event) => setSelectedSport(event.target.value)}
            >
              <MenuItem value="running">Running</MenuItem>
              <MenuItem value="swimming">Swimming</MenuItem>
              <MenuItem value="cycling">Cycling</MenuItem>
              <MenuItem value="walking">Walking</MenuItem>
            </Select>
          </Box>
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
              Default Sort
            </Typography>
            <Select
              sx={{ height: '2rem', width: '15rem' }}
              defaultValue="speedDesc"
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
                    data: { selectedFormat, selectedSport },
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  props.closeUserSettingsCB();
                };

                asyncFn();
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UserSettings;
