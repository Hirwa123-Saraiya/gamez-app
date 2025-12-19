const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Gamez API is running' });
});

// ==================== DASHBOARD ENDPOINTS ====================

// Dashboard Summary Stats (FIXED VERSION)
app.get('/api/dashboard/summary', async (req, res) => {
  try {
    // 1. Total Revenue from SUCCESSFUL transactions only
    const revenueQuery = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total_revenue FROM transactions WHERE status = 'Success'"
    );

    // 2. Active Members (all active members)
    const activeMembersQuery = await pool.query(
      "SELECT COUNT(*) as count FROM members WHERE status = 'Active'"
    );

    // 3. Inactive Members
    const inactiveMembersQuery = await pool.query(
      "SELECT COUNT(*) as count FROM members WHERE status = 'Inactive'"
    );

    // 4. Total Bookings (confirmed and complete)
    const bookingsQuery = await pool.query(
      "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as booking_revenue FROM bookings WHERE status IN ('Confirmed', 'Complete')"
    );

    // 5. Trial Conversion Rate
    const conversionQuery = await pool.query(`
      SELECT 
        ROUND(
          COUNT(CASE WHEN converted_from_trial = true THEN 1 END) * 100.0 / 
          NULLIF(COUNT(CASE WHEN is_trial_user = true THEN 1 END), 0), 2
        ) as conversion_rate 
      FROM members
    `);

    // 6. Coaching Revenue
    const coachingQuery = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as coaching_revenue FROM transactions WHERE type = 'Coaching' AND status = 'Success'"
    );

    // 7. Coupon Redemption
    const couponQuery = await pool.query(
      "SELECT COUNT(*) as count FROM bookings WHERE coupon_code IS NOT NULL AND coupon_code != ''"
    );

    // 8. Refunds & Disputes
    const refundsQuery = await pool.query(
      "SELECT COUNT(*) as count FROM transactions WHERE status IN ('Refunded', 'Dispute')"
    );

    // 9. Stock Utilization (venues with bookings / total venues)
    const stockUtilQuery = await pool.query(`
      SELECT 
        ROUND(
          COUNT(DISTINCT b.venue_id) * 100.0 / 
          NULLIF((SELECT COUNT(*) FROM venues), 0), 2
        ) as stock_utilization
      FROM bookings b
      WHERE b.status IN ('Confirmed', 'Complete')
    `);

    res.json({
      // Members
      activeMembers: parseInt(activeMembersQuery.rows[0].count) || 0,
      inactiveMembers: parseInt(inactiveMembersQuery.rows[0].count) || 0,
      
      // Bookings
      totalBookings: parseInt(bookingsQuery.rows[0].count) || 0,
      bookingRevenue: parseFloat(bookingsQuery.rows[0].booking_revenue) || 0,
      
      // Revenue
      totalRevenue: parseFloat(revenueQuery.rows[0].total_revenue) || 0,
      coachingRevenue: parseFloat(coachingQuery.rows[0].coaching_revenue) || 0,
      
      // Conversion & Utilization
      conversionRate: parseFloat(conversionQuery.rows[0].conversion_rate) || 0,
      stockUtilization: parseFloat(stockUtilQuery.rows[0].stock_utilization) || 0,
      
      // Others
      couponRedemption: parseInt(couponQuery.rows[0].count) || 0,
      refundsDisputes: parseInt(refundsQuery.rows[0].count) || 0
    });

  } catch (err) {
    console.error('Dashboard query error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Revenue by Venue for the chart
app.get('/api/dashboard/revenue-by-venue', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.venue_id,
        v.name as venue_name,
        v.location,
        COALESCE(SUM(t.amount), 0) as revenue,
        COUNT(DISTINCT b.booking_id) as booking_count
      FROM venues v
      LEFT JOIN bookings b ON v.venue_id = b.venue_id AND b.status IN ('Confirmed', 'Complete')
      LEFT JOIN transactions t ON b.booking_id = t.booking_id AND t.status = 'Success'
      GROUP BY v.venue_id, v.name, v.location
      ORDER BY revenue DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recent Transactions
app.get('/api/dashboard/recent-transactions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.transaction_id,
        t.type,
        t.amount,
        t.status,
        t.transaction_date,
        v.name as venue_name,
        m.name as member_name
      FROM transactions t
      JOIN bookings b ON t.booking_id = b.booking_id
      JOIN venues v ON b.venue_id = v.venue_id
      JOIN members m ON b.member_id = m.member_id
      ORDER BY t.transaction_date DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Booking Status Summary
app.get('/api/dashboard/booking-status', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM bookings
      GROUP BY status
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DATA TABLE ENDPOINTS ====================

// Get all venues
app.get('/api/venues', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM venues ORDER BY venue_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, v.name as venue_name, m.name as member_name 
      FROM bookings b
      LEFT JOIN venues v ON b.venue_id = v.venue_id
      LEFT JOIN members m ON b.member_id = m.member_id
      ORDER BY booking_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all members
app.get('/api/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members ORDER BY member_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, b.booking_date, b.status as booking_status
      FROM transactions t
      LEFT JOIN bookings b ON t.booking_id = b.booking_id
      ORDER BY transaction_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Dashboard API: http://localhost:${PORT}/api/dashboard/summary`);
});