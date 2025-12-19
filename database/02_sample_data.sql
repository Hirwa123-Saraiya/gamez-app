-- gamez-app/database/02_sample_data.sql
-- Sample data for Gamez Application

-- ==================== INSERT VENUES ====================
INSERT INTO venues (venue_id, name, location) VALUES
(1, 'Grand Slam Arena', 'North Hills'),
(2, 'City Kickers Turf', 'Downtown'),
(3, 'AquaBlue Pool Center', 'Westside'),
(4, 'Smash Point Badminton', 'East District'),
(5, 'Legends Cricket Ground', 'Suburbs')
ON CONFLICT (venue_id) DO NOTHING;

-- ==================== INSERT MEMBERS ====================
INSERT INTO members (member_id, name, status, is_trial_user, converted_from_trial, join_date) VALUES
(1, 'Rahul Sharma', 'Active', false, false, '2025-10-15'),
(2, 'Priya Singh', 'Active', true, true, '2025-11-01'),
(3, 'Amit Patel', 'Inactive', false, false, '2025-09-10'),
(4, 'Sneha Gupta', 'Active', false, true, '2025-11-20'),
(5, 'Vikram Malhotra', 'Active', true, false, '2025-12-10'),
(6, 'Anjali Desai', 'Inactive', true, false, '2025-11-05'),
(7, 'John Doe', 'Active', false, false, '2025-08-15'),
(8, 'Sarah Lee', 'Active', true, true, '2025-12-01')
ON CONFLICT (member_id) DO NOTHING;

-- ==================== INSERT BOOKINGS ====================
INSERT INTO bookings (booking_id, venue_id, sport_id, member_id, booking_date, amount, coupon_code, status) VALUES
(1, 1, 1, 1, '2025-12-12 10:00:00', 500.00, NULL, 'Complete'),
(2, 2, 2, 2, '2025-12-13 14:00:00', 1200.00, NULL, 'Confirmed'),
(3, 3, 3, 7, '2025-12-13 07:00:00', 300.00, 'EARLYBIRD', 'Confirmed'),
(4, 4, 4, 4, '2025-12-13 18:00:00', 400.00, 'WELCOMESO', 'Confirmed'),
(5, 5, 5, 5, '2025-12-14 09:00:00', 1500.00, NULL, 'Confirmed'),
(6, 1, 1, 1, '2025-12-13 10:00:00', 500.00, 'SAVE10', 'Confirmed'),
(7, 2, 2, 8, '2025-12-15 16:00:00', 600.00, NULL, 'Confirmed'),
(8, 3, 3, 3, '2025-12-10 15:00:00', 300.00, NULL, 'Cancelled')
ON CONFLICT (booking_id) DO NOTHING;

-- ==================== INSERT TRANSACTIONS ====================
INSERT INTO transactions (transaction_id, booking_id, type, amount, status, transaction_date) VALUES
('101', 1, 'Booking', 500.00, 'Success', '2025-12-12'),
('102', 2, 'Coaching', 1200.00, 'Success', '2025-12-13'),
('103', 3, 'Booking', 270.00, 'Success', '2025-12-13'),
('104', 4, 'Booking', 200.00, 'Success', '2025-12-13'),
('105', 5, 'Booking', 1500.00, 'Success', '2025-12-14'),
('106', 6, 'Booking', 450.00, 'Success', '2025-12-13'),
('107', 7, 'Coaching', 600.00, 'Dispute', '2025-12-15'),
('108', 8, 'Booking', 300.00, 'Refunded', '2025-12-10')
ON CONFLICT (transaction_id) DO NOTHING;