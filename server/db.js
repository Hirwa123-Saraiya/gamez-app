const { Pool } = require('pg');

const connectionString = 'postgresql://postgres:user@localhost:5432/gamez_db';

const pool = new Pool({
  connectionString: connectionString
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

module.exports = pool;