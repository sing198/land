const express = require('express');
const router = express.Router();
const landController = require('../controllers/landController');
const { authenticate, requireRole, optionalAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createLandSchema, updateLandSchema } = require('../validations/landValidation');
const { ROLES } = require('../constants/roles');

// Public search for citizens
router.get('/public-search', landController.publicSearch);

// Map GIS layer
router.get('/map-polygons', optionalAuth, landController.getMapPolygons);

// CRUD routes for Officers & Admins
router.get('/', optionalAuth, landController.getLands);
router.get('/:id', optionalAuth, landController.getLandDetail);
router.post('/', authenticate, requireRole([ROLES.LAND_REFORM_OFFICER, ROLES.ADMIN]), validate(createLandSchema), landController.createLand);
router.put('/:id', authenticate, requireRole([ROLES.LAND_REFORM_OFFICER, ROLES.ADMIN]), validate(updateLandSchema), landController.updateLand);
router.delete('/:id', authenticate, requireRole([ROLES.ADMIN]), landController.deleteLand);

module.exports = router;
