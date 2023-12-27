import Head from 'next/head';
import { Box } from '@mui/material';
import App from '../components/App/App';
import { Provider } from 'react-redux';
import GlobalStore from '../redux/store';

export default function Home() {
  return (
    <Box style={{ width: '100%', display: 'flex' }}>
      <Head>
        <title>Strava Report Generator</title>
        <meta name="description" content="A ordered list of strava activites" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>
      <Provider store={GlobalStore.prototype.configureGlobalStore({})}>
        <App />
      </Provider>
    </Box>
  );
}
