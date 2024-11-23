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
    } else {
      res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Unexpected server error:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
    console.error('Unexpected non-Error object:', err);
    return res.status(500).json({ message: 'An unexpected error occurred' });
  } finally {
    client.release();
  }
};
export default bookingHandler;
