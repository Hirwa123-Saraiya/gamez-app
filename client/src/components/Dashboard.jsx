import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tabs from './Tabs';
import DashboardTab from './DashboardTab';
import BookingTab from './BookingTab';
import GeneralTab from './GeneralTab';
import CoachingTab from './CoachingTab';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [venueRevenue, setVenueRevenue] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [coachingData, setCoachingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats
      const statsResponse = await axios.get('http://localhost:5000/api/dashboard/summary');
      setStats(statsResponse.data);

      // Fetch venue revenue for chart
      const venueResponse = await axios.get('http://localhost:5000/api/dashboard/revenue-by-venue');
      setVenueRevenue(venueResponse.data);

      // Fetch bookings data
      const bookingsResponse = await axios.get('http://localhost:5000/api/bookings');
      setBookings(bookingsResponse.data);

      // Fetch coaching data (transactions with type='Coaching')
      const coachingResponse = await axios.get('http://localhost:5000/api/transactions');
      const coachingTransactions = coachingResponse.data.filter(t => t.type === 'Coaching');
      setCoachingData(coachingTransactions);

      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) return <div className="loading">Loading dashboard...</div>;

  // Error state
  if (error) return <div className="error">{error}</div>;

  // Render active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab stats={stats} venueRevenue={venueRevenue} />;
      case 'booking':
        return <BookingTab bookings={bookings} stats={stats} />;
      case 'coaching':
        return <CoachingTab coachingData={coachingData} stats={stats} />;
      case 'general':
        return <GeneralTab />;
      default:
        return <DashboardTab stats={stats} venueRevenue={venueRevenue} />;
    }
  };

  return (
    <div className="dashboard">
      <h1>Gamez Management System</h1>
      
      {/* Tab Navigation */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;