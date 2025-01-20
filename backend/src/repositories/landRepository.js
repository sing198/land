const { query } = require('../config/database');

const landRepository = {
  async findAll({ search = '', soi = null, status = null, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const params = [];
    const countParams = [];

    let whereClause = 'WHERE l.active = 1';

    if (search) {
      whereClause += ' AND (l.tf_number LIKE ? OR l.spk_area LIKE ? OR c.first_name LIKE ? OR c.last_name LIKE ? OR c.id_card LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (soi !== null && soi !== '' && soi !== undefined) {
      whereClause += ' AND l.current_soi = ?';
      params.push(Number(soi));
      countParams.push(Number(soi));
    }

    if (status) {
      whereClause += ' AND l.current_land_status = ?';
      params.push(Number(status));
      countParams.push(Number(status));
    }

    // Get Total Count
    const countSql = `
      SELECT COUNT(*) as total
      FROM lands l
      LEFT JOIN citizens c ON l.id_card = c.id_card
      ${whereClause}
    `;
    const countResult = await query(countSql, countParams);
    const total = countResult[0]?.total || 0;

    // Get Paginated Data
    const sql = `
      SELECT 
        l.*,
        ls.land_status_name,
        c.first_name,
        c.last_name,
        c.phone_number,
        p.prefix_name
      FROM lands l
      LEFT JOIN land_statuses ls ON l.current_land_status = ls.id_land_status
      LEFT JOIN citizens c ON l.id_card = c.id_card
      LEFT JOIN prefixes p ON c.prefix_id = p.prefix_id
      ${whereClause}
      ORDER BY l.id_land DESC
      LIMIT ? OFFSET ?
    `;
    params.push(Number(limit), Number(offset));
    const items = await query(sql, params);

    return { items, total };
  },

  async findById(id) {
    const sql = `
      SELECT 
        l.*,
        ls.land_status_name,
        c.first_name,
        c.last_name,
        c.phone_number,
        c.birthday,
        c.gender,
        c.house_number as c_house_number,
        c.village_number as c_village_number,
        c.subdistrict as c_subdistrict,
        c.district as c_district,
        p.prefix_name
      FROM lands l
      LEFT JOIN land_statuses ls ON l.current_land_status = ls.id_land_status
      LEFT JOIN citizens c ON l.id_card = c.id_card
      LEFT JOIN prefixes p ON c.prefix_id = p.prefix_id
      WHERE l.id_land = ? AND l.active = 1
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  },

  async findByTfNumber(tfNumber) {
    const sql = `
      SELECT 
        l.*,
        ls.land_status_name,
        c.first_name,
        c.last_name,
        c.phone_number,
        p.prefix_name
      FROM lands l
      LEFT JOIN land_statuses ls ON l.current_land_status = ls.id_land_status
      LEFT JOIN citizens c ON l.id_card = c.id_card
      LEFT JOIN prefixes p ON c.prefix_id = p.prefix_id
      WHERE l.tf_number = ? AND l.active = 1
      LIMIT 1
    `;
    const rows = await query(sql, [tfNumber]);
    return rows[0] || null;
  },

  async create(data) {
    const sql = `
      INSERT INTO lands (
        tf_number, spk_area, number, volume, l_house_number, current_soi,
        rai, ngan, square_wa, l_subdistrict, l_district, l_village_number,
        land_use_type, notation, current_land_status, id_card, lat, lng,
        coordinates_polygon, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      data.tf_number,
      data.spk_area,
      data.number || null,
      data.volume || null,
      data.l_house_number || null,
      data.current_soi || 0,
      data.rai || 0,
      data.ngan || 0,
      data.square_wa || 0,
      data.l_subdistrict || null,
      data.l_district || null,
      data.l_village_number || null,
      data.land_use_type || 'ยางพารา',
      data.notation || null,
      data.current_land_status,
      data.id_card || null,
      data.lat || null,
      data.lng || null,
      data.coordinates_polygon || null,
      data.active !== undefined ? data.active : 1
    ]);
    return result.insertId;
  },

  async update(id, data) {
    const fields = [];
    const params = [];

    const allowedKeys = [
      'tf_number', 'spk_area', 'number', 'volume', 'l_house_number',
      'current_soi', 'rai', 'ngan', 'square_wa', 'l_subdistrict',
      'l_district', 'l_village_number', 'land_use_type', 'notation',
      'current_land_status', 'id_card', 'lat', 'lng', 'coordinates_polygon', 'active'
    ];

    for (const key of allowedKeys) {
      if (data[key] !== undefined) {
        fields.push(`\`${key}\` = ?`);
        params.push(data[key]);
      }
    }

    if (fields.length === 0) return false;

    params.push(id);
    const sql = `UPDATE lands SET ${fields.join(', ')} WHERE id_land = ?`;
    const result = await query(sql, params);
    return result.affectedRows > 0;
  },

  async delete(id) {
    // Soft delete
    const sql = 'UPDATE lands SET active = 0 WHERE id_land = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  },

  async getMapPolygons() {
    const sql = `
      SELECT 
        l.id_land,
        l.tf_number,
        l.spk_area,
        l.current_soi,
        l.total_rai,
        l.land_use_type,
        l.lat,
        l.lng,
        l.coordinates_polygon,
        ls.land_status_name,
        CONCAT(IFNULL(p.prefix_name, ''), ' ', IFNULL(c.first_name, ''), ' ', IFNULL(c.last_name, '')) as owner_name
      FROM lands l
      LEFT JOIN land_statuses ls ON l.current_land_status = ls.id_land_status
      LEFT JOIN citizens c ON l.id_card = c.id_card
      LEFT JOIN prefixes p ON c.prefix_id = p.prefix_id
      WHERE l.active = 1 AND (l.coordinates_polygon IS NOT NULL OR (l.lat IS NOT NULL AND l.lng IS NOT NULL))
    `;
    return await query(sql);
  }
};

module.exports = landRepository;
