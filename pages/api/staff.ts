import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Initialize the database pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const staffHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let client;

  try {
    client = await pool.connect();

    switch (req.method) {
      case 'GET':
        // Fetch all staff members
        const { rows } = await client.query('SELECT * FROM staff');
        res.status(200).json(rows);
        break;

      case 'POST':
        // Add a new staff member
        const { first_name, last_name, position } = req.body;
        if (!first_name || !last_name || !position) {
          return res.status(400).json({ message: 'Missing required fields: first_name, last_name, position' });
        }

        const { rows: newStaffRows } = await client.query(
          'INSERT INTO staff (first_name, last_name, position) VALUES ($1, $2, $3) RETURNING *',
          [first_name, last_name, position]
        );
        res.status(201).json({ message: 'Staff member added successfully', staff: newStaffRows[0] });
        break;

      case 'PUT':
        // Update an existing staff member
        const { id, first_name: updateFirstName, last_name: updateLastName, position: updatePosition } = req.body;
        if (!id || !updateFirstName || !updateLastName || !updatePosition) {
          return res.status(400).json({ message: 'Missing required fields: id, first_name, last_name, position' });
        }

        const { rowCount: updatedRowCount } = await client.query(
          'UPDATE staff SET first_name = $1, last_name = $2, position = $3 WHERE id = $4',
          [updateFirstName, updateLastName, updatePosition, id]
        );
        if (updatedRowCount === 0) {
          return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json({ message: 'Staff member updated successfully' });
        break;

      case 'DELETE':
        // Delete a staff member
        const { id: deleteId } = req.query;
        if (!deleteId) {
          return res.status(400).json({ message: 'Missing required field: id' });
        }

        const { rowCount: deletedRowCount } = await client.query('DELETE FROM staff WHERE id = $1', [deleteId]);
        if (deletedRowCount === 0) {
          return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json({ message: 'Staff member deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling staff:', error);
   
  } finally {
    if (client) {
      await client.release();
    }
  }
};

export default staffHandler;
