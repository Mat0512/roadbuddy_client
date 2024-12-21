declare module '@mui/material/styles' {
  interface Theme {
    customShadows: string[];
  }
  interface ThemeOptions {
    customShadows?: string[];
  }
}

const customShadows = ['5px 5px 20px 0px rgba(170,170,170,1)', '0 0 0 2px rgba(0, 0, 255, 0.2)'];

export default customShadows;
