import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres'; // Use createPool for connection pooling

// Initialize the database pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your environment variables
});

const registerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, password, role, name, age, sex, address, contact_number } = req.body; // Added profile fields

    let client; // Declare the client variable here

    try {
      client = await pool.connect(); // Get a client from the pool

      // Check if the user already exists
      const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Client already exists' });
      }

      // Insert the new user into the Users table without hashing the password
      await client.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
        [email, password, role] // Store the plaintext password directly
      );

      // Create a default profile entry for the new user in the user_profiles table
      await client.query(
        'INSERT INTO user_profiles (email, name, age, sex, address, contact_number) VALUES ($1, $2, $3, $4, $5, $6)',
        [email, name || '', age || null, sex || '', address || '', contact_number || ''] // Create a default profile with some optional fields
      );

      // Send back a success response
      res.status(201).json({ message: 'User registered successfully, profile created.' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      if (client) {
        await client.release(); // Release the client back to the pool if it was created
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default registerHandler;
