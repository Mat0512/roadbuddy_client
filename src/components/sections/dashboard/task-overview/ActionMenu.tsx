import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';

interface Action {
  id: number;
  icon: string;
  title: string;
}

const actions: Action[] = [
  {
    id: 1,
    icon: 'hugeicons:file-sync',
    title: 'Sync',
  },
  {
    id: 2,
    icon: 'hugeicons:pencil-edit-02',
    title: 'Edit',
  },
  {
    id: 3,
    icon: 'hugeicons:delete-02',
    title: 'Remove',
  },
];

const ActionMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleActionButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionItemClick = () => {
    handleActionMenuClose();
  };

  return (
    <Box pr={1.5}>
      <IconButton
        onClick={handleActionButtonClick}
        sx={{ p: 0.75, border: 'none', bgcolor: 'transparent !important' }}
        size="large"
      >
        <IconifyIcon icon="iconamoon:menu-kebab-horizontal-fill" color="text.primary" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleActionMenuClose}
        onClick={handleActionMenuClose}
        sx={{
          mt: 0.5,
          '& .MuiList-root': {
            width: 140,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {actions.map((actionItem) => {
          return (
            <MenuItem key={actionItem.id} onClick={handleActionItemClick}>
              <ListItemIcon sx={{ mr: 1, fontSize: 'h5.fontSize' }}>
                <IconifyIcon
                  icon={actionItem.icon}
                  color={actionItem.id === 3 ? 'error.main' : 'text.primary'}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography color={actionItem.id === 3 ? 'error.main' : 'text.primary'}>
                  {actionItem.title}
                </Typography>
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default ActionMenu;
