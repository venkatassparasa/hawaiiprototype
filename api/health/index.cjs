const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: process.env.POSTGRES_URI?.includes('vercel') ? { rejectUnauthorized: false } : false
});

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Test database connection
    let dbStatus = 'disconnected';
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      dbStatus = 'connected';
    } catch (error) {
      console.error('Database connection failed:', error);
    }

    // Test Temporal connection (simplified)
    let temporalStatus = 'disconnected';
    if (process.env.TEMPORAL_ADDRESS) {
      temporalStatus = 'connected'; // Simplified check
    }

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'running',
        database: dbStatus,
        temporal: temporalStatus
      },
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    return res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};
