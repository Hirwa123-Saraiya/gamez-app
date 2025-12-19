import React from 'react';
import LineChartComponent from './LineChartComponent';

const DashboardTab = ({ stats, venueRevenue }) => {
  if (!stats) return <div className="no-data">No dashboard data available.</div>;

  return (
    <div>
      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-row">
          <div className="stat-card">
            <h3>Active Members</h3>
            <p className="stat-value">{stats.activeMembers}</p>
          </div>
          <div className="stat-card">
            <h3>Inactive Members</h3>
            <p className="stat-value">{stats.inactiveMembers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-value">{stats.totalBookings}</p>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-card">
            <h3>Booking Revenue</h3>
            <p className="stat-value"> ₹{stats.bookingRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-value"> ₹{stats.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="stat-card">
            <h3>Coaching Revenue</h3>
            <p className="stat-value"> ₹{stats.coachingRevenue?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-card">
            <h3>Total Conversion Rate</h3>
            <p className="stat-value">{stats.conversionRate?.toFixed(2) || '0.00'}%</p>
          </div>
          <div className="stat-card">
            <h3>Slots Utilization</h3>
            <p className="stat-value">{stats.stockUtilization?.toFixed(2) || '0.00'}%</p>
          </div>
          <div className="stat-card">
            <h3>Coupon Redemption</h3>
            <p className="stat-value">{stats.couponRedemption || 0}</p>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-card">
            <h3>Refunds & Disputes</h3>
            <p className="stat-value">{stats.refundsDisputes || 0}</p>
          </div>
        </div>
      </div>

      {/* LINE CHART */}
      <div className="chart-section">
        <LineChartComponent data={venueRevenue} />
      </div>
    </div>
  );
};

export default DashboardTab;