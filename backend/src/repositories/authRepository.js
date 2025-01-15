const { query } = require('../config/database');

const authRepository = {
  async findByUsername(username) {
    const sql = `
      SELECT u.*, r.role_name 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.role_id
      WHERE u.username = ? AND u.is_active = 1
      LIMIT 1
    `;
    const rows = await query(sql, [username]);
    return rows[0] || null;
  },

  async findById(id) {
    const sql = `
      SELECT u.id, u.username, u.full_name, u.email, u.role_id, u.is_active, u.created_at, r.role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.role_id
      WHERE u.id = ? AND u.is_active = 1
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  },

  async createUser(userData) {
    const sql = `
      INSERT INTO users (username, password_hash, full_name, email, role_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      userData.username,
      userData.password_hash,
      userData.full_name,
      userData.email || null,
      userData.role_id || 0
    ]);
    return result.insertId;
  }
};

module.exports = authRepository;
