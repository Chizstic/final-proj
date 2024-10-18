import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Initialize the database pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const bookingHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Change '*' to your frontend origin for production
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight requests
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
  } else if (req.method === 'POST') {
    const { name, date, time, service, staff, userId, paymentMethod } = req.body; // Include paymentMethod
    if (!name || !date || !time || !service || !staff || !userId || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query(
        'INSERT INTO bookings (name, date, time, service, staff, user_id, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, date, time, service, staff, userId, paymentMethod] // Add paymentMethod to the insert statement
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      if (client) {
        await client.release();
      }
    }
  } else if (req.method === 'PUT') {
    const { id, name, date, time, service, staff, userId, paymentMethod } = req.body;
    if (!id || !name || !date || !time || !service || !staff || !userId || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let client;
    try {
      client = await pool.connect();
      const { rowCount } = await client.query(
        'UPDATE bookings SET name = $1, date = $2, time = $3, service = $4, staff = $5, user_id = $6, payment_method = $7 WHERE id = $8',
        [name, date, time, service, staff, userId, paymentMethod, id] // Update with paymentMethod
      );
      if (rowCount === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(204).end();
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
