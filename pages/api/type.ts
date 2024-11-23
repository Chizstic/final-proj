export interface Staff {
  staffid?: number; 
  fname: string;
  lname: string;
  position: string;
}

// Assuming this is your type definition in './api/type'
export interface Bookings {
  bookingid: number;
  email: string;
  date: string;
  time: string;
  services: string | string[];
  servicePrice: number;
  paymentmethod: string;
  staffname: string | string[];
  created_at: string;
  status: string;
}




