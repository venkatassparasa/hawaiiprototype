const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Crawler API client
// In Docker dev, talk to crawler-api service on port 3000.
const CRAWLER_API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://crawler-api:3000'
    : process.env.CRAWLER_API_URL || 'http://localhost:3002';
const CRAWLER_API_KEY = process.env.CRAWLER_API_KEY;

const crawlerClient = axios.create({
  baseURL: CRAWLER_API_URL,
  timeout: 60000,
});

// Attach auth header if API key is configured
if (CRAWLER_API_KEY) {
  crawlerClient.defaults.headers.common.Authorization = `Bearer ${CRAWLER_API_KEY}`;
}

// Swagger/OpenAPI setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hawaii Compliance Dashboard API',
      version: '1.0.0',
      description:
        'Backend API for the Hawaii TVR Compliance dashboard, including proxy endpoints for the crawler service.',
    },
    servers: [
      {
        url: 'http://localhost:' + PORT,
      },
    ],
  },
  apis: [], // using inline spec only
};

const swaggerSpec = {
  ...swaggerOptions.definition,
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check for dashboard backend',
        tags: ['System'],
        responses: {
          200: {
            description: 'Backend is healthy',
          },
        },
      },
    },
    '/api/properties': {
      get: {
        summary: 'List compliance properties (placeholder)',
        tags: ['Dashboard'],
        responses: {
          200: { description: 'List of properties' },
        },
      },
    },
    '/api/violations': {
      get: {
        summary: 'List violations (placeholder)',
        tags: ['Dashboard'],
        responses: {
          200: { description: 'List of violations' },
        },
      },
    },
    '/api/complaints': {
      get: {
        summary: 'List complaints (placeholder)',
        tags: ['Dashboard'],
        responses: {
          200: { description: 'List of complaints' },
        },
      },
    },
    '/api/crawl/airbnb': {
      post: {
        summary: 'Start an Airbnb crawl via crawler API',
        tags: ['Crawler'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  locations: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  maxListings: { type: 'integer' },
                  checkIn: { type: 'string', format: 'date' },
                  checkOut: { type: 'string', format: 'date' },
                  guests: { type: 'integer' },
                },
                required: ['locations'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Airbnb crawl started' },
        },
      },
    },
    '/api/crawl/vrbo': {
      post: {
        summary: 'Start a VRBO crawl via crawler API',
        tags: ['Crawler'],
        responses: {
          200: { description: 'VRBO crawl started' },
        },
      },
    },
    '/api/crawl/all': {
      post: {
        summary: 'Start both Airbnb and VRBO crawls',
        tags: ['Crawler'],
        responses: {
          200: { description: 'Both crawls started' },
        },
      },
    },
    '/api/crawl/status/{jobId}': {
      get: {
        summary: 'Get status of a crawl job',
        tags: ['Crawler'],
        parameters: [
          {
            name: 'jobId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Crawl job status' },
          404: { description: 'Job not found' },
        },
      },
    },
    '/api/crawl/history': {
      get: {
        summary: 'Get crawl history',
        tags: ['Crawler'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 50 },
          },
          {
            name: 'platform',
            in: 'query',
            schema: { type: 'string', enum: ['all', 'airbnb', 'vrbo'] },
          },
        ],
        responses: {
          200: { description: 'Crawl history' },
        },
      },
    },
    '/api/crawl/statistics': {
      get: {
        summary: 'Get aggregate crawl statistics',
        tags: ['Crawler'],
        responses: {
          200: { description: 'Crawl statistics' },
        },
      },
    },
  },
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger docs routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'compliance-dashboard-backend',
    version: '1.0.0'
  });
});

// Basic placeholder API endpoints
app.get('/api/properties', (req, res) => {
  res.json({
    properties: [],
    total: 0,
    message: 'Properties endpoint - placeholder'
  });
});

app.get('/api/violations', (req, res) => {
  res.json({
    violations: [],
    total: 0,
    message: 'Violations endpoint - placeholder'
  });
});

app.get('/api/complaints', (req, res) => {
  res.json({
    complaints: [],
    total: 0,
    message: 'Complaints endpoint - placeholder'
  });
});

// ---- Crawler API proxy endpoints (Apify-backed crawler service) ----

function handleCrawlerError(error, res) {
  if (error.response) {
    return res.status(error.response.status).json(
      typeof error.response.data === 'object'
        ? error.response.data
        : { message: String(error.response.data) }
    );
  }

  console.error('Crawler API error:', error.message || error);
  return res.status(502).json({
    message: 'Failed to reach crawler API',
  });
}

// Start Airbnb crawl -> forwards to crawler API
app.post('/api/crawl/airbnb', async (req, res) => {
  try {
    const response = await crawlerClient.post('/api/crawl/airbnb', req.body);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleCrawlerError(error, res);
  }
});

// Start VRBO crawl
app.post('/api/crawl/vrbo', async (req, res) => {
  try {
    const response = await crawlerClient.post('/api/crawl/vrbo', req.body);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleCrawlerError(error, res);
  }
});

// Start both crawls
app.post('/api/crawl/all', async (req, res) => {
  try {
    const response = await crawlerClient.post('/api/crawl/all', req.body);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleCrawlerError(error, res);
  }
});

// Get crawl job status
app.get('/api/crawl/status/:jobId', async (req, res) => {
  try {
    const response = await crawlerClient.get(`/api/crawl/status/${req.params.jobId}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleCrawlerError(error, res);
  }
});

// Get crawl history
app.get('/api/crawl/history', async (req, res) => {
  try {
    const response = await crawlerClient.get('/api/crawl/history', {
      params: req.query,
    });
    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleCrawlerError(error, res);
  }
});

// Get crawl statistics
app.get('/api/crawl/statistics', async (req, res) => {
  try {
    const response = await crawlerClient.get('/api/crawl/statistics');
    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleCrawlerError(error, res);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Dashboard Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
