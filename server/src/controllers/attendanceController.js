const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { startOfDay, endOfDay, format } = require('date-fns');

// @desc    Check in for today
// @route   POST /api/attendance/checkin
// @access  Private (Employee)
const checkIn = async (req, res) => {
    const userId = req.user._id;
    const today = format(new Date(), 'yyyy-MM-dd');

    const existingAttendance = await Attendance.findOne({ userId, date: today });

    if (existingAttendance) {
        res.status(400).json({ message: 'Already checked in for today' });
        return;
    }

    const checkInTime = new Date();
    const checkInHour = checkInTime.getHours();
    const checkInMinutes = checkInTime.getMinutes();

    // Business Rule: Cannot check in after 1:00 PM (13:00)
    if (checkInHour >= 13) {
        res.status(400).json({
            message: 'Check-in not allowed after 1:00 PM. You will be marked as absent/on leave for today.'
        });
        return;
    }

    // Determine initial status
    let status = 'present';

    // If check-in is at or after 10:00 AM but before 1:00 PM, mark as late
    if (checkInHour >= 10) {
        status = 'late';
    }

    const attendance = await Attendance.create({
        userId,
        date: today,
        checkInTime,
        status,
    });

    res.status(201).json(attendance);
};

// @desc    Check out for today
// @route   POST /api/attendance/checkout
// @access  Private (Employee)
const checkOut = async (req, res) => {
    const userId = req.user._id;
    const today = format(new Date(), 'yyyy-MM-dd');

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) {
        res.status(400).json({ message: 'No check-in record found for today' });
        return;
    }

    if (attendance.checkOutTime) {
        res.status(400).json({ message: 'Already checked out for today' });
        return;
    }

    attendance.checkOutTime = new Date();

    // Calculate total hours
    const durationMs = attendance.checkOutTime - attendance.checkInTime;
    const hours = durationMs / (1000 * 60 * 60);
    attendance.totalHours = parseFloat(hours.toFixed(2));

    const checkOutHour = attendance.checkOutTime.getHours();

    // Business Rules for status:
    // 1. If total hours < 4, mark as leave (not enough working hours)
    if (attendance.totalHours < 4) {
        attendance.status = 'leave';
    }
    // 2. If checkout before 5:00 PM (17:00), mark as half-day
    else if (checkOutHour < 17) {
        attendance.status = 'half-day';
    }
    // 3. Otherwise, keep existing status (present or late based on check-in time)

    await attendance.save();

    res.json(attendance);
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history
// @access  Private (Employee)
const getMyHistory = async (req, res) => {
    const { month, year } = req.query;
    const userId = req.user._id;

    let query = { userId };

    if (month && year) {
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        // Simple string match for date prefix if we store date as YYYY-MM-DD string
        // Or we can use regex
        query.date = { $regex: `^${year}-${month.toString().padStart(2, '0')}` };
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });
    res.json(attendance);
};

// @desc    Get my monthly summary
// @route   GET /api/attendance/my-summary
// @access  Private (Employee)
const getMySummary = async (req, res) => {
    const { month, year } = req.query;
    const userId = req.user._id;

    const regex = `^${year}-${month.toString().padStart(2, '0')}`;
    const attendance = await Attendance.find({ userId, date: { $regex: regex } });

    const summary = {
        present: 0,
        absent: 0, // Note: Absent days are usually not created in DB unless we run a cron job. 
        // For now, we count records. Real absent count needs total working days calculation.
        late: 0,
        halfDay: 0,
        totalHours: 0,
    };

    attendance.forEach((record) => {
        if (record.status === 'present') summary.present++;
        if (record.status === 'late') summary.late++;
        if (record.status === 'half-day') summary.halfDay++;
        summary.totalHours += record.totalHours || 0;
    });

    // To calculate absent, we'd need to know how many working days passed.
    // For simplicity, we'll just return what we have.

    res.json(summary);
};

