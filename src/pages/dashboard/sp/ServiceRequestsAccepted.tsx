import ServiceProviderRequestsAccepted from 'components/sections/serviceProviderRequestsAccepted';
import ServiceProviderNotifications from 'components/notification/ServiceProviderNotifications';
import { useStore } from 'store';

const SpServiceRequestsAccepted = () => {
  const user = useStore((state) => state.user);
  const user_id = user ? user.user_id : null; 
  return (
    <>
      <ServiceProviderNotifications providerId={user_id} />

      <ServiceProviderRequestsAccepted />
    </>
  );
};

export default SpServiceRequestsAccepted;
