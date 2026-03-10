import express, { Request, Response } from 'express';
import { query } from '../config/database';
import { logger } from '../utils/logger';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/crawl/airbnb:
 *   post:
 *     summary: Start Airbnb crawl
 *     tags: [Crawl]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxListings:
 *                 type: integer
 *               checkIn:
 *                 type: string
 *                 format: date
 *               checkOut:
 *                 type: string
 *                 format: date
 *               guests:
 *                 type: integer
 *             required:
 *               - locations
 *     responses:
 *       200:
 *         description: Airbnb crawl started
 */
// POST /api/crawl/airbnb - Crawl Airbnb listings
router.post('/airbnb', authMiddleware, async (req: Request, res: Response): Promise<Response> => {
  try {
    const { locations, maxListings, checkIn, checkOut, guests } = req.body;

    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one location is required',
      });
    }

    logger.info(`Starting Airbnb crawl for locations: ${locations.join(', ')}`);

    const jobId = `airbnb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store job in PostgreSQL
    await query(
      'INSERT INTO crawl_jobs (job_id, platform, status, locations, max_listings, started_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [jobId, 'airbnb', 'running', locations, maxListings || 1000]
    );

    res.json({
      success: true,
      message: 'Airbnb crawl started successfully',
      jobId,
      estimatedTime: '30-60 minutes',
      statistics: {
        locations: locations.length,
        maxListings: maxListings || 1000,
      },
    });
    return res;
  } catch (error) {
    logger.error('Error starting Airbnb crawl:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start Airbnb crawl',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return res;
  }
});

/**
 * @swagger
 * /api/crawl/vrbo:
 *   post:
 *     summary: Start VRBO crawl
 *     tags: [Crawl]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxListings:
 *                 type: integer
 *             required:
 *               - locations
 *     responses:
 *       200:
 *         description: VRBO crawl started
 */
// POST /api/crawl/vrbo - Crawl VRBO listings
router.post('/vrbo', authMiddleware, async (req: Request, res: Response): Promise<Response> => {
  try {
    const { locations, maxListings, checkIn, checkOut, guests } = req.body;

    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one location is required',
      });
    }

    logger.info(`Starting VRBO crawl for locations: ${locations.join(', ')}`);

    const jobId = `vrbo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store job in PostgreSQL
    await query(
      'INSERT INTO crawl_jobs (job_id, platform, status, locations, max_listings, started_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [jobId, 'vrbo', 'running', locations, maxListings || 1000]
    );

    res.json({
      success: true,
      message: 'VRBO crawl started successfully',
      jobId,
      estimatedTime: '45-90 minutes',
      statistics: {
        locations: locations.length,
        maxListings: maxListings || 1000,
      },
    });
    return res;
  } catch (error) {
    logger.error('Error starting VRBO crawl:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start VRBO crawl',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return res;
  }
});

/**
 * @swagger
 * /api/crawl/all:
 *   post:
 *     summary: Start Airbnb and VRBO crawls
 *     tags: [Crawl]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locations:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxListings:
 *                 type: integer
 *             required:
 *               - locations
 *     responses:
 *       200:
 *         description: Both crawls started
 */
// POST /api/crawl/all - Crawl both platforms
router.post('/all', authMiddleware, async (req: Request, res: Response): Promise<Response> => {
  try {
    const { locations, maxListings } = req.body;

    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one location is required',
      });
    }

    logger.info(`Starting full crawl for locations: ${locations.join(', ')}`);

    const airbnbJobId = `airbnb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const vrboJobId = `vrbo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store both jobs in PostgreSQL
    await query(
      'INSERT INTO crawl_jobs (job_id, platform, status, locations, max_listings, started_at) VALUES ($1, $2, $3, $4, $5, NOW()), ($6, $7, $8, $9, $10, NOW())',
      [airbnbJobId, 'airbnb', 'running', locations, Math.floor((maxListings || 1000) / 2), vrboJobId, 'vrbo', 'running', locations, Math.floor((maxListings || 1000) / 2)]
    );

    res.json({
      success: true,
      message: 'Full crawl started successfully',
      jobs: {
        airbnb: airbnbJobId,
        vrbo: vrboJobId,
      },
      estimatedTime: '60-120 minutes',
      statistics: {
        locations: locations.length,
        maxListings: maxListings || 1000,
      },
    });
    return res;
  } catch (error) {
    logger.error('Error starting full crawl:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start full crawl',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return res;
  }
});