// @desc    Get today's status
// @route   GET /api/attendance/today
// @access  Private (Employee)
const getTodayStatus = async (req, res) => {
    const userId = req.user._id;
    const today = format(new Date(), 'yyyy-MM-dd');

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) {
        res.json({ status: 'not-checked-in' });
    } else if (attendance.checkOutTime) {
        res.json({ status: 'checked-out', data: attendance });
    } else {
        res.json({ status: 'checked-in', data: attendance });
    }
};

// @desc    Get all employees attendance (Manager)
// @route   GET /api/attendance/all
// @access  Private (Manager)
const getAllAttendance = async (req, res) => {
    const { date, employeeId } = req.query;
    let query = {};

    if (date) {
        query.date = date;
    }

    if (employeeId) {
        // Find user by employeeId first
        const user = await User.findOne({ employeeId });
        if (user) {
            query.userId = user._id;
        } else {
            // If user not found, return empty
            return res.json([]);
        }
    }

    const attendance = await Attendance.find(query)
        .populate('userId', 'name email employeeId department')
        .sort({ date: -1 });

    res.json(attendance);
};

// @desc    Get team attendance summary (Manager)
// @route   GET /api/attendance/summary
// @access  Private (Manager)
const getTeamSummary = async (req, res) => {
    const { from, to } = req.query;
    // Logic to aggregate attendance by date
    // This is a simplified version
    const query = {};
    if (from && to) {
        query.date = { $gte: from, $lte: to };
    }

    const attendance = await Attendance.find(query);

    // Group by date
    const summary = attendance.reduce((acc, curr) => {
        if (!acc[curr.date]) {
            acc[curr.date] = { present: 0, absent: 0, late: 0, halfDay: 0 };
        }
        if (curr.status === 'present') acc[curr.date].present++;
        if (curr.status === 'late') acc[curr.date].late++;
        if (curr.status === 'half-day') acc[curr.date].halfDay++;
        return acc;
    }, {});

    res.json(summary);
};

// @desc    Export attendance to CSV (Manager)
// @route   GET /api/attendance/export
// @access  Private (Manager)
const exportAttendance = async (req, res) => {
    const { from, to, employeeId, status, department } = req.query;

    let query = {};

    // Date range filter
    if (from && to) {
        query.date = { $gte: from, $lte: to };
    }

    // Status filter (late, half-day, absent, present)
    if (status) {
        query.status = status;
    }

    // Employee ID filter
    if (employeeId) {
        const user = await User.findOne({ employeeId });
        if (user) {
            query.userId = user._id;
        } else {
            // If user not found, return empty CSV
            const csv = 'Employee ID,Name,Department,Date,Status,Check In,Check Out,Total Hours\n';
            res.header('Content-Type', 'text/csv');
            res.attachment('attendance.csv');
            return res.send(csv);
        }
    }

    // Fetch attendance records
    const attendance = await Attendance.find(query).populate('userId', 'name employeeId department');

    // Filter by department after population (since department is in User model)
    let filteredAttendance = attendance;
    if (department) {
        filteredAttendance = attendance.filter(record => record.userId && record.userId.department === department);
    }

    // Generate CSV
    let csv = 'Employee ID,Name,Department,Date,Status,Check In,Check Out,Total Hours\n';
    filteredAttendance.forEach(record => {
        if (record.userId) {
            const checkIn = record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-';
            const checkOut = record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-';
            csv += `${record.userId.employeeId},${record.userId.name},${record.userId.department},${record.date},${record.status},${checkIn},${checkOut},${record.totalHours || 0}\n`;
        }
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`attendance_report_${from || 'all'}_${to || 'all'}.csv`);
    res.send(csv);
};

// @desc    Get today's status for all employees (Manager)
// @route   GET /api/attendance/today-status
// @access  Private (Manager)
const getTodayStatusForManager = async (req, res) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const attendance = await Attendance.find({ date: today }).populate('userId', 'name employeeId department');
    res.json(attendance);
};

module.exports = {
    checkIn,
    checkOut,
    getMyHistory,
    getMySummary,
    getTodayStatus,
    getAllAttendance,
    getTeamSummary,
    exportAttendance,
    getTodayStatusForManager,
};
