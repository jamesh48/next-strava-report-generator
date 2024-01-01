import Head from 'next/head';
import { Box, Link, Typography } from '@mui/material';

const AccessDenied = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <Head>
      <title>Well this is Awkward..</title>
      <meta name="description" content="A ordered list of strava activites" />
      <link rel="icon" href="/images/favicon.png" />
    </Head>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        border: '1px solid orangered',
        padding: '5rem 3rem',
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: 'darkturquoise', textDecoration: 'underline' }}
      >
        Access Denied: You chose to not authorize...
      </Typography>
      <Typography
        sx={{
          color: 'darkturquoise',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        Please{' '}
        <Link
          sx={{ cursor: 'pointer', marginX: '.25rem' }}
          onClick={() =>
            window.location.replace('https://stravareportgenerator.com')
          }
        >
          Authorize
        </Link>{' '}
        or visit
        <Link
          sx={{ cursor: 'pointer', marginX: '.25rem' }}
          onClick={() => window.open('https://www.strava.com')}
        >
          strava.com
        </Link>
        to create an account first.
      </Typography>
      <Typography sx={{ display: 'flex', color: 'darkturquoise' }}>
        {">> See you in the Winner's Circle Champ."}
      </Typography>
    </Box>
  </Box>
);

export default AccessDenied;
