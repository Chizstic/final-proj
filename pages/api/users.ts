import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your environment variables
});

const usersHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    let client;

    try {
      client = await pool.connect(); // Use the pool to get a client

      // Query to fetch all users
      const result = await client.query('SELECT * FROM Users');

      // Return the users data
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching users:', error); // Log error for debugging
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      if (client) {
        await client.release(); // Release the client back to the pool
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default usersHandler;
