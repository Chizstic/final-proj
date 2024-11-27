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
        const { fname, lname, position } = req.body;
        if (!fname || !lname || !position) {
          return res.status(400).json({ message: 'Missing required fields: fname, lname, position' });
        }

        const { rows: newStaffRows } = await client.query(
          'INSERT INTO staff (fname, lname, position) VALUES ($1, $2, $3) RETURNING *',
          [fname, lname, position]
        );
        res.status(201).json({ message: 'Staff member added successfully', staff: newStaffRows[0] });
        break;

      case 'PUT':
        // Update an existing staff member
        const { staffid, fname: updateFname, lname: updateLname, position: updatePosition } = req.body;

        if (!staffid || !updateFname || !updateLname || !updatePosition) {
          return res.status(400).json({ message: 'Missing required fields: staffid, fname, lname, position' });
        }

        try {
          // Call the stored procedure for updating staff member
          const result = await client.query(
            'CALL update_staff_member($1, $2, $3, $4)', // Call the procedure
            [staffid, updateFname, updateLname, updatePosition]
          );

          // If no rows were affected, staff member was not found
          if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
          }

          res.status(200).json({ message: 'Staff member updated successfully' });
        } catch (error) {
          console.error('Error updating staff member:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
        break;

      case 'DELETE':
        // Delete a staff member
        const { id: deleteId } = req.query;
        if (!deleteId) {
          return res.status(400).json({ message: 'Missing required field: id' });
        }

        const { rowCount: deletedRowCount } = await client.query('DELETE FROM staff WHERE staffID = $1', [deleteId]);
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
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) {
      await client.release();
    }
  }
};

export default staffHandler;
