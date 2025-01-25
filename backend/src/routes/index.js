const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const landRoutes = require('./landRoutes');
const citizenRoutes = require('./citizenRoutes');
const heirRoutes = require('./heirRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const fileRoutes = require('./fileRoutes');
const commonRoutes = require('./commonRoutes');

// API Version 1
router.use('/auth', authRoutes);
router.use('/lands', landRoutes);
router.use('/citizens', citizenRoutes);
router.use('/heirs', heirRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/files', fileRoutes);
router.use('/common', commonRoutes);

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'ALRO Land Management System API v2'
  });
});

module.exports = router;