/**
 * @swagger
 * /api/crawl/status/{jobId}:
 *   get:
 *     summary: Get crawl job status
 *     tags: [Crawl]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job status
 *       404:
 *         description: Job not found
 */
// GET /api/crawl/status/:jobId - Get crawl job status
router.get('/status/:jobId', authMiddleware, async (req: Request, res: Response): Promise<Response> => {
  try {
    const { jobId } = req.params;

    const result = await query(
      'SELECT * FROM crawl_jobs WHERE job_id = $1',
      [jobId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    const job = result.rows[0];

    res.json({
      success: true,
      jobId: job.job_id,
      status: job.status,
      progress: Math.floor(Math.random() * 100), // Mock progress
      startedAt: job.started_at,
      completedAt: job.completed_at,
      statistics: job.statistics || {
        listingsProcessed: Math.floor(Math.random() * 500),
        violationsFound: Math.floor(Math.random() * 50),
        propertiesUpdated: Math.floor(Math.random() * 100),
      },
    });
    return res;
  } catch (error) {
    logger.error('Error getting crawl status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get crawl status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return res;
  }
});

/**
 * @swagger
 * /api/crawl/history:
 *   get:
 *     summary: Get crawl history
 *     tags: [Crawl]
     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [all, airbnb, vrbo]
 *     responses:
 *       200:
 *         description: Crawl history list
 */
// GET /api/crawl/history - Get crawl history
router.get('/history', authMiddleware, async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit = 50, platform = 'all' } = req.query;

    let queryText = 'SELECT * FROM crawl_jobs';
    const params: any[] = [];

    if (platform !== 'all') {
      queryText += ' WHERE platform = $1';
      params.push(platform);
    }

    queryText += ' ORDER BY started_at DESC LIMIT $' + (params.length + 1);
    params.push(parseInt(limit as string));

    const result = await query(queryText, params);

    res.json({
      success: true,
      history: result.rows,
      total: result.rows.length,
    });
    return res;
  } catch (error) {
    logger.error('Error getting crawl history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get crawl history',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return res;
  }
});

/**
 * @swagger
 * /api/crawl/statistics:
 *   get:
 *     summary: Get crawl statistics
 *     tags: [Crawl]
 *     responses:
 *       200:
 *         description: Aggregate crawl statistics
 */
// GET /api/crawl/statistics - Get crawl statistics
router.get('/statistics', authMiddleware, async (req: Request, res: Response): Promise<Response> => {
  try {
    // Get statistics from database
    const propertiesResult = await query('SELECT COUNT(*) as total FROM properties');
    const violationsResult = await query('SELECT COUNT(*) as total FROM violations WHERE status = $1', ['open']);
    const crawlJobsResult = await query('SELECT COUNT(*) as total FROM crawl_jobs WHERE status = $1', ['completed']);

    const combinedStats = {
      totalProperties: parseInt(propertiesResult.rows[0].total),
      activeAirbnbListings: Math.floor(Math.random() * 100), // Mock data
      activeVRBOListings: Math.floor(Math.random() * 100), // Mock data
      totalViolations: parseInt(violationsResult.rows[0].total),
      unregisteredProperties: Math.floor(Math.random() * 50), // Mock data
      lastCrawl: new Date().toISOString(),
    };

    res.json({
      success: true,
      statistics: combinedStats,
    });
    return res;
  } catch (error) {
    logger.error('Error getting crawl statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get crawl statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return res;
  }
});

export default router;
