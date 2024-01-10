import { ThemeOptions } from '@mui/material';
import componentOverrides from './muiOverrides';
import { createTheme } from '@mui/material/styles';

const _typography = {
  htmlFontSize: 16,
  fontFamily: 'Open Sans',
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontWeight: 600,
    fontSize: 32,
    lineHeight: '40px',
  },
  h2: {
    fontWeight: 600,
    fontSize: 28,
    lineHeight: '40px',
  },
  h3: {
    fontWeight: 600,
    fontSize: 24,
    lineHeight: '32px',
  },
  h4: {
    fontWeight: 600,
    fontSize: 20,
    lineHeight: '24px',
  },
  h5: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '24px',
  },
  h5Mobile: {
    fontWeight: 600,
    fontSize: 18,
    lineHeight: '24px',
  },

  /** Desktop */
  body1: {
    fontWeight: 400,
    fontSize: 16,
    lineHeight: '24px',
  },
  /** Mobile */
  body2: {
    fontWeight: 400,
    fontSize: 18,
    lineHeight: '24px',
  },
  small: {
    fontWeight: 400,
    fontSize: 13,
    lineHeight: '16px',
  },
};

const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    baseBackground: { main: 'darkslategray' },
    strava: { main: 'orangered', contrastText: 'ivory' },
  },
  typography: {
    h6: {
      fontSize: 20,
      cursor: 'default',
      margin: '1em 0',
      textRendering: 'geometricPrecision',
      lineHeight: '1rem',
    },
  },
};

const globalTheme = () => {
  return createTheme({
    ...lightTheme,
    components: componentOverrides(lightTheme, false),
  });
};

export default globalTheme;
