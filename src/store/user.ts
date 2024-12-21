import { StateCreator } from 'zustand';

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  username: string;
}

export interface UserSlice {
  user: User | null;
  setUser: (userData: User | null) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  logout: () => set({ user: null }),
  setUser: (userData: User | null) => set({ user: userData }),

  updateUser: (newData: Partial<User>) =>
    set((state: UserSlice) => {
      return {
        user: state.user
          ? {
              ...state.user, // Spread existing user if not null
              ...newData, // Apply new data
            }
          : null, // Handle the case where user is null
      };
    }),
});
