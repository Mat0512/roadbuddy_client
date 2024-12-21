import {Typography, Box  } from '@mui/material';

import ServiceProviderNotifications from 'components/notification/ServiceProviderNotifications';
import { useStore } from 'store';
import Services from 'components/sections/ServicesView';

export default function ServicePage() {
  const user = useStore((state) => state.user);
  const user_id = user ? user.user_id : null; // Check if user is not null

  

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <ServiceProviderNotifications providerId={user_id} />
      <Typography variant="h4" component="h1" gutterBottom>
        Services
      </Typography>

      <Services/>
    </Box>
  );
}
