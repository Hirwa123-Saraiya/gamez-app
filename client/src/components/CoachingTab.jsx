import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import './CoachingTab.css';

const CoachingTab = () => {
  const [coachingStats, setCoachingStats] = useState(null);
  const [coachingSessions, setCoachingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // all, success, dispute

  useEffect(() => {
    fetchCoachingData();
  }, []);

  const fetchCoachingData = async () => {
    try {
      // Get all transactions and filter coaching
      const transactionsResponse = await axios.get('http://localhost:5000/api/transactions');
      const allTransactions = transactionsResponse.data;
      
      // Filter coaching transactions
      const coachingTransactions = allTransactions.filter(t => t.type === 'Coaching');
      
      // Calculate coaching stats
      const totalCoaching = coachingTransactions.length;
      const successCoaching = coachingTransactions.filter(t => t.status === 'Success').length;
      const disputeCoaching = coachingTransactions.filter(t => t.status === 'Dispute').length;
      const totalRevenue = coachingTransactions
        .filter(t => t.status === 'Success')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      const disputeRevenue = coachingTransactions
        .filter(t => t.status === 'Dispute')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

      setCoachingStats({
        totalSessions: totalCoaching,
        successSessions: successCoaching,
        disputeSessions: disputeCoaching,
        totalRevenue: totalRevenue,
        disputeRevenue: disputeRevenue,
        successRate: totalCoaching > 0 ? (successCoaching / totalCoaching * 100).toFixed(1) : 0
      });

      // Format sessions for table
      const sessionsWithDetails = coachingTransactions.map(session => ({
        ...session,
        venue_name: session.venue_name || 'Unknown Venue',
        member_name: session.member_name || 'Unknown Member'
      }));
      
      setCoachingSessions(sessionsWithDetails);

    } catch (error) {
      console.error('Error fetching coaching data:', error);
      // Fallback data for demo
      setCoachingStats({
        totalSessions: 2,
        successSessions: 1,
        disputeSessions: 1,
        totalRevenue: 1800,
        disputeRevenue: 600,
        successRate: 50.0
      });
      setCoachingSessions([
        {
          transaction_id: '102',
          booking_id: 2,
          amount: 1200,
          status: 'Success',
          transaction_date: '2025-12-13',
          venue_name: 'City Kickers Turf',
          member_name: 'Priya Singh'
        },
        {
          transaction_id: '107',
          booking_id: 7,
          amount: 600,
          status: 'Dispute',
          transaction_date: '2025-12-15',
          venue_name: 'City Kickers Turf',
          member_name: 'Sarah Lee'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions based on active filter
  const filteredSessions = coachingSessions.filter(session => {
    if (activeFilter === 'all') return true;
    return session.status.toLowerCase() === activeFilter;
  });

  // Data for pie chart
  const pieChartData = coachingStats ? [
    { name: 'Success', value: coachingStats.successSessions, color: '#28a745' },
    { name: 'Dispute', value: coachingStats.disputeSessions, color: '#ffc107' }
  ] : [];

  // Data for revenue bar chart
  const revenueData = [
    { name: 'Success', revenue: coachingStats?.totalRevenue || 0 },
    { name: 'Dispute', revenue: coachingStats?.disputeRevenue || 0 }
  ];

  if (loading) return <div className="loading">Loading coaching data...</div>;

  return (
    <div className="coaching-tab">
      <div className="coaching-header">
        <h2>Coaching Management</h2>
        <p className="coaching-subtitle">Track coaching sessions, revenue, and performance</p>
      </div>

      {/* Coaching Stats Cards */}
      <div className="coaching-stats-grid">
        <div className="coaching-stat-card primary">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <h3>Total Coaching Sessions</h3>
            <p className="stat-value">{coachingStats.totalSessions}</p>
          </div>
        </div>

        <div className="coaching-stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Successful Sessions</h3>
            <p className="stat-value">{coachingStats.successSessions}</p>
            <p className="stat-subtext">Success Rate: {coachingStats.successRate}%</p>
          </div>
        </div>

        <div className="coaching-stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Dispute Sessions</h3>
            <p className="stat-value">{coachingStats.disputeSessions}</p>
          </div>
        </div>

        <div className="coaching-stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Coaching Revenue</h3>
            <p className="stat-value">₹{coachingStats.totalRevenue.toFixed(2)}</p>
            <p className="stat-subtext">Disputes: ${coachingStats.disputeRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Pie Chart - Session Distribution */}
        <div className="chart-container">
          <h3>Session Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} sessions`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Revenue by Status */}
        <div className="chart-container">
          <h3>Revenue Analysis</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$₹{value.toFixed(2)}`, 'Revenue']} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue (₹)" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Sessions ({coachingSessions.length})
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'success' ? 'active' : ''}`}
          onClick={() => setActiveFilter('success')}
        >
          Success ({coachingStats.successSessions})
        </button>
        <button 
          className={`filter-btn {activeFilter === 'dispute' ? 'active' : ''}`}
          onClick={() => setActiveFilter('dispute')}
        >
          Dispute ({coachingStats.disputeSessions})
        </button>
      </div>

      {/* Coaching Sessions Table */}
      <div className="sessions-table">
        <h3>Coaching Sessions</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Booking ID</th>
                <th>Venue</th>
                <th>Member</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(session => (
                <tr key={session.transaction_id}>
                  <td>{session.transaction_id}</td>
                  <td>{session.booking_id}</td>
                  <td>{session.venue_name}</td>
                  <td>{session.member_name}</td>
                  <td className="amount-cell">
                     ₹{parseFloat(session.amount).toFixed(2)}
                  </td>
                  <td>
                    <span className={`status-badge status-${session.status.toLowerCase()}`}>
                      {session.status}
                    </span>
                  </td>
                  <td>{new Date(session.transaction_date).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view-btn">View</button>
                      {session.status === 'Dispute' && (
                        <button className="action-btn resolve-btn">Resolve</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredSessions.length === 0 && (
        <div className="empty-state">
          <p>No coaching sessions found with the selected filter.</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons-row">
          <button className="action-btn primary-btn">
            + Schedule New Coaching
          </button>
          <button className="action-btn secondary-btn">
            Generate Report
          </button>
          <button className="action-btn warning-btn">
            View All Disputes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachingTab;