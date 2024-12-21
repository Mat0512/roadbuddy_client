import { PaletteColorOptions, PaletteOptions } from '@mui/material/styles';
import { gray, darkGray, transparentGray, red, green, blue, yellow, white } from './colors';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    neutral?: PaletteColorOptions;
    transparent?: {
      gray: PaletteColorOptions;
    };
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    state?: string;
  }
  interface Palette {
    neutral: PaletteColor;
    transparent: {
      gray: PaletteColor;
    };
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
    state: string;
  }
}

const palette: PaletteOptions = {
  neutral: {
    lighter: gray[100],
    light: gray[200],
    main: gray[500],
    darker: gray[900],
  },
  primary: {
    light: blue[100],
    main: blue[500],
    dark: darkGray[500],
  },
  secondary: {
    light: blue[200],
    main: blue[600],
    dark: darkGray[800],
  },
  info: {
    lighter: white[100],
    light: white[200],
    main: white[300],
    dark: white[400],
    darker: white[500],
  },
  success: {
    light: green[100],
    main: green[500],
    dark: green[800],
  },
  warning: {
    light: yellow[100],
    main: yellow[500],
    dark: yellow[800],
  },
  error: {
    light: red[100],
    main: red[500],
    dark: red[800],
  },
  text: {
    primary: darkGray[500],
    secondary: gray[400],
    disabled: gray[300],
  },
  transparent: {
    gray: {
      main: transparentGray[500],
    },
  },
};

export default palette;
