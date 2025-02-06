const mariadb = require('mariadb');
const env = require('./env');

// Create MariaDB Connection Pool
const pool = mariadb.createPool({
  host: env.DB.HOST,
  port: env.DB.PORT,
  user: env.DB.USER,
  password: env.DB.PASSWORD,
  database: env.DB.NAME,
  connectionLimit: env.DB.CONNECTION_LIMIT,
  ssl: env.DB.SSL ? { rejectUnauthorized: false } : undefined,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  bigIntAsNumber: true,
  insertIdAsNumber: true,
  decimalAsNumber: true,
});

/**
 * Execute a parameterized query
 * @param {string} sql
 * @param {Array} params
 * @returns {Promise<Array|Object>}
 */
async function query(sql, params = []) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } catch (error) {
    console.error('Database Query Error:', error.message, '\nSQL:', sql);
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

/**
 * Execute multiple queries inside a single database transaction
 * @param {Function} callback (conn) => Promise<any>
 * @returns {Promise<any>}
 */
async function transaction(callback) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (error) {
    if (conn) await conn.rollback();
    console.error('Database Transaction Error:', error.message);
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

/**
 * Health check connection to database
 */
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT 1 as is_alive');
    console.log('✅ MariaDB Database connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MariaDB Database:', error.message);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = {
  pool,
  query,
  transaction,
  testConnection
};
