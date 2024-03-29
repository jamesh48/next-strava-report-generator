import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import componentOverrides from './muiOverrides';

const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    baseBackground: { main: 'darkslategray' },
    mainBackground: {
      main: 'darkslategray',
      light: 'lightslategray',
      dark: 'black',
      accent: 'ivory',
      entry: 'darkslategray',
    },
    strava: {
      main: 'white',
      contrastColor: 'ivory',
      contrastText: 'black',
    },
    common: { black: 'black', white: 'ivory' },
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
