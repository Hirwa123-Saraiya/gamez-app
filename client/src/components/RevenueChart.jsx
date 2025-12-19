import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const RevenueChart = ({ data }) => {
  // Format data for the chart
  const chartData = data.map(venue => ({
    name: venue.venue_name,
    revenue: parseFloat(venue.revenue),
    bookings: venue.booking_count
  }));

  return (
    <div className="chart-container">
      <h3>Revenue by Venue</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Legend />
            <Bar 
              dataKey="revenue" 
              name="Revenue ($)" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="bookings" 
              name="Bookings" 
              fill="#82ca9d" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;