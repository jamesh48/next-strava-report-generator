/* eslint-disable react/no-unknown-property */
import '../styles/globals.css';
import { ThemeProvider, useTheme } from '@mui/material';
import lightTheme from '../theme/muiLightTheme';
import { AppProps } from 'next/app';

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
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <AppComponent Component={Component} pageProps={pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
