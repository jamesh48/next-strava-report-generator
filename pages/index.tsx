import React from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { Box, ThemeProvider } from '@mui/material';
//
import lightTheme from '../theme/muiLightTheme';
import App from '@components/App/App';
import GlobalStore from '@redux/store';
import { useFetchData } from '@lib';
import { appInitialState } from '@redux/slices';

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
