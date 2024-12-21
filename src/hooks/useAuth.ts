import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../configs/axios';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
interface LoginData {
  username: string;
  password: string;
}

interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  username: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

const loginUser = async (loginData: LoginData): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', loginData);
  return response.data;
};

export const useAuth = () => {
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleRedirect = (user: User) => {
    // Redirect to another route
    console.log('success login');
    const redirect = user.type === 'service_provider' ? '/pages/sp/dashboard' : '/';
    navigate(redirect); // Example path to redirect to
  };

  return useMutation({
    mutationKey: ['loginUser'],
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Handle successful login, e.g., update user state
      console.log('checking user data on success');
      console.log(data.user);
      setUser(data.user);
      // // Optionally, you can store the token in local storage or context
      localStorage.setItem('token', data.token);
      handleRedirect(data.user);
    },
    onError: (error) => {
      // Handle error, e.g., show a notification
      console.error('Login failed:', error);
    },
  });
};
