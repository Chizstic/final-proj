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
      const { email, date, time, services, staffname, paymentMethod } = req.body;

      // Log the incoming request body
      console.log('Received booking data:', req.body);

      // Validate incoming booking data
      if (!email || !date || !time || !services || !staffname || !paymentMethod) {
        return res.status(400).json({ message: 'All booking fields are required' });
      }

      try {
        const insertQuery = `
          INSERT INTO bookings (email, date, time, services, staffname, paymentMethod, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *;
        `;

        const insertResult = await client.query(insertQuery, [
          email,
          date,
          time,
          services,     // String value representing the service name
          staffname,    // String value representing the staff name
          paymentMethod.trim(),  // Ensures no leading/trailing spaces
        ]);

        const insertedBooking = insertResult.rows[0];

        // Send the response with the inserted booking
        return res.status(201).json({ message: 'Booking created successfully', booking: insertedBooking });
      } catch (error) {
        console.error('Error preparing booking data:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      // Allow only POST method
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } finally {
    client.release(); // Ensure client is released back to the pool
  }
};

export default bookingHandler;
