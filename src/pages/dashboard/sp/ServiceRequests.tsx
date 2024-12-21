import ServiceProviderRequests from 'components/sections/serviceProviderRequests';
import ServiceProviderNotifications from 'components/notification/ServiceProviderNotifications';
import { useStore } from 'store';

const ServiceRequests = () => {
  const user = useStore((state) => state.user);
  const user_id = user ? user.user_id : null; // Ch
  return (
    <>
      <ServiceProviderNotifications providerId={user_id} />

      <ServiceProviderRequests />
    </>
  );
};

export default ServiceRequests;
