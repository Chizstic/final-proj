// Define the type for booking details, including an optional id
type BookingDetails = {
  name: string;
  date: string;
  service: string;
};

// Extend BookingDetails to include an id
interface Booking extends BookingDetails {
  id: number; // Required for existing bookings
}
