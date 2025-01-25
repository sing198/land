const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middlewares/upload');
const { authenticate, requireRole } = require('../middlewares/auth');
const { ROLES } = require('../constants/roles');

router.post('/upload', authenticate, requireRole([ROLES.LAND_REFORM_OFFICER, ROLES.ADMIN]), upload.single('file'), fileController.uploadLandDocument);
router.delete('/:id', authenticate, requireRole([ROLES.ADMIN]), fileController.deleteDocument);

module.exports = router;
