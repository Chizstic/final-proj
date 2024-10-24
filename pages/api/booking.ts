import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Create a connection pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const bookingHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await pool.connect(); // Ensure a client is connected

  if (req.method === 'POST') {
    const { email, date, time, services, staffname, paymentMethod } = req.body; // Assuming these are strings

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
        staffname,       // String value representing the staff name
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
  }else if (req.method === 'PUT') {
    const { bookingId } = req.body;  // Ensure the body contains bookingId
  
    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }
  
    try {
      const updateQuery = `
        UPDATE bookings
        SET paymentmethod = 'Paid'
        WHERE bookingID = $1
        RETURNING *;
      `;
  
      const updateResult = await client.query(updateQuery, [bookingId]);
  
      if (updateResult.rowCount === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      const updatedBooking = updateResult.rows[0];
      return res.status(200).json({ message: 'Payment updated to Paid', booking: updatedBooking });
    } catch (error) {
      console.error('Error updating payment method:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      client.release();  // Ensure client is released back to the pool
    }
  
  
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default bookingHandler;
