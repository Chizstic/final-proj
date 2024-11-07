import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Create a connection pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    let client;

    try {
      client = await pool.connect();

      // Fetch the user from the database
      const userResult = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const user = userResult.rows[0];

      // Check if the password matches directly (plaintext comparison)
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // Fetch the user's profile from user_profiles
      const profileResult = await client.query(
        'SELECT * FROM user_profiles WHERE email = $1',
        [email]
      );

      let profile = null;
      if (profileResult.rows.length > 0) {
        profile = profileResult.rows[0];
      }

      // Return the user's information along with the profile upon successful login
      return res.status(200).json({
        message: 'Login successful',
        user: { ...user, role: user.role, profile },
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      if (client) {
        await client.release();
      }
    }
  } else if (req.method === 'GET') {
    let client;

    try {
      client = await pool.connect();

      // Fetch all users from the database
      const result = await client.query('SELECT * FROM users');

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No users found.' });
      }

      // Return the list of users
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      if (client) {
        await client.release();
      }
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default loginHandler;
