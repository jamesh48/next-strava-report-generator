declare module '@mui/material/styles/createPalette' {
  interface Palette {
    baseBackground: Palette['primary'];
    strava: Palette['primary'];
    common: Palette['primary'];
  }

  interface PaletteOptions {
    baseBackground: PaletteOptions['primary'];
    strava: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    baseBackground: true;
    strava: true;
  }

  interface ButtonClasses {
    containedAtlanticAmethyst: string;
    outlinedAtlanticAmethyst: string;
    textAtlanticAmethyst: string;
  }
}

declare module '@mui/material/FormControl' {
  interface FormControlPropsColorOverrides {
    baseBackground: true;
    strava: true;
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    baseBackground: true;
  }
}

declare module '@mui/material/InputBase' {
  interface InputBasePropsColorOverrides {
    baseBackground: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    h6Profile: React.CSSProperties;
    small: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    h6Profile?: React.CSSProperties;
    small?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h6Profile: true;
    small: true;
    main: true;
  }
}

declare module '@mui/material/Badge' {
  interface BadgePropsColorOverrides {
    baseBackground: true;
    text: true;
  }
}

export {};
