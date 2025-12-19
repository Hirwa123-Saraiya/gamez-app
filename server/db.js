// const { Pool } = require('pg');

// const connectionString = 'postgresql://postgres:user@localhost:5432/gamez_db';

// const pool = new Pool({
//   connectionString: connectionString
// });

// // Test connection
// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Database connection error:', err.message);
//   } else {
//     console.log('Database connected successfully at:', res.rows[0].now);
//   }
// });

// module.exports = pool;

// server/db.js
const { Pool } = require('pg');

// Development vs Production configuration
const getPoolConfig = () => {
  // If DATABASE_URL is provided (for production/Railway/Vercel)
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  }
  
  // Local development configuration
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'gamez_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'user',
  };
};

const pool = new Pool(getPoolConfig());

// Test connection with better error handling
pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
});

module.exports = pool;