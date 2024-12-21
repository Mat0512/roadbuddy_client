// import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ServiceProviders from 'components/sections/home/serviceProviders';

const ServiceProvidersView = () => {
  return (
    <Stack
      direction={{ xs: 'column' }}
      width={1}
      //  bgcolor="info.dark"
      px={3.5}
      py={3.5}
      spacing={3.5}
    >
     
      <ServiceProviders/>
    </Stack>
  );
};

export default ServiceProvidersView;
