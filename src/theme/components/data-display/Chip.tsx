import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Chip: Components<Omit<Theme, 'components'>>['MuiChip'] = {
  styleOverrides: {
    root: {
      margin: 0,
      minWidth: 100,
      fontWeight: 600,
    },
    sizeSmall: ({ theme }) => ({
      height: 24,
      padding: theme.spacing(0, 1.5),
      fontSize: theme.typography.caption.fontSize,
    }),
    sizeMedium: ({ theme }) => ({
      height: 28,
      fontSize: theme.typography.body2.fontSize,
    }),
    colorPrimary: ({ theme }) => ({
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
    }),
    colorSuccess: ({ theme }) => ({
      color: theme.palette.success.main,
      backgroundColor: theme.palette.success.light,
    }),
    colorWarning: ({ theme }) => ({
      color: theme.palette.warning.dark,
      backgroundColor: theme.palette.warning.light,
    }),
    colorError: ({ theme }) => ({
      color: theme.palette.error.dark,
      backgroundColor: theme.palette.error.light,
    }),
    iconSmall: {
      width: 12,
      margin: '0 !important',
    },
    iconMedium: {
      width: 16,
      margin: '0 !important',
    },
    labelSmall: {
      padding: 0,
      textTransform: 'capitalize',
    },
    labelMedium: {
      padding: 0,
      textTransform: 'capitalize',
    },
  },
};

export default Chip;
