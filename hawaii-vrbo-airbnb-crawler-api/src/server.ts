import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

import { connectDatabase, createTables } from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

// Route imports
import crawlRoutes from './routes/crawl';
import violationRoutes from './routes/violations';
import propertyRoutes from './routes/properties';
import evidenceRoutes from './routes/evidence';
import webhookRoutes from './routes/webhooks';
import healthRoutes from './routes/health';
import temporalRoutes from './routes/temporal';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Basic middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hawaii Vacation Rental Violation Detection API',
      version: '1.0.0',
      description: 'API for crawling Airbnb and VRBO to detect TVR violations in Hawaii County',
      contact: {
        name: 'Hawaii County Government',
        email: 'support@hawaiicounty.gov',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check endpoint
app.use('/health', healthRoutes);

// API routes
app.use('/api/crawl', crawlRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/temporal', temporalRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hawaii Vacation Rental Violation Detection API',
    version: '1.0.0',
    documentation: '/docs',
    health: '/health',
    endpoints: {
      crawl: '/api/crawl',
      violations: '/api/violations',
      properties: '/api/properties',
      evidence: '/api/evidence',
    },
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Connected to PostgreSQL database');
    
    // Create tables if they don't exist (skip if connection failed)
    try {
      await createTables();
      logger.info('Database tables verified');
    } catch (error) {
      logger.warn('Could not create database tables, continuing anyway:', error);
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Documentation available at http://localhost:${PORT}/docs`);
      logger.info(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

export default app;
