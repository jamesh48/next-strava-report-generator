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
  const { data: userSettings } = useFetchData<{
    defaultFormat: string;
    defaultSport: string;
    defaultDate: string;
  }>('/api/userSettings');

  return (
    <Box>
      <Head>
        <title>Strava Report Generator</title>
        <meta name="description" content="A ordered list of strava activites" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <ThemeProvider theme={lightTheme}>
        <Provider
          store={GlobalStore.prototype.configureGlobalStore({
            app: {
              ...appInitialState,
              sortCondition: userSettings?.defaultFormat,
              sportCondition: userSettings?.defaultSport,
              dateCondition: userSettings?.defaultDate,
            },
          })}
        >
          <App />
        </Provider>
      </ThemeProvider>
    </Box>
  );
}
