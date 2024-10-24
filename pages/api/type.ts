export interface Staff {
  staffid?: number; 
  fname: string;
  lname: string;
  position: string;
}

// Assuming this is your type definition in './api/type'
export interface Bookings {
  bookingID: number; // Ensure this matches the case
  email: string;
  date: string;
  time: string;
  services: string;
  paymentMethod: string;
  staffname: string; // Assuming staffID is of type string
  created_at?: string; // Optional
}





