// Remove the Booking interface if it's not being used anywhere
type BookingDetails = {
  name: string;
  date: string;
  service: string;
};

// Extend BookingDetails to include an id
interface Booking extends BookingDetails {
  id: number; // Required for existing bookings
}
