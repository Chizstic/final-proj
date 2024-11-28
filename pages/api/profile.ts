import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Create a connection pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const profileHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await pool.connect();

  try {
    if (req.method === 'GET') {
      const { email } = req.query; // Expect the email in the query params

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Query the profile for the provided email
      const result = await client.query('SELECT * FROM user_profiles WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      return res.status(200).json({ profile: result.rows[0] });

    } else if (req.method === 'POST') {
      const { email, name, age, sex, address, contact_number } = req.body;

      // Validate incoming profile data
      if (!email || !name || !age || !sex || !address || !contact_number) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (typeof age !== 'number' || age < 0 || age > 150) {
        return res.status(400).json({ message: 'Age must be a positive number and less than 150' });
      }

      // Check if user exists
      const userCheckResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userCheckResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if profile exists
      const profileCheckResult = await client.query('SELECT * FROM user_profiles WHERE email = $1', [email]);
      if (profileCheckResult.rows.length > 0) {
        return res.status(400).json({ message: 'Profile already exists' });
      }

      // Insert the profile
      const insertQuery = `
        INSERT INTO user_profiles (email, name, age, sex, address, contact_number)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const newProfileResult = await client.query(insertQuery, [email, name, age, sex, address, contact_number]);

      return res.status(201).json({ profile: newProfileResult.rows[0] });

    } else if (req.method === 'PUT') {
      const { email, name, age, sex, address, contact_number } = req.body;
    
      // Validate incoming profile data
      if (!email || !name || !age || !sex || !address || !contact_number) {
        return res.status(400).json({ message: 'All fields are required' });
      }
    
      if (typeof age !== 'number' || age < 0 || age > 150) {
        return res.status(400).json({ message: 'Age must be a positive number and less than 150' });
      }
    
      // Check if profile exists
      const profileCheckResult = await client.query('SELECT * FROM user_profiles WHERE email = $1', [email]);
      if (profileCheckResult.rows.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }
    
      // Update the profile (trigger will handle additional logic)
      const updateQuery = `
        UPDATE user_profiles
        SET name = $2, age = $3, sex = $4, address = $5, contact_number = $6
        WHERE email = $1
        RETURNING *;
      `;
      const updatedProfileResult = await client.query(updateQuery, [email, name, age, sex, address, contact_number]);
    
      // Return the updated profile
      return res.status(200).json({ profile: updatedProfileResult.rows[0] });
    
    } else {
      res.setHeader('Allow', ['POST', 'PUT', 'GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
};

export default profileHandler;
