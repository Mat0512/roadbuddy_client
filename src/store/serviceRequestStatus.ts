import { StateCreator } from 'zustand';


export interface ServiceRequestStatusSlice {
  isActive: boolean;
  timeRemaining: number;
  requestId: string | null;
  userId: number | null;
  setUserId: (id: number | null) => void;
  setRequestId: (id: string | null) => void;
  clearRequest: () => void;
  setIsActive: (isActive: boolean) => void;
  startTimer: () => void;
  resetTimer: () => void;
  reset: () => void;
  timerId?: ReturnType<typeof setInterval>;

}

const INITIAL_TIME = 120; // 2 minutes in seconds

export const createServiceRequestStatusSlice: StateCreator<ServiceRequestStatusSlice> = (set, get) => ({
  isActive: false,
  timeRemaining: INITIAL_TIME,
  requestId: null,
  userId: null,
  setUserId: (id) => set({ userId: id }),
  setRequestId: (id) => set({ requestId: id }),
  clearRequest: () => set({ requestId: null, userId: null, isActive: false, timeRemaining: INITIAL_TIME }),
  setIsActive: (value) => set({ isActive: value }),
  
  timerId: undefined,
  
  startTimer: () => {
    if (get().timerId) {
      clearInterval(get().timerId);
    }
    
    const timer = setInterval(() => {
      const current = get().timeRemaining;
      if (current <= 0) {
        clearInterval(timer);
        set({ isActive: false, timeRemaining: INITIAL_TIME, timerId: undefined });
        return;
      }
      set({ timeRemaining: current - 1 });
    }, 1000);
    
    set({ timerId: timer });
  },
  
  resetTimer: () => set({ timeRemaining: INITIAL_TIME }),
  reset: () => {
    if (get().timerId) {
      clearInterval(get().timerId);
    }
     
    set({
      isActive: false,
      timeRemaining: INITIAL_TIME,
      requestId: null,
      userId: null,
      timerId: undefined,
    });
  }
});
