const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { errorResponse } = require('../utils/apiResponse');
const { ROLES } = require('../constants/roles');

/**
 * Verify JWT Token Middleware
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'กรุณาเข้าสู่ระบบก่อนทำรายการ (Token is missing)', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง', 401);
    }
    return errorResponse(res, 'Token ไม่ถูกต้องหรือไม่ปลอดภัย', 401);
  }
}

/**
 * Require Specific Role(s) Middleware
 * @param {Array<number>|number} allowedRoles
 */
function requireRole(allowedRoles) {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'กรุณาเข้าสู่ระบบก่อนทำรายการ', 401);
    }

    // Admin (role 3) always has access to all routes
    if (req.user.role_id === ROLES.ADMIN || rolesArray.includes(req.user.role_id)) {
      return next();
    }

    return errorResponse(res, 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ (Access Forbidden)', 403);
  };
}

/**
 * Optional Authentication (attach user if token exists, but don't block)
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, env.JWT.SECRET);
    } catch (e) {
      req.user = null;
    }
  }
  next();
}

module.exports = {
  authenticate,
  requireRole,
  optionalAuth
};
