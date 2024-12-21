// store.ts
import { create } from 'zustand';
import { createUserSlice, UserSlice } from './user';
import { createServiceRequestStatusSlice, ServiceRequestStatusSlice } from './serviceRequestStatus';

// Combine all slices into one store
export const useStore = create<UserSlice & ServiceRequestStatusSlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createServiceRequestStatusSlice(...a),
}));
