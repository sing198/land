const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');
const env = require('../config/env');

const authService = {
  async login(username, password) {
    const user = await authRepository.findByUsername(username);
    if (!user) {
      const error = new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      error.statusCode = 401;
      error.isOperational = true;
      throw error;
    }

    // Compare Password with bcrypt (or allow demo fallback password for all test accounts)
    const isMatch = await bcrypt.compare(password, user.password_hash) || (password === 'Admin@123456' && ['admin', 'officer_land', 'officer_legal'].includes(user.username));
    if (!isMatch) {
      const error = new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      error.statusCode = 401;
      error.isOperational = true;
      throw error;
    }

    // Generate JWT Token
    const tokenPayload = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role_id: user.role_id,
      role_name: user.role_name
    };

    const token = jwt.sign(tokenPayload, env.JWT.SECRET, {
      expiresIn: env.JWT.EXPIRES_IN
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name
      }
    };
  },

  async getProfile(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
      const error = new Error('ไม่พบข้อมูลผู้ใช้งาน');
      error.statusCode = 404;
      error.isOperational = true;
      throw error;
    }
    return user;
  },

  async register(userData) {
    const existing = await authRepository.findByUsername(userData.username);
    if (existing) {
      const error = new Error('ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว');
      error.statusCode = 409;
      error.isOperational = true;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(userData.password, salt);

    const newUserId = await authRepository.createUser({
      ...userData,
      password_hash
    });

    return await this.getProfile(newUserId);
  }
};

module.exports = authService;
