import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import componentOverrides from './muiOverrides';

export const darkSlateGray = '#2F4F4F';
export const lightSlateGray = '#778899';
export const ivory = '#FFFFF0';

const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    baseBackground: { main: darkSlateGray },
    mainBackground: {
      main: darkSlateGray,
      light: lightSlateGray,
      dark: 'black',
      accent: ivory,
      entry: darkSlateGray,
    },
    strava: {
      main: '#FFFFF',
      contrastColor: ivory,
      contrastText: 'black',
    },
    common: { black: 'black', white: ivory },
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
    ...darkTheme,
    components: componentOverrides(darkTheme, true),
  });
};

export default globalTheme;
