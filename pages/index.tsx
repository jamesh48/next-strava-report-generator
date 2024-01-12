import React from 'react';
import Head from 'next/head';
import { Box } from '@mui/material';
//

import App from '@components/App/App';

export default function Home() {
  return (
    <Box>
      <Head>
        <title>Strava Report Generator</title>
        <meta name="description" content="A ordered list of strava activites" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>

      <App />
    </Box>
  );
}
