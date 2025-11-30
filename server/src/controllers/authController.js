const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, employeeId, department, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
        employeeId,
        department,
        role: role || 'employee',
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            department: user.department,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    const user = await User.findOne({ email });

    if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await user.matchPassword(password);
    console.log('Password match:', isPasswordMatch);

    if (user && isPasswordMatch) {
        console.log('Login successful for:', email);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            department: user.department,
            token: generateToken(user._id),
        });
    } else {
        console.log('Login failed for:', email);
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            department: user.department,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Create employee account (Manager only)
// @route   POST /api/auth/create-employee
// @access  Private/Manager
const createEmployeeByManager = async (req, res) => {
    const { name, email, password, employeeId, department } = req.body;

    // Validate required fields
    if (!name || !email || !password || !employeeId || !department) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if employee ID already exists
    const employeeIdExists = await User.findOne({ employeeId });
    if (employeeIdExists) {
        return res.status(400).json({ message: 'Employee ID already in use' });
    }

    try {
        // Create employee account (always with role='employee')
        const employee = await User.create({
            name,
            email,
            password,
            employeeId,
            department,
            role: 'employee', // Always create as employee, not manager
        });

        if (employee) {
            res.status(201).json({
                success: true,
                message: 'Employee account created successfully',
                employee: {
                    _id: employee._id,
                    name: employee.name,
                    email: employee.email,
                    employeeId: employee.employeeId,
                    department: employee.department,
                    role: employee.role,
                },
            });
        } else {
            res.status(400).json({ message: 'Failed to create employee account' });
        }
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Server error while creating employee' });
    }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    try {
        // Get user with password
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isCurrentPasswordCorrect = await user.matchPassword(currentPassword);
        if (!isCurrentPasswordCorrect) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Check if new password is same as current
        const isSamePassword = await user.matchPassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({ message: 'New password must be different from current password' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error while changing password' });
    }
};

module.exports = { registerUser, loginUser, getMe, createEmployeeByManager, changePassword };


