import React, { useEffect, useState } from 'react';
import { useStore } from 'store';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserData } from 'hooks/useUserData';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export type UserType = 'driver' | 'service_provider' | undefined;

// Define the route permissions map
const routePermissions: Record<string, UserType[]> = {
  '/': ['driver'],
  '/pages/service-provider/:id': ['driver'],
  '/pages/tracking/:id': ['driver', 'service_provider'],
  '/pages/sp/dashboard': ['service_provider'],
  '/pages/sp/service-requests': ['service_provider'],
  '/pages/sp/service-requests/:id': ['service_provider'],
  '/pages/sp/service-history': ['service_provider'],
  '/pages/sp/earnings': ['service_provider'],
  '/pages/profile': ['driver', 'service_provider'],
  '/pages/service-requests': ['driver'],
  '/pages/service-requests-accepted': ['driver'],
  '/pages/service-requests-history': ['driver'],  
  '/pages/service-provider-category': ['driver'],
  '/pages/service-providers/:category': ['driver'],
  '/pages/location': ['driver', 'service_provider'],
  '/pages/sp-maps': ['driver'],
  '/pages/chat/:id': ['driver', 'service_provider'],
  '/pages/sp/services': [ 'service_provider'],
  '/pages/sp/service-requests-accepted': ['service_provider'],
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const { data, isError, isLoading, refetch } = useUserData();

  // Update isPathAllowed to use routePermissions
  const isPathAllowed = () => {
    if (!user?.type) return false;

    // Check if the current path is allowed for the user type
    return Object.entries(routePermissions).some(([path, allowedTypes]) => {
      const pattern = path.replace(/:\w+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);

      return regex.test(location.pathname) && allowedTypes.includes(user.type as UserType);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && token) {
      refetch();
    } else {
      setLoading(false);
    }
  }, [user, refetch]);

  useEffect(() => {
    if (data) {
      setUser(data);
      setLoading(false);
    }
  }, [data, setUser]);
    
  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    localStorage.removeItem('token');
    return <Navigate to="/authentication/signin" />;
  }

  if (!user) {
    return <Navigate to="/authentication/signin" />;
  }

  // Check if user has permission to access the current route
  if (!isPathAllowed()) {
    console.log('path not allowed');
    console.log(`user type: ${user.type}`);

    const defaultRoutes = {
      user: '/',
      serviceProvider: '/pages/sp/service-requests',
      admin: '/admin/dashboard',
    } as const;

    const userType = user.type as keyof typeof defaultRoutes;
    return <Navigate to={defaultRoutes[userType] ?? '/'} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
