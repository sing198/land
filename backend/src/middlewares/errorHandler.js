const { errorResponse } = require('../utils/apiResponse');

/**
 * Centralized Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method
  });

  // Handle Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'ขนาดไฟล์ใหญ่เกินกว่าที่กำหนด (สูงสุด 10MB)', 400);
    }
    return errorResponse(res, `ข้อผิดพลาดในการอัปโหลดไฟล์: ${err.message}`, 400);
  }

  // Handle Syntax/JSON parse error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, 'รูปแบบข้อมูล JSON ที่ส่งมาไม่ถูกต้อง (Malformed JSON)', 400);
  }

  // Default Error Response
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง';
  
  return errorResponse(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
}

module.exports = errorHandler;
