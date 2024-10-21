import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your environment variables
});

const usersHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { email } = req.query; 

    if (! email || typeof email !== 'string') {
      return res.status(400).json({ message: 'User email is required.' });
    }

    let client;

    try {
      client = await pool.connect(); // Use the pool to get a client

      // Query to fetch the user based on the email and their bookings
      const userQuery = 'SELECT * FROM Users WHERE email = $1';
      const bookingsQuery = 'SELECT * FROM Bookings WHERE user_email = $1';

      const userResult = await client.query(userQuery, [ email]);
      const bookingsResult = await client.query(bookingsQuery, [ email]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const userData = userResult.rows[0];
      const bookings = bookingsResult.rows;

      // Return user data and their bookings
      res.status(200).json({ user: userData, bookings });
    } catch (error) {
      console.error('Error fetching user data:', error); // Log error for debugging
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
