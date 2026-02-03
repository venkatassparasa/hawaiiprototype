import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

let pool: Pool;

export const connectDatabase = async (): Promise<void> => {
  try {
    const postgresUri = process.env.POSTGRES_URI || 'postgresql://temporal:temporal@localhost:5432/temporal';
    
    pool = new Pool({
      connectionString: postgresUri,
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
    });

    // Test the connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('Connected to PostgreSQL successfully');

    // Handle pool events
    pool.on('error', (err) => {
      logger.error('PostgreSQL pool error:', err);
    });

    pool.on('connect', (client) => {
      logger.debug('New PostgreSQL client connected');
    });

    pool.on('remove', (client) => {
      logger.debug('PostgreSQL client removed');
    });

  } catch (error) {
    logger.error('Failed to connect to PostgreSQL:', error);
    // Don't exit process, just log the error and continue
    logger.warn('Continuing without PostgreSQL connection...');
  }
};

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDatabase() first.');
  }
  return pool;
};

export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.error('Query execution failed', { text, error });
    throw error;
  }
};

export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (pool) {
      await pool.end();
      logger.info('Disconnected from PostgreSQL');
    }
  } catch (error) {
    logger.error('Error disconnecting from PostgreSQL:', error);
  }
};

// Helper function to create tables if they don't exist
export const createTables = async (): Promise<void> => {
  try {
    const client = await getClient();
    
    // Create properties table
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        property_id VARCHAR(255) UNIQUE NOT NULL,
        address TEXT NOT NULL,
        zoning_code VARCHAR(50),
        max_occupancy INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create violations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS violations (
        id SERIAL PRIMARY KEY,
        violation_id VARCHAR(255) UNIQUE NOT NULL,
        property_id VARCHAR(255) REFERENCES properties(property_id),
        violation_type VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create crawl_jobs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS crawl_jobs (
        id SERIAL PRIMARY KEY,
        job_id VARCHAR(255) UNIQUE NOT NULL,
        platform VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'running',
        locations TEXT[],
        max_listings INTEGER,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        statistics JSONB
      )
    `);

    client.release();
    logger.info('Database tables created or verified successfully');
  } catch (error) {
    logger.error('Failed to create database tables:', error);
    throw error;
  }
};
