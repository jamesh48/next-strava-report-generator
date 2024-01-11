/* eslint-disable react/no-unknown-property */
import '../styles/globals.css';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { ThemeProvider, useTheme } from '@mui/material';
import lightTheme from '../theme/muiLightTheme';
import darkTheme from '../theme/muiDarkTheme';
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
    darkMode: boolean;
  }>('/api/userSettings');

  return (
    <ThemeProvider theme={userSettings?.darkMode ? darkTheme : lightTheme}>
      <Provider
        store={GlobalStore.prototype.configureGlobalStore({
          app: {
            ...appInitialState,
            sortCondition: userSettings?.defaultFormat,
            sportCondition: userSettings?.defaultSport,
            dateCondition: userSettings?.defaultDate,
            darkMode: userSettings?.darkMode,
          },
        })}
      >
        <AppComponent {...props} />
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
