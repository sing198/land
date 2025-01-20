const landService = require('../services/landService');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

const landController = {
  async getLands(req, res, next) {
    try {
      const { search, soi, status, page = 1, limit = 10 } = req.query;
      const { items, total } = await landService.getLands({
        search,
        soi,
        status,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });
      return paginatedResponse(res, items, { total, page: parseInt(page, 10), limit: parseInt(limit, 10) }, 'ดึงข้อมูลแปลงที่ดินสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async getLandDetail(req, res, next) {
    try {
      const { id } = req.params;
      const data = await landService.getLandDetail(id);
      return successResponse(res, data, 'ดึงรายละเอียดแปลงที่ดินสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async publicSearch(req, res, next) {
    try {
      const { q } = req.query;
      if (!q || !q.trim()) {
        return res.status(400).json({ success: false, message: 'กรุณาระบุคำค้นหา (Query parameter "q" is required)' });
      }
      const data = await landService.searchPublicLand(q.trim());
      return successResponse(res, data, 'ค้นหาแปลงที่ดินสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async createLand(req, res, next) {
    try {
      const newLand = await landService.createLand(req.body);
      return successResponse(res, newLand, 'บันทึกข้อมูลแปลงที่ดินสำเร็จ', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateLand(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await landService.updateLand(id, req.body);
      return successResponse(res, updated, 'แก้ไขข้อมูลแปลงที่ดินสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async deleteLand(req, res, next) {
    try {
      const { id } = req.params;
      await landService.deleteLand(id);
      return successResponse(res, null, 'ลบข้อมูลแปลงที่ดินสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async getMapPolygons(req, res, next) {
    try {
      const data = await landService.getMapLayers();
      return successResponse(res, data, 'ดึงข้อมูลพิกัดแปลงที่ดินสำหรับแผนที่สำเร็จ');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = landController;
