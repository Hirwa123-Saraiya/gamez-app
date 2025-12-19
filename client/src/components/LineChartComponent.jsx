import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend 
} from 'recharts';

const LineChartComponent = ({ data }) => {
  // Safe data formatting
  const chartData = Array.isArray(data) && data.length > 0 
    ? data.map(venue => ({
        name: venue.venue_name || 'Venue',
        revenue: Number(venue.revenue) || 0,
        bookings: Number(venue.booking_count) || 0
      }))
    : [
        { name: 'No Data', revenue: 0, bookings: 0 }
      ];

  return (
    <div className="chart-container">
      <h3>Revenue by Venue</h3>
      <LineChart
        width={800}
        height={350}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={70}
          interval={0}
          tick={{ fontSize: 11 }}
        />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'revenue') {
              return [`$${Number(value).toFixed(2)}`, 'Revenue'];
            }
            return [value, 'Bookings'];
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          name="Revenue ($)" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="bookings" 
          name="Bookings" 
          stroke="#82ca9d" 
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </LineChart>
    </div>
  );
};

export default LineChartComponent;