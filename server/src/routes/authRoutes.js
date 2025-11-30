const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, createEmployeeByManager, changePassword } = require('../controllers/authController');
const { protect, isManager } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Manager-only route to create employee accounts
router.post('/create-employee', protect, isManager, createEmployeeByManager);

// Change password route (for all authenticated users)
router.put('/change-password', protect, changePassword);

module.exports = router;


