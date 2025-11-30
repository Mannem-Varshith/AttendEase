const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { format, subDays } = require('date-fns');

// @desc    Get employee dashboard stats
// @route   GET /api/dashboard/employee
// @access  Private (Employee)
const getEmployeeStats = async (req, res) => {
    const userId = req.user._id;
    const today = format(new Date(), 'yyyy-MM-dd');
    const currentMonth = format(new Date(), 'yyyy-MM');

    // Today's status
    const todayRecord = await Attendance.findOne({ userId, date: today });
    let todayStatus = 'Not Checked In';
    if (todayRecord) {
        todayStatus = todayRecord.checkOutTime ? 'Checked Out' : 'Checked In';
    }

    // Monthly stats
    const monthlyRecords = await Attendance.find({
        userId,
        date: { $regex: `^${currentMonth}` },
    });

    const stats = {
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        totalHours: 0,
    };

    monthlyRecords.forEach((record) => {
        if (record.status === 'present') stats.present++;
        if (record.status === 'late') stats.late++;
        if (record.status === 'half-day') stats.halfDay++;
        if (record.status === 'absent' || record.status === 'leave') stats.absent++;
        stats.totalHours += record.totalHours || 0;
    });

    // Recent activity (last 7 days)
    // We can just fetch last 7 records
    const recentActivity = await Attendance.find({ userId })
        .sort({ date: -1 })
        .limit(7);

    res.json({
        todayStatus,
        stats,
        recentActivity,
    });
};

// @desc    Get manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
const getManagerStats = async (req, res) => {
    const today = format(new Date(), 'yyyy-MM-dd');

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({ date: today });

    const presentCount = todayAttendance.filter(a => a.status === 'present' || a.status === 'late' || a.status === 'half-day').length;
    const absentCount = totalEmployees - presentCount; // Rough estimate
    const lateCount = todayAttendance.filter(a => a.status === 'late').length;

    // Department wise
    // This requires aggregation
    const departmentStats = await User.aggregate([
        { $match: { role: 'employee' } },
        { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Weekly trend (last 7 days)
    // Simplified: just get counts for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = subDays(new Date(), i);
        last7Days.push(format(d, 'yyyy-MM-dd'));
    }

    const weeklyTrend = await Attendance.aggregate([
        { $match: { date: { $in: last7Days } } },
        { $group: { _id: '$date', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);

    res.json({
        totalEmployees,
        today: {
            present: presentCount,
            absent: absentCount,
            late: lateCount,
        },
        departmentStats,
        weeklyTrend,
    });
};

module.exports = { getEmployeeStats, getManagerStats };
