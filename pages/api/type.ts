export interface Staff {
  id?: number; 
  first_name: string;
  last_name: string;
  position: string;
}

// src/pages/api/type.ts
export interface Bookings {
  id?: number; // Make id optional
  name: string; // Assuming this is the client's name
  time: string;
  date: string; // Booking date
  service: string; // Service booked
  staff: string;
  userEmail: string; // Add this property for user's email
}

