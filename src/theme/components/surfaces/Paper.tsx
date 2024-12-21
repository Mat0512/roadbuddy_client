import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Paper: Components<Omit<Theme, 'components'>>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(2.5),
      backgroundColor: theme.palette.info.lighter,
      borderRadius: theme.shape.borderRadius * 3,
      overflow: 'hidden',
      boxShadow: 'none',

      '&.MuiMenu-paper': {
        padding: 0,
        boxShadow: theme.customShadows[0],
      },
    }),
  },
};

export default Paper;
