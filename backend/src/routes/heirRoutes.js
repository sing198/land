const express = require('express');
const router = express.Router();
const heirController = require('../controllers/heirController');
const { authenticate, requireRole, optionalAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createHeirSchema } = require('../validations/heirValidation');
const { ROLES } = require('../constants/roles');

router.get('/citizen/:citizen_id', optionalAuth, heirController.getHeirsByCitizen);
router.post('/', authenticate, requireRole([ROLES.LAND_REFORM_OFFICER, ROLES.ADMIN]), validate(createHeirSchema), heirController.createHeir);
router.delete('/citizen/:citizen_id/heir/:heir_id', authenticate, requireRole([ROLES.LAND_REFORM_OFFICER, ROLES.ADMIN]), heirController.removeRelationship);

module.exports = router;
