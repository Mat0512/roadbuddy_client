import { useState } from 'react';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';
import { useStore } from 'store';

interface MenuItems {
  id: number;
  title: string;
  icon: string;
}

const menuItems: MenuItems[] = [
  // {
  //   id: 1,
  //   title: 'View Profile',
  //   icon: 'hugeicons:user-circle-02',
  // },
  {
    id: 6,
    title: 'Logout',
    icon: 'hugeicons:logout-03',
  },
];

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const user = useStore((state) => state.user);
  const setUserState = useStore((state) => state.setUser);
  console.log('user from store');
  console.log(user);

  const logout = () => {
    console.log('User logged out');
    localStorage.removeItem('token'); // Remove token from local storage
    setUserState(null); // Clear user state
    handleProfileMenuClose(); // Close the menu
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonBase
        onClick={handleProfileClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        disableRipple
      >
        <Avatar
          // src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3AProfile_avatar_placeholder_large.png&psig=AOvVaw1LAKtrH8M59hZDCoz7JXID&ust=1729315659623000&source=images&cd=vfe&opi=89978449&ved=2ahUKEwirloX-mJeJAxUupVYBHWKxLikQjRx6BAgAEBk"
          sx={{
            height: 48,

            width: 48,
            bgcolor: 'primary.main',
          }}
        />
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiList-root': {
            p: 0,
            width: 230,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={1}>
          <MenuItem onClick={handleProfileMenuClose} sx={{ '&:hover': { bgcolor: 'info.light' } }}>
            <Avatar sx={{ mr: 1, height: 42, width: 42 }} />
            <Stack direction="column">
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={400}>
                {user?.username}
              </Typography>
            </Stack>
          </MenuItem>
        </Box>

        <Divider sx={{ my: 0 }} />

        <Box p={1}>
          {menuItems.map((item) => {
            return (
              <MenuItem
                key={item.id}
                onClick={
                  item.id === 6
                    ? () => {
                        logout();
                        handleProfileMenuClose();
                      }
                    : handleProfileMenuClose
                }
                sx={{ py: 1 }}
              >
                <ListItemIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'h5.fontSize' }}>
                  <IconifyIcon icon={item.icon} />
                </ListItemIcon>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {item.title}
                </Typography>
              </MenuItem>
            );
          })}
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
