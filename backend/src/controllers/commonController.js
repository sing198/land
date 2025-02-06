const commonRepository = require('../repositories/commonRepository');
const { successResponse } = require('../utils/apiResponse');

const commonController = {
  async getMasterData(req, res, next) {
    try {
      const [prefixes, relationships, landStatuses, alleys] = await Promise.all([
        commonRepository.getPrefixes(),
        commonRepository.getRelationships(),
        commonRepository.getLandStatuses(),
        commonRepository.getAlleys()
      ]);

      return successResponse(res, {
        prefixes,
        relationships,
        landStatuses,
        alleys
      }, 'ดึงข้อมูล Master Data สำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async getPrefixes(req, res, next) {
    try {
      const prefixes = await commonRepository.getPrefixes();
      return successResponse(res, prefixes, 'ดึงรายการคำนำหน้าชื่อสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async getRelationships(req, res, next) {
    try {
      const relationships = await commonRepository.getRelationships();
      return successResponse(res, relationships, 'ดึงรายการความสัมพันธ์สำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async getLandStatuses(req, res, next) {
    try {
      const landStatuses = await commonRepository.getLandStatuses();
      return successResponse(res, landStatuses, 'ดึงรายการสถานะที่ดินสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async getAlleys(req, res, next) {
    try {
      const alleys = await commonRepository.getAlleys();
      return successResponse(res, alleys, 'ดึงรายการซอยสำเร็จ');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = commonController;
