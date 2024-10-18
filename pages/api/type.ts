export interface Staff {
  id?: number; 
  first_name: string;
  last_name: string;
  position: string;
}

// src/pages/api/type.ts
export interface Bookings {
  id?: number; // Make id optional
  name: string;
  date: string;
  time: string;
  service: string;
  staff: string;
  userEmail: string;
  userId?: number; // Ensure userId is included
}

export const servicePrices: Record<'Hair Care' | 'Spa' | 'Hair & Make-up' | 'Nail Care', number> = {
  'Hair Care': 500,      // Adjust prices as needed
  'Spa': 700,
  'Hair & Make-up': 800,
  'Nail Care': 300,
};
