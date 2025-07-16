import { create } from 'zustand';

// Define the shape of your store's state
interface AppState {
  // Example state for patients
  patients: any[];
  addPatient: (patient: any) => void;
  
  // Example state for appointments
  appointments: any[];
  addAppointment: (appointment: any) => void;
  
  // Example state for user authentication
  user: any | null;
  setUser: (user: any) => void;
  login: (user: any) => void;
  logout: () => void;
}

// Create the Zustand store
export const useStore = create<AppState>((set) => ({
  // Initial state for patients
  patients: [],
  addPatient: (patient) =>
    set((state) => ({
      patients: [...state.patients, patient],
    })),
  
  // Initial state for appointments
  appointments: [],
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
    
  // Initial state for user authentication
  user: null,
  setUser: (user) => set({ user }),
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Keep the old export for backward compatibility
export const useAppStore = useStore;
