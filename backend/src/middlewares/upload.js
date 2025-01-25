const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

// Ensure upload directory exists
const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subfolder = req.baseUrl.includes('land') ? 'lands' : 'general';
    const targetDir = path.join(uploadDir, subfolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File Filter for allowed types (images and PDFs)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WebP) และเอกสาร PDF เท่านั้น'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: env.UPLOAD.MAX_SIZE_MB * 1024 * 1024 // e.g. 10MB
  },
  fileFilter
});

module.exports = upload;
