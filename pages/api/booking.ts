import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Create a connection pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const bookingHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await pool.connect(); // Ensure a client is connected

  if (req.method === 'POST') {
    const { email, date, time, services, staffs, paymentMethod } = req.body; // Assuming these are strings

    // Validate incoming booking data
    if (!email || !date || !time || !services || !staffs || !paymentMethod) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    try {
      const insertQuery = `
        INSERT INTO bookings (email, date, time, services, staffs, paymentmethod, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *;
      `;

      const insertResult = await client.query(insertQuery, [
        email,
        date,
        time,
        services,     // String value representing the service name
        staffs,       // String value representing the staff name
        paymentMethod,
      ]);

      const insertedBooking = insertResult.rows[0];

      // Send the response with the inserted booking
      return res.status(201).json({ message: 'Booking created successfully', booking: insertedBooking });
    } catch (error) {
      console.error('Error preparing booking data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      client.release(); // Ensure client is released back to the pool
    }
  } else if (req.method === 'GET') {
    try {
      const result = await client.query('SELECT * FROM bookings ORDER BY created_at DESC;');
      const bookings = result.rows;

      // Send the response with the bookings
      return res.status(200).json({ bookings });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      client.release(); // Ensure client is released back to the pool
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default bookingHandler;
