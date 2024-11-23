import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from '@vercel/postgres';

// Create a connection pool
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

const bookingHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await pool.connect();

  try {
    if (req.method === 'POST') {
      const { email, date, time, services, staffname, paymentmethod } = req.body;

      console.log('Received booking data:', req.body);

      // Validate required fields
      if (!email || !date || !time || !services || !staffname || !paymentmethod) {
        return res.status(400).json({ message: 'All booking fields are required' });
      }

      try {
        const serviceToStore = Array.isArray(services) ? services.join(', ') : services;

        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');
        const combinedDateTime = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes)));

        const insertQuery = `
          INSERT INTO bookings (email, date, time, services, staffname, paymentmethod, created_at)
          VALUES ($1, $2, $3::TIME, $4, $5, $6, NOW()) RETURNING *;
        `;

        const insertResult = await client.query(insertQuery, [
          email,
          combinedDateTime.toISOString().split('T')[0],
          time,
          serviceToStore,
          staffname,
          paymentmethod.trim(),
        ]);

        const insertedBooking = insertResult.rows[0];
        console.log('Inserted Booking:', insertedBooking);

        return res.status(201).json({ message: 'Booking created successfully', booking: insertedBooking });
      } catch (err) {
        if (err instanceof Error) {
          console.error('Database error:', err.message);
          return res.status(500).json({ message: 'Internal server error during booking creation' });
        }
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'An unexpected error occurred' });
      }
    } else if (req.method === 'GET') {
      const selectQuery = 'SELECT * FROM bookings ORDER BY created_at DESC';
      const result = await client.query(selectQuery);

      const bookings = result.rows.map((booking) => ({
        ...booking,
        date: new Date(booking.date).toISOString().split('T')[0],
        time: new Date(`1970-01-01T${booking.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      }));

      return res.status(200).json(bookings);
    } else if (req.method === 'DELETE' && req.query.past) {
      // Delete past bookings handler
      const deletePastBookingsQuery = `
        DELETE FROM bookings
        WHERE date < CURRENT_DATE;
      `;

      const deleteResult = await client.query(deletePastBookingsQuery);

      return res.status(200).json({
        message: `Successfully deleted ${deleteResult.rowCount} past bookings.`,
      });

    } else if (req.method === 'PUT') {
      // Update booking status
      const { bookingId, status } = req.body;
    
      console.log('Updating booking status for:', bookingId, 'with status:', status);  // Log incoming data
    
      if (!bookingId || !status) {
        console.log('Missing bookingId or status');  // Log error condition
        return res.status(400).json({ message: 'Booking ID and status are required' });
      }
    
      const validStatuses = ['Pending', 'Ongoing', 'Completed'];
      if (!validStatuses.includes(status)) {
        console.log('Invalid status:', status);  // Log invalid status condition
        return res.status(400).json({ message: 'Invalid status' });
      }
    
      try {
        // Update the status in the database
        const updateQuery = `
          UPDATE bookings
          SET status = $1
          WHERE bookingid = $2
          RETURNING *;
        `;
        
        const updateResult = await client.query(updateQuery, [status, bookingId]);
    
        if (updateResult.rowCount === 0) {
          console.log('Booking not found for ID:', bookingId);  // Log if booking is not found
          return res.status(404).json({ message: 'Booking not found' });
        }
    
        const updatedBooking = updateResult.rows[0];
        console.log('Booking updated:', updatedBooking);  // Log updated booking
    
        return res.status(200).json({ message: 'Booking status updated successfully', booking: updatedBooking });
      } catch (err) {
        console.error('Database error:', err);  // Log database error
        return res.status(500).json({ message: 'Failed to update booking status' });
      }
    
    
    } else if (req.method === 'DELETE' && req.query.past) {
      // Delete past bookings logic (no changes needed)
      // ... existing DELETE logic ...
    } else {
      res.setHeader('Allow', ['POST', 'GET', 'DELETE', 'PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch  {
    console.error('Unexpected error:');
    return res.status(500).json({ message: 'An unexpected error occurred' });
  } finally {
    client.release();
  }
};

export default bookingHandler;