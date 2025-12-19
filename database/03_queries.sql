-- gamez-app/database/03_queries.sql
-- Useful queries for Gamez Application

-- ==================== DASHBOARD QUERIES ====================

-- 1. Get dashboard summary
SELECT * FROM dashboard_stats;

-- 2. Get venue performance
SELECT * FROM venue_performance;

-- 3. Get conversion rate
SELECT 
    ROUND(
        COUNT(CASE WHEN converted_from_trial = true THEN 1 END) * 100.0 / 
        NULLIF(COUNT(CASE WHEN is_trial_user = true THEN 1 END), 0), 2
    ) as conversion_rate 
FROM members;

-- 4. Get recent bookings (last 7 days)
SELECT 
    b.booking_id,
    v.name as venue_name,
    m.name as member_name,
    b.booking_date,
    b.amount,
    b.status,
    b.coupon_code
FROM bookings b
JOIN venues v ON b.venue_id = v.venue_id
JOIN members m ON b.member_id = m.member_id
WHERE b.booking_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY b.booking_date DESC;

-- 5. Get revenue by venue type (chart data)
SELECT 
    v.name as venue_name,
    COALESCE(SUM(t.amount), 0) as revenue,
    COUNT(DISTINCT b.booking_id) as booking_count
FROM venues v
LEFT JOIN bookings b ON v.venue_id = b.venue_id AND b.status IN ('Confirmed', 'Complete')
LEFT JOIN transactions t ON b.booking_id = t.booking_id AND t.status = 'Success'
GROUP BY v.venue_id, v.name
ORDER BY revenue DESC;

-- ==================== ANALYTICS QUERIES ====================

-- Monthly revenue
SELECT 
    DATE_TRUNC('month', transaction_date) as month,
    type,
    SUM(amount) as total_revenue,
    COUNT(*) as transaction_count
FROM transactions 
WHERE status = 'Success'
GROUP BY DATE_TRUNC('month', transaction_date), type
ORDER BY month DESC;

-- Member activity
SELECT 
    m.status,
    COUNT(*) as member_count,
    COUNT(CASE WHEN b.booking_id IS NOT NULL THEN 1 END) as active_bookers,
    AVG(b.amount) as avg_booking_amount
FROM members m
LEFT JOIN bookings b ON m.member_id = b.member_id AND b.status IN ('Confirmed', 'Complete')
GROUP BY m.status;

-- ==================== UTILITY QUERIES ====================

-- Reset database (DANGEROUS - use only in development)
-- DROP TABLE IF EXISTS transactions CASCADE;
-- DROP TABLE IF EXISTS bookings CASCADE;
-- DROP TABLE IF EXISTS members CASCADE;
-- DROP TABLE IF EXISTS venues CASCADE;