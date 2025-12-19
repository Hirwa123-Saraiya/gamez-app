import React from 'react';

const GeneralTab = () => {
  return (
    <div className="general-tab">
      <h2>General Settings</h2>
      <div className="settings-section">
        <p>System configuration and settings will appear here.</p>
        <div className="setting-item">
          <h3>System Status</h3>
          <p>✅ All systems operational</p>
        </div>
        <div className="setting-item">
          <h3>Database Connection</h3>
          <p>✅ Connected to PostgreSQL</p>
        </div>
        <div className="setting-item">
          <h3>API Status</h3>
          <p>✅ Backend API running on port 5000</p>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;