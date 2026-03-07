import { Box, ListItem, Typography } from '@mui/material'

const EmptyEntry = () => {
  return (
    <ListItem sx={{ display: 'flex', padding: 0 }}>
      <Box
        className='innerEntry'
        sx={{
          width: '100%',
          border: (theme) => `1px solid ${theme.palette.strava.contrastColor}`,
          backgroundColor: (theme) => theme.palette.mainBackground.main,
        }}
      >
        <Box className='generalEntry' sx={{ padding: '10px' }}>
          <Typography
            variant='h6'
            className='entryTitle'
            id='noEntriesFound'
            sx={{
              textDecoration: 'underline',
              paddingLeft: '.75rem',
            }}
          >
            ~No Entries Found~
          </Typography>
          <Typography
            sx={{
              paddingLeft: '1rem',
              paddingBottom: '10px',
            }}
          >
            {'>> Keep up the Good Work Champ!'}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  )
}

export default EmptyEntry
