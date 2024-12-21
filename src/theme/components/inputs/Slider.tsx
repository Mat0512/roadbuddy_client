import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Slider: Components<Omit<Theme, 'components'>>['MuiSlider'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: 0,
      height: 8,
      width: '100%',
      '&.Mui-disabled': {
        color: theme.palette.primary.main,
      },
    }),
    track: {
      border: 'none',
    },
    thumb: ({ theme }) => ({
      height: 15,
      width: 15,
      border: 2,
      borderStyle: 'solid',
      borderColor: theme.palette.info.lighter,
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&::before': {
        display: 'none',
      },
    }),
  },
};

export default Slider;
