import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';
import cron from 'node-cron'; // Import node-cron for scheduling tasks

// Create a connection pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

// Cron job to delete bookings older than 15 days
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily cleanup task for bookings older than 15 days...');
  
  const client = await pool.connect();
  
  try {
    const deleteOldBookingsQuery = `
      DELETE FROM bookings
      WHERE date < CURRENT_DATE - INTERVAL '15 days';
    `;
    
    const deleteResult = await client.query(deleteOldBookingsQuery);
    console.log(`Successfully deleted ${deleteResult.rowCount} old bookings.`);
    
  } catch (err) {
    console.error('Error deleting old bookings:', err);
  } finally {
    client.release();
  }
});

const bookingHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await pool.connect();

  try {
    if (req.method === 'POST') {
      // Create a new booking
      const { email, date, time, services, staffname, paymentmethod } = req.body;
    
      console.log('Received booking data:', req.body);
    
      // Validate required fields
      if (!email || !date || !time || !services || !staffname || !paymentmethod) {
        return res.status(400).json({ message: 'All booking fields are required' });
      }
    
      try {
        const serviceToStore = Array.isArray(services) ? services.join(', ') : services;

        const combinedDateTime = new Date(`${date}T${time}:00Z`);
        
        // Construct the insert query
        const insertQuery = `
          INSERT INTO bookings (email, date, time, services, staffname, paymentmethod)
          VALUES ($1, $2, $3::TIME, $4, $5, $6);
        `;
        
        // Execute the query
        await client.query(insertQuery, [
          email,
          combinedDateTime.toISOString().split('T')[0], // Date (just the date part)
          time,  // Time
          serviceToStore,  // Services (comma-separated list)
          staffname,  // Staff name
          paymentmethod.trim(),  // Payment method
        ]);
        
    
        return res.status(201).json({
          message: 'Booking created successfully',
        });
      } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error during booking creation' });
      }    
    } else if (req.method === 'GET') {
      // Retrieve all bookings
      const selectQuery = 'SELECT * FROM bookings ORDER BY created_at DESC';
      const result = await client.query(selectQuery);

      const bookings = result.rows.map((booking) => ({
        ...booking,
        date: new Date(booking.date).toISOString().split('T')[0], // Format date
        time: new Date(`1970-01-01T${booking.time}`).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }), // Format time
      }));

      return res.status(200).json(bookings);
    } else if (req.method === 'DELETE') {
      if (req.query.past) {
        // Delete past bookings
        const deletePastBookingsQuery = `
          DELETE FROM bookings
          WHERE date < CURRENT_DATE;
        `;
    
        const deleteResult = await client.query(deletePastBookingsQuery);
    
        return res.status(200).json({
          message: `Successfully deleted ${deleteResult.rowCount} past bookings.`,
        });
      } else if (req.query.bookingID) {
        // Delete a specific booking
        const bookingID = parseInt(req.query.bookingID as string, 10);
    
        if (isNaN(bookingID)) {
          return res.status(400).json({ message: 'Invalid booking ID' });
        }
    
        const deleteBookingQuery = `
          DELETE FROM bookings
          WHERE bookingid = $1;
        `;
    
        const deleteResult = await client.query(deleteBookingQuery, [bookingID]);
    
        if (deleteResult.rowCount === 0) {
          return res.status(404).json({ message: 'Booking not found' });
        }
    
        return res.status(200).json({
          message: `Successfully deleted booking with ID ${bookingID}.`,
        });
      } else {
        return res.status(400).json({ message: 'Invalid DELETE request' });
      }
    } else if (req.method === 'PUT') {
      // Update booking status
      const { bookingId, status } = req.body;
    
      if (!bookingId || !status) {
        return res.status(400).json({ message: 'Booking ID and status are required' });
      }
    
      const validStatuses = ['Pending', 'Ongoing', 'Completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
    
      try {
        // Call the stored procedure to update the booking status
        const updateQuery = `
          CALL update_booking_status($1, $2);
        `;
        await client.query(updateQuery, [bookingId, status]);
    
        return res.status(200).json({
          message: 'Booking status updated successfully',
        });
      } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Failed to update booking status' });
      }
        
    } else {
      res.setHeader('Allow', ['POST', 'GET', 'DELETE', 'PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ message: 'An unexpected error occurred' });
  } finally {
    client.release();
  }
};

export default bookingHandler;
