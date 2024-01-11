/* eslint-disable react/no-unknown-property */
import '../styles/globals.css';
import { ThemeProvider, useTheme } from '@mui/material';
import { Provider } from 'react-redux';
import lightTheme from '../theme/muiLightTheme';
import darkTheme from '../theme/muiDarkTheme';
import { AppProps } from 'next/app';
import { useFetchData } from '@lib';
import { appInitialState } from '@redux/slices';
import GlobalStore from '@redux/store';

const AppComponent = ({ Component, pageProps }: AppProps) => {
  const theme = useTheme();

  return (
    <>
      <Component {...pageProps} />
      <style jsx global>{`
        html {
          height: 100vh;
          background-color: ${theme.palette.baseBackground.main};
        }
      `}</style>
    </>
  );
};
function MyApp(props: AppProps) {
  const { data: userSettings } = useFetchData<{
    defaultFormat: string;
    defaultSport: string;
    defaultDate: string;
  }>('/api/userSettings');

  return (
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
        <AppComponent {...props} />
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
