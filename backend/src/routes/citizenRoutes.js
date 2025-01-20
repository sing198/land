const express = require('express');
const router = express.Router();
const citizenController = require('../controllers/citizenController');
const { authenticate, requireRole, optionalAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createCitizenSchema, updateCitizenSchema } = require('../validations/citizenValidation');
const { ROLES } = require('../constants/roles');

router.get('/autocomplete', optionalAuth, citizenController.autocompleteSearch);
router.get('/', optionalAuth, citizenController.getCitizens);
router.get('/:id_card', optionalAuth, citizenController.getCitizenDetail);
router.post('/', authenticate, requireRole([ROLES.LAND_REFORM_OFFICER, ROLES.ADMIN]), validate(createCitizenSchema), citizenController.createCitizen);
router.put('/:id_card', authenticate, requireRole([ROLES.LAND_REFORM_OFFICER, ROLES.ADMIN]), validate(updateCitizenSchema), citizenController.updateCitizen);
router.delete('/:id_card', authenticate, requireRole([ROLES.ADMIN]), citizenController.deleteCitizen);

module.exports = router;
