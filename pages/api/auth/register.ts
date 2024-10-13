// pages/api/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { Client } from '@vercel/postgres';

// Initialize the database client
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Make sure this environment variable is set
});

const registerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password, name, role } = req.body;

    try {
      await client.connect();

      // Check if the user already exists
      const existingUser = await client.query(
        'SELECT * FROM Users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password before saving to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the Users table
      await client.query(
        'INSERT INTO Users (email, password, name, role) VALUES ($1, $2, $3, $4)',
        [email, hashedPassword, name, role]
      );

      // Send back a success response
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.end();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default registerHandler;
