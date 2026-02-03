const { Pool } = require('pg');

// Your actual Neon connection string
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_3KtIryBcGfl4@ep-summer-pine-a1fyy3cf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

async function setupTables() {
  try {
    const client = await pool.connect();
    
    console.log('🗄️  Creating tables in Neon PostgreSQL...');
    
    // Create properties table
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        property_id VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(500),
        description TEXT,
        location VARCHAR(255),
        price DECIMAL(10,2),
        bedrooms INTEGER,
        bathrooms INTEGER,
        max_guests INTEGER,
        property_type VARCHAR(100),
        zoning_code VARCHAR(50),
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
        violation_type VARCHAR(100),
        severity VARCHAR(50),
        description TEXT,
        status VARCHAR(50) DEFAULT 'open',
        reported_date DATE,
        resolved_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create crawl_jobs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS crawl_jobs (
        id SERIAL PRIMARY KEY,
        job_id VARCHAR(255) UNIQUE NOT NULL,
        platform VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        locations TEXT[],
        max_listings INTEGER DEFAULT 1000,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        properties_found INTEGER DEFAULT 0,
        violations_found INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create workflow_executions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS workflow_executions (
        id SERIAL PRIMARY KEY,
        workflow_id VARCHAR(255) UNIQUE NOT NULL,
        workflow_type VARCHAR(100),
        status VARCHAR(50),
        input_data JSONB,
        result_data JSONB,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        assignee VARCHAR(255),
        priority VARCHAR(50) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ All tables created successfully!');
    
    // Test the tables
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Available tables:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    client.release();
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  } finally {
    await pool.end();
  }
}

setupTables();
