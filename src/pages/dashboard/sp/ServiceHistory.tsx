import React from 'react';
import ServiceProviderHistoryComponent from 'components/sections/serviceProviderHistory';
import ServiceProviderNotifications from 'components/notification/ServiceProviderNotifications';
import { useStore } from 'store';

const ServiceProviderHistory: React.FC = () => {
  const user = useStore((state) => state.user);
  const user_id = user ? user.user_id : null;

  return (
    <>
      <ServiceProviderNotifications providerId={user_id} />
      <ServiceProviderHistoryComponent />
    </>
  );
};

export default ServiceProviderHistory;
