import React from 'react';
import { Box, ListItem, Typography } from '@mui/material';

const EmptyEntry = () => (
  <ListItem sx={{ display: 'flex', padding: 0 }}>
    <Box
      className="innerEntry"
      sx={{
        width: '100%',
        border: '1px solid coral',
        backgroundColor: 'paleturquoise',
        '&:hover': {
          backgroundColor: 'darkturquoise',
          p: {
            color: 'ivory',
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
            color: 'orangered',
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

export default EmptyEntry;
