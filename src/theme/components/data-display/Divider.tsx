import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Divider: Components<Omit<Theme, 'components'>>['MuiDivider'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      height: 2,
      alignItems: 'center',
      margin: theme.spacing(3, 0),
      backgroundColor: theme.palette.info.main,
      borderColor: theme.palette.info.lighter,

      '&.MuiDivider-withChildren': {
        height: '0 !important',
        color: theme.palette.text.secondary,
        backgroundColor: 'transparent',
        '&::before': {
          backgroundColor: theme.palette.info.main,
        },
        '&::after': {
          backgroundColor: theme.palette.info.main,
        },
      },
    }),
  },
};

export default Divider;
