import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Create the database connection pool
const db = createPool({
  connectionString: process.env.DATABASE_URL, // Ensure this environment variable is set correctly
});

// Define the type for the staff member
interface Staff {
  id: number; // Assuming your staff table has an auto-incrementing ID
  first_name: string;
  last_name: string;
  position: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { first_name, last_name, position }: { first_name: string; last_name: string; position: string; } = req.body;

    // Validate input
    if (!first_name || !last_name || !position) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      // Insert the new staff member into the database
      const { rows } = await db.query<Staff>(
        'INSERT INTO staff (first_name, last_name, position) VALUES ($1, $2, $3) RETURNING *',
        [first_name, last_name, position]
      );

      if (rows.length > 0) {
        const newStaff = rows[0]; // This should contain the new staff member's details
        return res.status(201).json(newStaff); // Return the new staff member
      } else {
        return res.status(500).json({ message: 'Error adding staff' });
      }
    } catch (error) {
      console.error('Database error:', error); // Log the error for debugging
      return res.status(500).json({ message: 'Error adding staff', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else if (req.method === 'GET') {
    // Fetch all staff members from the database
    try {
      const { rows } = await db.query<Staff>('SELECT * FROM staff');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ message: 'Error fetching staff' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query; // Get the ID from the query parameters

    // Validate input
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid staff ID' });
    }

    try {
      // Delete the staff member from the database
      const result = await db.query(
        'DELETE FROM staff WHERE id = $1',
        [id]
      );

      // Type assertion to safely access rowCount
      const rowCount: number = result.rowCount !== null ? result.rowCount : 0; // Ensure rowCount is treated as a number

      if (rowCount > 0) {
        // If the staff member was deleted, update the remaining IDs to fill in the gap
        await db.query(
          `WITH deleted AS (
            DELETE FROM staff WHERE id = $1
            RETURNING *
          )
          UPDATE staff
          SET id = id - 1
          WHERE id > (SELECT id FROM deleted)`
          , [id]
        );

        return res.status(204).end(); // No content to return, successfully deleted
      } else {
        return res.status(404).json({ message: 'Staff member not found' });
      }
    } catch (error) {
      console.error('Error deleting staff:', error); // Log the error for debugging
      return res.status(500).json({ message: 'Error deleting staff', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
