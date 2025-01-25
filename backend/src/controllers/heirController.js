const heirService = require('../services/heirService');
const { successResponse } = require('../utils/apiResponse');

const heirController = {
  async getHeirsByCitizen(req, res, next) {
    try {
      const { citizen_id } = req.params;
      const heirs = await heirService.getHeirsByCitizen(citizen_id);
      return successResponse(res, heirs, 'ดึงรายชื่อทายาทสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async createHeir(req, res, next) {
    try {
      const result = await heirService.createHeir(req.body);
      return successResponse(res, result, 'เพิ่มข้อมูลทายาทและผูกความสัมพันธ์สำเร็จ', 201);
    } catch (error) {
      next(error);
    }
  },

  async removeRelationship(req, res, next) {
    try {
      const { citizen_id, heir_id } = req.params;
      await heirService.removeRelationship(citizen_id, parseInt(heir_id, 10));
      return successResponse(res, null, 'ลบความสัมพันธ์ทายาทสำเร็จ');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = heirController;
