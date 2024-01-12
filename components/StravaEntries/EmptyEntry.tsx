import React from 'react';
import { Box, ListItem, Typography, useTheme } from '@mui/material';

const EmptyEntry = () => {
  const theme = useTheme();
  return (
    <ListItem sx={{ display: 'flex', padding: 0 }}>
      <Box
        className="innerEntry"
        sx={{
          width: '100%',
          border: '1px solid ' + theme.palette.strava.contrastColor,
          backgroundColor: theme.palette.mainBackground.light,
          '&:hover': {
            backgroundColor: theme.palette.mainBackground.dark,
            p: {
              color: theme.palette.strava.contrastText,
            },
          },
        }}
      >
        <Box
          className="generalEntry"
          sx={{
            padding: '10px',
          }}
        >
          <Typography
            variant="h6"
            className="entryTitle"
            id="noEntriesFound"
            sx={{
              paddingBottom: '0px',
              textDecoration: 'underline',
              paddingLeft: '.75rem',
              '&:hover': {
                color: 'blue',
              },
            }}
          >
            ~No Entries Found~
          </Typography>
          <Typography
            id="champ"
            sx={{
              paddingLeft: '1rem',
              paddingTop: '0px',
              paddingBottom: '10px',
            }}
          >
            But keep up the Good Work Champ!
          </Typography>
        </Box>
      </Box>
    </ListItem>
  );
};

export default EmptyEntry;
