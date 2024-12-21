import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Button: Components<Omit<Theme, 'components'>>['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.primary,
      borderRadius: theme.shape.borderRadius * 2.5,
      textTransform: 'initial',
    }),
    text: ({ theme }) => ({
      color: theme.palette.primary.main,
      backgroundColor: 'transparent !important',
    }),
    containedPrimary: ({ theme }) => ({
      color: theme.palette.info.lighter,
      backgroundColor: theme.palette.primary.main,
      '&:hover': { backgroundColor: theme.palette.primary.main },
    }),
    containedSecondary: ({ theme }) => ({
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.info.lighter,
      '&:hover': { backgroundColor: theme.palette.info.lighter },
    }),
    sizeLarge: ({ theme }) => ({
      padding: theme.spacing(1.25, 2.25),
      fontSize: theme.typography.button.fontSize,
      fontWeight: 600,
    }),
    sizeMedium: ({ theme }) => ({
      padding: theme.spacing(1.125, 1.5),
      fontSize: theme.typography.body2.fontSize,
      fontWeight: 600,
    }),
    sizeSmall: ({ theme }) => ({
      padding: theme.spacing(1, 1.15),
      fontSize: theme.typography.caption.fontSize,
      fontWeight: 700,
    }),
    startIcon: {
      marginRight: 6,
    },
    endIcon: {
      marginLeft: 6,
    },
  },
};

export default Button;
