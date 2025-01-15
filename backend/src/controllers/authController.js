const authService = require('../services/authService');
const { successResponse } = require('../utils/apiResponse');

const authController = {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      return successResponse(res, result, 'เข้าสู่ระบบสำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return successResponse(res, result, 'ลงทะเบียนผู้ใช้งานสำเร็จ', 201);
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return successResponse(res, user, 'ดึงข้อมูลผู้ใช้สำเร็จ');
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      return successResponse(res, null, 'ออกจากระบบเรียบร้อยแล้ว');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
