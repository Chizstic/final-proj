import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Initialize the database pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const servicesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    let client;
    try {
      client = await pool.connect();
      const { rows } = await client.query('SELECT * FROM services'); // Query for services
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      if (client) {
        await client.release();
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default servicesHandler;
