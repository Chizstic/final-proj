import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Create a connection pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const bookingHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await pool.connect(); // Ensure a client is connected

  try {
    if (req.method === 'POST') {
      const { email, date, time, services, staffname, paymentmethod } = req.body;

      // Log the incoming request body
      console.log('Received booking data:', req.body);

      // Validate incoming booking data
      if (!email || !date || !time || !services || !staffname || !paymentmethod) {
        return res.status(400).json({ message: 'All booking fields are required' });
      }

      const serviceToStore = Array.isArray(services) ? services.join(', ') : services; // Join services into a single string

      // Combine date and time for storage in UTC
      const [year, month, day] = date.split('-');
      const [hours, minutes] = time.split(':');
      const combinedDateTime = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) +1, Number(hours), Number(minutes)));

      const insertQuery = `
        INSERT INTO bookings (email, date, time, services, staffname, paymentmethod, created_at)
        VALUES ($1, $2, $3::TIME, $4, $5, $6, NOW()) RETURNING *;
      `;

      const insertResult = await client.query(insertQuery, [
        email,
        combinedDateTime.toISOString().split('T')[0], // Store the date part only in YYYY-MM-DD format
        time, // Store the time directly
        serviceToStore,
        staffname,
        paymentmethod.trim(),
      ]);

      const insertedBooking = insertResult.rows[0];

      // Send the response with the inserted booking
      return res.status(201).json({ message: 'Booking created successfully', booking: insertedBooking });

    } else if (req.method === 'GET') {
      const selectQuery = 'SELECT * FROM bookings ORDER BY created_at DESC'; // Get all bookings

      const result = await client.query(selectQuery);

      const bookings = result.rows.map(booking => ({
        ...booking,
        date: new Date(booking.date).toISOString().split('T')[0], // Format date to YYYY-MM-DD
        time: new Date(`1970-01-01T${booking.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) // Format time to 12-hour format
      }));

      return res.status(200).json(bookings);

    } else {
      // Allow only POST and GET methods
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release(); // Ensure client is released back to the pool
  }
};

export default bookingHandler;
