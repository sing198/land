const path = require('path');
const fs = require('fs');
const commonRepository = require('../repositories/commonRepository');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const fileController = {
  async uploadLandDocument(req, res, next) {
    try {
      const { id_land, category = 'land_title' } = req.body;
      if (!id_land) {
        return errorResponse(res, 'กรุณาระบุรหัสแปลงที่ดิน (id_land is required)', 400);
      }
      if (!req.file) {
        return errorResponse(res, 'ไม่พบไฟล์ที่ต้องการอัปโหลด', 400);
      }

      const relativePath = path.relative(path.resolve(__dirname, '../../'), req.file.path);
      const docData = {
        id_land: parseInt(id_land, 10),
        file_name: req.file.filename,
        original_name: req.file.originalname,
        file_path: relativePath.replace(/\\/g, '/'),
        file_type: req.file.mimetype,
        file_size: req.file.size,
        category
      };

      const insertId = await commonRepository.addLandDocument(docData);
      return successResponse(res, { id: insertId, ...docData }, 'อัปโหลดเอกสารสำเร็จ', 201);
    } catch (error) {
      next(error);
    }
  },

  async deleteDocument(req, res, next) {
    try {
      const { id } = req.params;
      const deletedDoc = await commonRepository.deleteLandDocument(id);
      if (!deletedDoc) {
        return errorResponse(res, 'ไม่พบเอกสารที่ต้องการลบ', 404);
      }

      // Delete physical file from disk
      const fullPath = path.resolve(__dirname, '../../', deletedDoc.file_path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      return successResponse(res, null, 'ลบเอกสารเรียบร้อยแล้ว');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = fileController;
