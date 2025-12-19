import React from 'react';

const BookingTab = ({ bookings, stats }) => {
  return (
    <div className="booking-tab">
      <h2>Bookings Management</h2>
      
      {/* Booking Summary Cards */}
      <div className="stats-grid">
        <div className="stat-row">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-value">{stats?.totalBookings || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Booking Revenue</h3>
            <p className="stat-value"> ₹{stats?.bookingRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="stat-card">
            <h3>Report Booking</h3>
            <p className="stat-value">0.00%</p>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="table-section">
        <h3>Recent Bookings</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Venue</th>
              <th>Member</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Coupon</th>
            </tr>
          </thead>
          <tbody>
            {bookings.slice(0, 10).map(booking => (
              <tr key={booking.booking_id}>
                <td>{booking.booking_id}</td>
                <td>{booking.venue_name}</td>
                <td>{booking.member_name}</td>
                <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                <td> ₹{parseFloat(booking.amount).toFixed(2)}</td>
                <td className={`status- ₹{booking.status.toLowerCase()}`}>
                  {booking.status}
                </td>
                <td>{booking.coupon_code || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTab;