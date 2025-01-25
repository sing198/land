const { query, transaction } = require('../config/database');

const heirRepository = {
  async findByCitizenId(citizenId) {
    const sql = `
      SELECT 
        h.heir_id,
        h.first_name,
        h.last_name,
        h.phone_number,
        h.id_card as heir_id_card,
        p.prefix_name,
        r.relation_id,
        r.relation_name,
        ch.created_at as linked_at
      FROM citizen_heirs ch
      JOIN heirs h ON ch.heir_id = h.heir_id
      LEFT JOIN prefixes p ON h.prefix_id = p.prefix_id
      LEFT JOIN relationships r ON ch.relationship_id = r.relation_id
      WHERE ch.citizen_id = ?
      ORDER BY ch.created_at ASC
    `;
    return await query(sql, [citizenId]);
  },

  async createHeirWithRelationship(data) {
    return await transaction(async (conn) => {
      // 1. Insert Heir
      const insertHeirSql = `
        INSERT INTO heirs (prefix_id, first_name, last_name, phone_number, id_card)
        VALUES (?, ?, ?, ?, ?)
      `;
      const heirResult = await conn.query(insertHeirSql, [
        data.prefix_id,
        data.first_name,
        data.last_name,
        data.phone_number || null,
        data.id_card || null
      ]);
      const heirId = heirResult.insertId;

      // 2. Link Citizen and Heir
      const linkSql = `
        INSERT INTO citizen_heirs (citizen_id, heir_id, relationship_id)
        VALUES (?, ?, ?)
      `;
      await conn.query(linkSql, [
        data.citizen_id,
        heirId,
        data.relationship_id
      ]);

      return { heirId };
    });
  },

  async removeRelationship(citizenId, heirId) {
    const sql = 'DELETE FROM citizen_heirs WHERE citizen_id = ? AND heir_id = ?';
    const result = await query(sql, [citizenId, heirId]);
    return result.affectedRows > 0;
  }
};

module.exports = heirRepository;
