const citizenService = require('../services/citizenService');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

const citizenController = {
  async getCitizens(req, res, next) {
    try {
      const { search, page = 1, limit = 10 } = req.query;
      const { items, total } = await citizenService.getCitizens({
        search,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });
      return paginatedResponse(res, items, { total, page: parseInt(page, 10), limit: parseInt(limit, 10) }, 'ดึงข้อมูลราษฎรสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async getCitizenDetail(req, res, next) {
    try {
      const { id_card } = req.params;
      const data = await citizenService.getCitizenDetail(id_card);
      return successResponse(res, data, 'ดึงรายละเอียดราษฎรสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async autocompleteSearch(req, res, next) {
    try {
      const { q } = req.query;
      const results = await citizenService.searchCitizens(q || '');
      return successResponse(res, results, 'ค้นหารายชื่อราษฎรสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async createCitizen(req, res, next) {
    try {
      const newCitizen = await citizenService.createCitizen(req.body);
      return successResponse(res, newCitizen, 'บันทึกข้อมูลราษฎรสำเร็จ', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateCitizen(req, res, next) {
    try {
      const { id_card } = req.params;
      const updated = await citizenService.updateCitizen(id_card, req.body);
      return successResponse(res, updated, 'แก้ไขข้อมูลราษฎรสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async deleteCitizen(req, res, next) {
    try {
      const { id_card } = req.params;
      await citizenService.deleteCitizen(id_card);
      return successResponse(res, null, 'ลบข้อมูลราษฎรสำเร็จ');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = citizenController;
