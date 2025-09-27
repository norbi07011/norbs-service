import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;

// Load environment variables
dotenv.config();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'norbs_service',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT) || 5432,
  
  // Connection pool settings
  max: parseInt(process.env.DB_POOL_MAX) || 20, // Maximum number of clients in the pool
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000, // Return an error after 2 seconds if connection could not be established
  
  // SSL configuration
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Event handlers for the pool
pool.on('connect', (client) => {
  console.log('🔗 New database client connected');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
  process.exit(1);
});

pool.on('remove', (client) => {
  console.log('🔌 Database client removed from pool');
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful at:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('🔄 Backend will continue in mock mode without database');
    return false;
  }
};

// Initialize connection test (non-blocking)
testConnection().catch(() => {
  console.log('⚠️  Database not available - backend will use mock data mode');
});

export default pool;