import {
  PaletteOptions,
  SimplePaletteColorOptions,
  ThemeOptions,
} from '@mui/material';
import { ColorPartial } from '@mui/material/styles/createPalette';

interface TypedPalette extends PaletteOptions {
  baseBackground: SimplePaletteColorOptions;
  grey: ColorPartial;
}

const muiOverrides = (
  globalTheme: ThemeOptions,
  darkMode: boolean
): ThemeOptions['components'] => {
  const palette = globalTheme.palette! as TypedPalette;
  return {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {},
      },
    },
  };
};

export default muiOverrides;
