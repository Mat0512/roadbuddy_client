import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'configs/axios';
import { AxiosError } from 'axios';

interface Response {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  username: string;
  // Add more fields based on your API response
}
// Fetch user data
const fetchUserData = async () => {
  const { data } = await axiosInstance.get<Response>('/auth/user'); // Adjust your endpoint
  return data;
};

// Custom hook for fetching user data
export const useUserData = () => {
  return useQuery<Response, AxiosError>({
    queryKey: ['userData'],
    queryFn: fetchUserData,
    retry: false,
  });
};
