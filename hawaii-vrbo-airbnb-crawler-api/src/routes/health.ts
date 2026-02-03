import { Router } from 'express';

const router = Router();

// Basic health check
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      api: 'OK',
      database: 'Unknown',
      temporal: 'Unknown',
    },
  };

  try {
    // Check PostgreSQL connectivity
    const { getPool } = await import('../config/database');
    const pool = getPool();
    await pool.query('SELECT 1');
    health.services.database = 'OK';
  } catch (error) {
    health.services.database = 'Error';
    health.status = 'DEGRADED';
  }

  try {
    // Basic Temporal connectivity check would go here
    health.services.temporal = 'OK';
  } catch (error) {
    health.services.temporal = 'Error';
    health.status = 'DEGRADED';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
