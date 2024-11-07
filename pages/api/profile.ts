import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Create a connection pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const profileHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await pool.connect();

  try {
    if (req.method === 'POST') { // For creating new profiles
      const { email, name, age, sex, address, contact_number } = req.body;

      // Validate incoming profile data
      if (!email || !name || !age || !sex || !address || !contact_number) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Sanitize and validate types
      if (typeof age !== 'number' || age < 0) {
        return res.status(400).json({ message: 'Age must be a positive number' });
      }

      // Check if the user exists in the users table
      const userCheckQuery = 'SELECT * FROM users WHERE email = $1';
      const userCheckResult = await client.query(userCheckQuery, [email]);

      if (userCheckResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the profile already exists
      const profileCheckQuery = 'SELECT * FROM user_profiles WHERE email = $1';
      const profileCheckResult = await client.query(profileCheckQuery, [email]);

      if (profileCheckResult.rows.length > 0) {
        return res.status(400).json({ message: 'Profile already exists' });
      }

      // Proceed to insert the new profile in user_profiles table
      const insertQuery = `
        INSERT INTO user_profiles (email, name, age, sex, address, contact_number)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const newProfileResult = await client.query(insertQuery, [email, name, age, sex, address, contact_number]);
      return res.status(201).json({ profile: newProfileResult.rows[0] });

    } else if (req.method === 'PUT') { // For updating existing profiles
      const { email, name, age, sex, address, contact_number } = req.body;

      // Validate incoming profile data
      if (!email || !name || !age || !sex || !address || !contact_number) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Sanitize and validate types
      if (typeof age !== 'number' || age < 0) {
        return res.status(400).json({ message: 'Age must be a positive number' });
      }

      // Check if the profile exists
      const profileCheckQuery = 'SELECT * FROM user_profiles WHERE email = $1';
      const profileCheckResult = await client.query(profileCheckQuery, [email]);

      if (profileCheckResult.rows.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      // Proceed to update the profile in user_profiles table
      const updateQuery = `
        UPDATE user_profiles
        SET name = $2, age = $3, sex = $4, address = $5, contact_number = $6
        WHERE email = $1
        RETURNING *;
      `;
      const updatedProfileResult = await client.query(updateQuery, [email, name, age, sex, address, contact_number]);
      return res.status(200).json({ profile: updatedProfileResult.rows[0] });

    } else if (req.method === 'GET') { // For fetching user profiles
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Check if the profile exists in user_profiles table
      const profileQuery = 'SELECT * FROM user_profiles WHERE email = $1';
      const profileResult = await client.query(profileQuery, [email]);

      if (profileResult.rows.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      const profile = profileResult.rows[0];
      return res.status(200).json({ profile });

    } else {
      // Allow only POST, PUT, and GET methods
      res.setHeader('Allow', ['POST', 'PUT', 'GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release(); // Ensure client is released back to the pool
  }
};

export default profileHandler;
