// A simple type for a Patient
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

// A simple type for an Appointment
export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  reason: string;
}

// A simple type for a User
export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Doctor' | 'Receptionist';
} 