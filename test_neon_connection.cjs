const { Pool } = require('pg');

// Test Neon connection with your actual credentials
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_3KtIryBcGfl4@ep-summer-pine-a1fyy3cf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    client.release();
    
    console.log('✅ Neon PostgreSQL connection successful!');
    console.log('Current Time:', result.rows[0].current_time);
    console.log('PostgreSQL Version:', result.rows[0].postgres_version);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
