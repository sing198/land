const dashboardService = require('../services/dashboardService');
const { successResponse } = require('../utils/apiResponse');

const dashboardController = {
  async getDashboard(req, res, next) {
    try {
      const { soi } = req.query;
      const data = await dashboardService.getDashboardData(soi);
      return successResponse(res, data, 'ดึงข้อมูลสถิติแดชบอร์ดสำเร็จ');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dashboardController;
