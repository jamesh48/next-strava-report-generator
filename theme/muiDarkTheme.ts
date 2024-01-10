import { createTheme, ThemeOptions } from '@mui/material';
import componentOverrides from './muiOverrides';

const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    baseBackground: { main: '' },
    strava: { main: '' },
  },
};

const globalTheme = () => {
  return createTheme({
    ...darkTheme,
    components: componentOverrides(darkTheme, true),
  });
};

export default globalTheme;
