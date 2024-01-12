/* eslint-disable react/no-unknown-property */
import '../styles/globals.css';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { ThemeProvider, useTheme } from '@mui/material';
import lightTheme from '../theme/muiLightTheme';
import darkTheme from '../theme/muiDarkTheme';
import { useFetchData } from '@lib';
import { appInitialState, getDarkModeCondition } from '@redux/slices';
import GlobalStore from '@redux/store';
import { useSelector } from '@redux/reduxHooks';

const ThemeComponent = (props: AppProps & { initialDarkMode?: boolean }) => {
  const darkMode = useSelector(getDarkModeCondition);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <AppComponent {...props} />
    </ThemeProvider>
  );
};
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

const StravaReportGenerator = (props: AppProps) => {
  const { data: userSettings } = useFetchData<{
    defaultFormat: string;
    defaultSport: string;
    defaultDate: string;
    darkMode: boolean;
  }>('/api/userSettings');

  return (
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
      <ThemeComponent {...props} initialDarkMode={userSettings?.darkMode} />
    </Provider>
  );
};

export default StravaReportGenerator;
