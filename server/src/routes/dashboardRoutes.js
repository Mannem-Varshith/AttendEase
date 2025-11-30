const express = require('express');
const router = express.Router();
const { getEmployeeStats, getManagerStats } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/employee', protect, getEmployeeStats);
router.get('/manager', protect, admin, getManagerStats);

module.exports = router;
