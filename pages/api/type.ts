export interface Staff {
  id?: number; 
  first_name: string;
  last_name: string;
  position: string;
}

export interface Bookings {
  name: string;
  date: string;
  time: string;
  service: string;
  staff: string;
  user_email: string;
  payment_method: string;
  id?: number; // Optional field
}


// Define service prices
export const servicePrices: Record<'Hair Trim' | 'Hair Color' | 'Hot Oil' | 'Balayage' | 'Hair Rebond' | 'Makeup', number> = {
  'Hair Trim': 500,      // Adjust prices as needed
  'Hair Color': 700,
  'Hot Oil': 800,
  'Balayage': 900,
  'Hair Rebond': 1000,
  'Makeup': 850,
};
