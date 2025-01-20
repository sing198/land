const { query } = require('../config/database');

const citizenRepository = {
  async findAll({ search = '', page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const params = [];
    const countParams = [];

    let whereClause = 'WHERE 1=1';

    if (search) {
      whereClause += ' AND (c.first_name LIKE ? OR c.last_name LIKE ? OR c.id_card LIKE ? OR c.phone_number LIKE ?)';
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, pattern);
      countParams.push(pattern, pattern, pattern, pattern);
    }

    const countSql = `SELECT COUNT(*) as total FROM citizens c ${whereClause}`;
    const countResult = await query(countSql, countParams);
    const total = countResult[0]?.total || 0;

    const sql = `
      SELECT 
        c.*,
        p.prefix_name,
        (SELECT COUNT(*) FROM lands l WHERE l.id_card = c.id_card AND l.active = 1) as total_lands,
        (SELECT COUNT(*) FROM citizen_heirs ch WHERE ch.citizen_id = c.id_card) as total_heirs
      FROM citizens c
      LEFT JOIN prefixes p ON c.prefix_id = p.prefix_id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;
    params.push(Number(limit), Number(offset));
    const items = await query(sql, params);

    return { items, total };
  },

  async findByIdCard(idCard) {
    const sql = `
      SELECT 
        c.*,
        p.prefix_name
      FROM citizens c
      LEFT JOIN prefixes p ON c.prefix_id = p.prefix_id
      WHERE c.id_card = ?
      LIMIT 1
    `;
    const rows = await query(sql, [idCard]);
    return rows[0] || null;
  },

  async searchAutocomplete(keyword, limit = 10) {
    const sql = `
      SELECT 
        c.id_card,
        c.first_name,
        c.last_name,
        p.prefix_name,
        CONCAT(IFNULL(p.prefix_name, ''), ' ', c.first_name, ' ', c.last_name, ' (', c.id_card, ')') as label
      FROM citizens c
      LEFT JOIN prefixes p ON c.prefix_id = p.prefix_id
      WHERE c.first_name LIKE ? OR c.last_name LIKE ? OR c.id_card LIKE ?
      LIMIT ?
    `;
    const pattern = `%${keyword}%`;
    return await query(sql, [pattern, pattern, pattern, Number(limit)]);
  },

  async create(data) {
    const sql = `
      INSERT INTO citizens (
        id_card, prefix_id, first_name, last_name, birthday, gender,
        house_number, village_number, subdistrict, district, province,
        soi, phone_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await query(sql, [
      data.id_card,
      data.prefix_id,
      data.first_name,
      data.last_name,
      data.birthday || null,
      data.gender || 'male',
      data.house_number || null,
      data.village_number || null,
      data.subdistrict || null,
      data.district || null,
      data.province || 'นครศรีธรรมราช',
      data.soi || 0,
      data.phone_number || null
    ]);
    return data.id_card;
  },

  async update(idCard, data) {
    const fields = [];
    const params = [];

    const allowedKeys = [
      'prefix_id', 'first_name', 'last_name', 'birthday', 'gender',
      'house_number', 'village_number', 'subdistrict', 'district',
      'province', 'soi', 'phone_number'
    ];

    for (const key of allowedKeys) {
      if (data[key] !== undefined) {
        fields.push(`\`${key}\` = ?`);
        params.push(data[key]);
      }
    }

    if (fields.length === 0) return false;

    params.push(idCard);
    const sql = `UPDATE citizens SET ${fields.join(', ')} WHERE id_card = ?`;
    const result = await query(sql, params);
    return result.affectedRows > 0;
  },

  async delete(idCard) {
    const sql = 'DELETE FROM citizens WHERE id_card = ?';
    const result = await query(sql, [idCard]);
    return result.affectedRows > 0;
  }
};

module.exports = citizenRepository;
