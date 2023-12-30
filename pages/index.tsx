import React from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { Box } from '@mui/material';
//
import App from '@components/App/App';
import GlobalStore from '@redux/store';
import useFetchData from 'lib/useFetch';

export default function Home() {
  const { data: userSettings } = useFetchData<{
    defaultFormat: string;
    defaultSport: string;
  }>('/api/userSettings');

  return (
    <Box style={{ width: '100%', display: 'flex' }}>
      <Head>
        <title>Strava Report Generator</title>
        <meta name="description" content="A ordered list of strava activites" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <Provider
        store={GlobalStore.prototype.configureGlobalStore({
          app: {
            sortCondition: userSettings?.defaultFormat,
            sportCondition: userSettings?.defaultSport,
          },
        })}
      >
        <App />
      </Provider>
    </Box>
  );
}
