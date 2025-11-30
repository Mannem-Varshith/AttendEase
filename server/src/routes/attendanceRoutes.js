const express = require('express');
const router = express.Router();
const {
    checkIn,
    checkOut,
    getMyHistory,
    getMySummary,
    getTodayStatus,
    getAllAttendance,
    getTeamSummary,
    exportAttendance,
    getTodayStatusForManager,
} = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my-history', protect, getMyHistory);
router.get('/my-summary', protect, getMySummary);
router.get('/today', protect, getTodayStatus);

// Manager routes
router.get('/all', protect, admin, getAllAttendance);
router.get('/summary', protect, admin, getTeamSummary);
router.get('/export', protect, admin, exportAttendance);
router.get('/today-status', protect, admin, getTodayStatusForManager);

module.exports = router;
