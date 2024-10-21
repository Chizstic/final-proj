import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Initialize the database pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const bookingHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query('SELECT * FROM bookings');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      if (client) {
        await client.release();
      }
    }
  } if (req.method === 'POST') {
      const { name, user_email, date, time, service, staff, payment_method, created_at} = req.body;
  
      console.log('Incoming request body:', req.body);
  
      if (!name || !user_email || !date || !time || !service || !staff || !payment_method || created_at) {
        console.error('Missing required fields');
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      let client;
      try {
        client = await pool.connect();
        const { rows } = await client.query(
          'INSERT INTO bookings (name, user_email, date, time, service, staff, payment_method, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
          [name, user_email, date, time, service, staff, payment_method, created_at]
        );
        res.status(201).json(rows[0]);
      } catch  {
        console.error('Error creating booking:',);
        res.status(500).json({ message: 'Internal server error',});
      } finally {
        if (client) {
          await client.release();
        }
      }
    } else if (req.method === 'PUT') {
      const { user_email, payment_method } = req.body;
  
      // Ensure that the required fields are present
      if (!user_email|| !payment_method) {
          return res.status(400).json({ message: 'Booking email and payment method are required.' });
      }
  
      let client;
      try {
          client = await pool.connect();
          // Update only the payment_method
          const { rowCount } = await client.query(
              'UPDATE bookings SET payment_method = $1 WHERE user_email = $2',
              [payment_method, user_email] // Only updating payment_method
          );
  
          // Check if any rows were updated
          if (rowCount === 0) {
              return res.status(404).json({ message: 'Booking not found' });
          }
          res.status(204).end(); // No content to send back
      } catch (error) {
          console.error('Error updating booking:', error);
          res.status(500).json({ message: 'Internal server error' });
      } finally {
          if (client) {
              await client.release();
          }
      }
  
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default bookingHandler;
