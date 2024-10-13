import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@vercel/postgres';

const client = new Client({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your environment variables
});

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      await client.connect();

      // Query to find the user by email
      const result = await client.query(
        'SELECT * FROM Users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = result.rows[0];

      // Here you should verify the password (consider using bcrypt for hashing)
      // For now, we'll just check against a hardcoded password
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Send back user details (omit sensitive data)
      res.status(200).json({ message: 'Login successful', user: { email: user.email, role: user.role, name: user.name } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.end();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default loginHandler;
