-- gamez-app/database/01_schema.sql
-- Database schema for Gamez Application

-- ==================== CREATE TABLES ====================

-- 1. Venues table
CREATE TABLE venues (
    venue_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

-- 2. Members table
CREATE TABLE members (
    member_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20),
    is_trial_user BOOLEAN,
    converted_from_trial BOOLEAN,
    join_date DATE
);

-- 3. Bookings table
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY,
    venue_id INT REFERENCES venues(venue_id),
    sport_id INT,
    member_id INT REFERENCES members(member_id),
    booking_date TIMESTAMP,
    amount DECIMAL(10, 2),
    coupon_code VARCHAR(50),
    status VARCHAR(50)
);

-- 4. Transactions table
CREATE TABLE transactions (
    transaction_id VARCHAR(10) PRIMARY KEY,
    booking_id INT REFERENCES bookings(booking_id),
    type VARCHAR(50),
    amount DECIMAL(10, 2),
    status VARCHAR(50),
    transaction_date DATE
);

-- ==================== CREATE INDEXES ====================

CREATE INDEX idx_bookings_venue ON bookings(venue_id);
CREATE INDEX idx_bookings_member ON bookings(member_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_transactions_booking ON transactions(booking_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_trial ON members(is_trial_user);

-- ==================== CREATE VIEWS ====================

-- View for dashboard metrics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM members WHERE status = 'Active') as active_members,
    (SELECT COUNT(*) FROM members WHERE status = 'Inactive') as inactive_members,
    (SELECT COUNT(*) FROM bookings WHERE status IN ('Confirmed', 'Complete')) as total_bookings,
    (SELECT COALESCE(SUM(amount), 0) FROM bookings WHERE status IN ('Confirmed', 'Complete')) as booking_revenue,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE status = 'Success') as total_revenue,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'Coaching' AND status = 'Success') as coaching_revenue,
    (SELECT COUNT(*) FROM bookings WHERE coupon_code IS NOT NULL AND coupon_code != '') as coupon_redemption,
    (SELECT COUNT(*) FROM transactions WHERE status IN ('Refunded', 'Dispute')) as refunds_disputes;

-- View for venue performance
CREATE OR REPLACE VIEW venue_performance AS
SELECT 
    v.venue_id,
    v.name as venue_name,
    v.location,
    COUNT(DISTINCT b.booking_id) as total_bookings,
    COALESCE(SUM(CASE WHEN t.status = 'Success' THEN t.amount ELSE 0 END), 0) as total_revenue,
    COUNT(DISTINCT CASE WHEN b.status IN ('Confirmed', 'Complete') THEN b.member_id END) as unique_members
FROM venues v
LEFT JOIN bookings b ON v.venue_id = b.venue_id
LEFT JOIN transactions t ON b.booking_id = t.booking_id
GROUP BY v.venue_id, v.name, v.location
ORDER BY total_revenue DESC;