import { Sport } from '@components/StravaEntries/EntryTypes';
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {
  useGetIndividualEntryQuery,
  useGetUserProfileQuery,
  useUpdateShoeIndividualEntryMutation,
} from '@redux/slices';
import { useRef, useState } from 'react';
import { When } from 'react-if';

interface EntryDetailProps {
  activityId: number;
  isSharedActivity?: true;
  sport: Sport;
}

const EntryDetail = ({
  activityId,
  isSharedActivity,
  sport,
}: EntryDetailProps) => {
  const gearRef = useRef<HTMLSelectElement>(null);
  const [editingShoes, setEditingShoes] = useState(false);
  const theme = useTheme();
  const { data: entryDetail } = useGetIndividualEntryQuery({
    entryid: activityId,
  });
  const { data: userProfile } = useGetUserProfileQuery(null);

  const [updateShoeIndividualEntryMutation] =
    useUpdateShoeIndividualEntryMutation();
  return (
    <Stack
      className="detailedEntry"
      sx={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid ' + theme.palette.strava.main,
        bgcolor: theme.palette.mainBackground.entry,
        textRendering: 'geometricPrecision',
        '& > p': {
          paddingLeft: '1.5%',
        },
      }}
    >
      <Stack
        className="topActivityDescription"
        sx={{
          marginX: '1%',
          width: '97.5%',
        }}
      >
        <Typography
          variant="h6"
          color={theme.palette.common.white}
          sx={{ textDecoration: 'underline' }}
        >
          Activity Description:
        </Typography>
        <Typography
          className="topActivityDescription"
          sx={{
            color: theme.palette.common.white,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            whiteSpace: 'pre-line',
            border: '1px solid ' + theme.palette.common.white,
            padding: '1rem',
          }}
          // onClick={props.handleEditingDescriptionChange}
        >
          {entryDetail?.description}
        </Typography>
      </Stack>
      <Box sx={{ display: 'flex', width: '100%' }}>
        {/* Device */}
        <When condition={entryDetail?.device_name}>
          <Box
            id="topActivityDevice"
            sx={{
              alignSelf: 'flex-start',
              marginLeft: '1.25%',
              color: theme.palette.common.white,
              padding: '.5rem',
              marginY: '.75rem',
              border: '1px solid ' + theme.palette.common.white,
              cursor: 'default',
            }}
          >
            <Typography>Device: {entryDetail?.device_name}</Typography>
          </Box>
        </When>
        {/* Gear - Shoes */}
        <When condition={['Run', 'Walk'].includes(sport)}>
          {entryDetail?.gear?.name && !editingShoes ? (
            <Box
              id="topActivityGear"
              sx={{
                alignSelf: 'flex-start',
                marginLeft: '1.25%',
                color: theme.palette.common.white,
                padding: '.5rem',
                marginY: '.75rem',
                border: '1px solid ' + theme.palette.common.white,
                cursor: 'default',
              }}
              onClick={() => {
                // Edge case where shoes don't exist or user is rate limited
                if (!isSharedActivity && userProfile?.shoes.length) {
                  setEditingShoes(true);
                }
              }}
            >
              <Typography>Gear: {entryDetail.gear.name}</Typography>
            </Box>
          ) : (
            <Box sx={{ marginY: '.75rem', marginX: '.5rem' }}>
              <When condition={!isSharedActivity && userProfile?.shoes.length}>
                <Select
                  ref={gearRef}
                  sx={{
                    height: '3rem',
                    width: '15rem',
                    ml: '7.5%',
                    color: theme.palette.common.white,
                    border: '1px solid ' + theme.palette.common.white,
                  }}
                  defaultValue="shoeChoose"
                  onChange={(e: SelectChangeEvent<string>) => {
                    if (e.target.value === 'shoeChoose') {
                      return;
                    }
                    const shoeId = e.target.value;
                    const shoeName = userProfile?.shoes.find(
                      (shoe) => shoe.id === shoeId
                    )?.name;
                    if (!shoeName) {
                      return;
                    }
                    if (entryDetail?.id) {
                      updateShoeIndividualEntryMutation({
                        shoeId,
                        activityId: entryDetail?.id,
                        shoeName,
                      });
                    }
                    setEditingShoes(false);
                  }}
                >
                  {[
                    <MenuItem key={-1} value="shoeChoose" disabled>
                      Choose Your Shoe!
                    </MenuItem>,
                  ].concat(
                    userProfile?.shoes.map((shoe, index) => (
                      <MenuItem value={shoe.id} key={index}>
                        {shoe.name}
                      </MenuItem>
                    )) || []
                  )}
                </Select>
              </When>
            </Box>
          )}
        </When>
      </Box>
    </Stack>
  );
};

export default EntryDetail;
