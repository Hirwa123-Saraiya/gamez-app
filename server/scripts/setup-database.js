// server/scripts/setup-database.js
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'gamez_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ''
};

const sqlFiles = [
  path.join(__dirname, '../../database/01_schema.sql'),
  path.join(__dirname, '../../database/02_sample_data.sql')
];

console.log('Setting up Gamez Database...');

// Build psql command
const command = `psql "postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}"`;

sqlFiles.forEach((file, index) => {
  exec(`${command} -f "${file}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${file}:`, error.message);
      return;
    }
    if (stderr) {
      console.error(`stderr for ${file}:`, stderr);
    }
    console.log(`✅ Executed ${path.basename(file)} successfully`);
    
    if (index === sqlFiles.length - 1) {
      console.log('\n🎉 Database setup complete!');
      console.log('Run: npm start (to start the server)');
    }
  });
});