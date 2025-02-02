const { query } = require('../config/database');

const dashboardRepository = {
  async getSummaryStats(soi = null) {
    let whereClause = 'WHERE active = 1';
    const params = [];

    if (soi !== null && soi !== '' && soi !== undefined) {
      whereClause += ' AND current_soi = ?';
      params.push(Number(soi));
    }

    // Land count, Total Area
    const landStatsSql = `
      SELECT 
        COUNT(*) as total_lands,
        SUM(total_rai) as total_rai,
        SUM(rai) as sum_rai,
        SUM(ngan) as sum_ngan,
        SUM(square_wa) as sum_square_wa
      FROM lands
      ${whereClause}
    `;
    const landStats = await query(landStatsSql, params);

    // Total Citizens
    const citizenStats = await query('SELECT COUNT(*) as total_citizens FROM citizens');

    // Total Heirs
    const heirStats = await query('SELECT COUNT(*) as total_heirs FROM heirs');

    return {
      totalLands: landStats[0]?.total_lands || 0,
      totalRai: landStats[0]?.total_rai || 0,
      totalCitizens: citizenStats[0]?.total_citizens || 0,
      totalHeirs: heirStats[0]?.total_heirs || 0,
    };
  },

  async getLandUseBreakdown(soi = null) {
    let whereClause = 'WHERE active = 1';
    const params = [];

    if (soi !== null && soi !== '' && soi !== undefined) {
      whereClause += ' AND current_soi = ?';
      params.push(Number(soi));
    }

    const sql = `
      SELECT 
        IFNULL(NULLIF(land_use_type, ''), 'อื่นๆ') as use_type,
        COUNT(*) as count,
        SUM(total_rai) as total_rai
      FROM lands
      ${whereClause}
      GROUP BY use_type
      ORDER BY count DESC
    `;
    return await query(sql, params);
  },

  async getSoiDistribution() {
    const sql = `
      SELECT 
        current_soi as soi,
        COUNT(*) as count,
        SUM(total_rai) as total_rai
      FROM lands
      WHERE active = 1
      GROUP BY current_soi
      ORDER BY current_soi ASC
    `;
    return await query(sql);
  },

  async getStatusDistribution() {
    const sql = `
      SELECT 
        ls.land_status_name,
        COUNT(l.id_land) as count
      FROM land_statuses ls
      LEFT JOIN lands l ON ls.id_land_status = l.current_land_status AND l.active = 1
      GROUP BY ls.id_land_status, ls.land_status_name
      ORDER BY ls.id_land_status ASC
    `;
    return await query(sql);
  }
};

module.exports = dashboardRepository;
