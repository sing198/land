const { query } = require('../config/database');

const commonRepository = {
  async getPrefixes() {
    return await query('SELECT prefix_id as value, prefix_name as label FROM prefixes ORDER BY prefix_id ASC');
  },

  async getRelationships() {
    return await query('SELECT relation_id as value, relation_name as label FROM relationships ORDER BY relation_id ASC');
  },

  async getLandStatuses() {
    return await query('SELECT id_land_status as value, land_status_name as label FROM land_statuses ORDER BY id_land_status ASC');
  },

  async getAlleys() {
    return await query('SELECT alley_number as value, alley_name as label FROM alleys ORDER BY alley_number ASC');
  },

  async getFilesByLandId(landId) {
    const sql = `SELECT * FROM land_documents WHERE id_land = ? ORDER BY created_at DESC`;
    return await query(sql, [landId]);
  },

  async addLandDocument(docData) {
    const sql = `
      INSERT INTO land_documents (id_land, file_name, original_name, file_path, file_type, file_size, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      docData.id_land,
      docData.file_name,
      docData.original_name,
      docData.file_path,
      docData.file_type || null,
      docData.file_size || null,
      docData.category || 'land_title'
    ]);
    return result.insertId;
  },

  async deleteLandDocument(fileId) {
    const sql = 'SELECT * FROM land_documents WHERE id = ? LIMIT 1';
    const rows = await query(sql, [fileId]);
    if (!rows[0]) return null;

    await query('DELETE FROM land_documents WHERE id = ?', [fileId]);
    return rows[0];
  }
};

module.exports = commonRepository;
