import Head from 'next/head';
import { Box, Link, Typography, useTheme } from '@mui/material';

const AccessDenied = () => {
  const theme = useTheme();
  const handleReload = () => {
    window.location.replace('https://stravareportgenerator.com');
  };
  return (
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
          border: '1px solid ' + theme.palette.strava.main,
          padding: '5rem 3rem',
          bgcolor: theme.palette.mainBackground.dark,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.strava.main,
            textDecoration: 'underline',
          }}
        >
          Access Denied: You chose to not authorize...
        </Typography>
        <Typography
          sx={{
            color: theme.palette.strava.main,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Please{' '}
          <Link
            sx={{ cursor: 'pointer', marginX: '.25rem' }}
            onClick={handleReload}
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
        <Typography sx={{ display: 'flex', color: theme.palette.strava.main }}>
          {">> See you in the Winner's Circle Champ."}
        </Typography>
      </Box>
    </Box>
  );
};

export default AccessDenied;
