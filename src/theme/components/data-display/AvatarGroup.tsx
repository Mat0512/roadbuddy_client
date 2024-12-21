import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const AvatarGroup: Components<Omit<Theme, 'components'>>['MuiAvatarGroup'] = {
  styleOverrides: {
    root: {},
    avatar: ({ theme }) => ({
      width: 24,
      height: 24,
      fontSize: theme.typography.body2.fontSize,
    }),
  },
};

export default AvatarGroup;
