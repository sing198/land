const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');

router.get('/master-data', commonController.getMasterData);
router.get('/prefixes', commonController.getPrefixes);
router.get('/relationships', commonController.getRelationships);
router.get('/land-statuses', commonController.getLandStatuses);
router.get('/alleys', commonController.getAlleys);

module.exports = router;
