import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Clock, Calendar, AlertCircle, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

const EmployeeDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Modal states
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [showCheckOutModal, setShowCheckOutModal] = useState(false);
    const [checkOutConfirmed, setCheckOutConfirmed] = useState(false);

    // Time and validation states
    const [currentTime, setCurrentTime] = useState(new Date());
    const [lateInfo, setLateInfo] = useState(null);
    const [isWeekend, setIsWeekend] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/dashboard/employee');
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Calculate if user is late and by how much
    const calculateLateStatus = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // Check if it's after 1:00 PM (13:00)
        if (hours >= 13) {
            return {
                isBlocked: true,
                message: "Check-in not allowed after 1:00 PM. You will be marked as on leave for today.",
                severity: 'error'
            };
        }

        // Check if it's after 9:00 AM (late)
        if (hours >= 9) {
            const lateMinutes = (hours - 9) * 60 + minutes;
            const lateHours = Math.floor(lateMinutes / 60);
            const lateMin = lateMinutes % 60;

            let lateMessage = "You are late by ";
            if (lateHours > 0) {
                lateMessage += `${lateHours} hour${lateHours > 1 ? 's' : ''}`;
                if (lateMin > 0) {
                    lateMessage += ` and ${lateMin} minute${lateMin > 1 ? 's' : ''}`;
                }
            } else {
                lateMessage += `${lateMin} minute${lateMin > 1 ? 's' : ''}`;
            }
            lateMessage += ". Today will be considered as late arrival.";

            return {
                isBlocked: false,
                isLate: true,
                message: lateMessage,
                severity: 'warning'
            };
        }

        // On time
        return {
            isBlocked: false,
            isLate: false,
            message: "You are on time!",
            severity: 'success'
        };
    };

    // Check if today is weekend
    const checkWeekend = () => {
        const day = new Date().getDay();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    };

    // Get day name
    const getDayName = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    };

    // Open check-in modal with validations
    const openCheckInModal = () => {
        const weekend = checkWeekend();
        setIsWeekend(weekend);

        if (weekend) {
            setValidationMessage(`Today is ${getDayName()}, it's a day off. Check-in is not allowed on weekends.`);
        } else {
            const lateStatus = calculateLateStatus();
            setLateInfo(lateStatus);
            setValidationMessage('');
        }

        setShowCheckInModal(true);
    };

    // Open check-out modal
    const openCheckOutModal = () => {
        setCheckOutConfirmed(false);
        setShowCheckOutModal(true);
    };

    // Handle actual check-in
    const handleCheckIn = async () => {
        // Final validation
        if (isWeekend) {
            alert('Cannot check-in on weekends');
            setShowCheckInModal(false);
            return;
        }

        if (lateInfo?.isBlocked) {
            alert(lateInfo.message);
            setShowCheckInModal(false);
            return;
        }

        setActionLoading(true);
        try {
            await api.post('/attendance/checkin');
            await fetchStats();
            setShowCheckInModal(false);
            alert('Check-in successful!');
        } catch (error) {
            alert(error.response?.data?.message || 'Check-in failed');
        } finally {
            setActionLoading(false);
        }
    };

    // Handle actual check-out
    const handleCheckOut = async () => {
        if (!checkOutConfirmed) {
            alert('Please confirm by checking the checkbox');
            return;
        }

        setActionLoading(true);
        try {
            await api.post('/attendance/checkout');
            await fetchStats();
            setShowCheckOutModal(false);
            alert('Check-out successful!');
        } catch (error) {
            alert(error.response?.data?.message || 'Check-out failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>

            {/* Today's Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-700">Today's Status</h2>
                    <p className="text-3xl font-bold mt-2 text-blue-600">
                        {stats?.todayStatus}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="mt-4 md:mt-0">
                    {stats?.todayStatus === 'Not Checked In' && (
                        <button
                            onClick={openCheckInModal}
                            disabled={actionLoading}
                            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
                        >
                            Check In
                        </button>
                    )}
                    {stats?.todayStatus === 'Checked In' && (
                        <button
                            onClick={openCheckOutModal}
                            disabled={actionLoading}
                            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50"
                        >
                            Check Out
                        </button>
                    )}
                    {stats?.todayStatus === 'Checked Out' && (
                        <div className="px-6 py-3 bg-gray-100 text-gray-600 rounded-md font-medium border border-gray-200">
                            Day Completed
                        </div>
                    )}
                </div>
            </div>

            {/* Check-In Modal */}
            {showCheckInModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setShowCheckInModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center mb-4">
                            <Clock className="w-8 h-8 text-blue-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">Check-In Confirmation</h2>
                        </div>

                        {/* Current Time Display */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-600 mb-1">Current Time</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        {/* Weekend Warning */}
                        {isWeekend ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <div className="flex items-start">
                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                                    <div>
                                        <p className="font-semibold text-red-900 mb-1">Weekend Day Off</p>
                                        <p className="text-sm text-red-700">{validationMessage}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Status Message */}
                                {lateInfo && (
                                    <div className={`rounded-lg p-4 mb-4 ${lateInfo.severity === 'error' ? 'bg-red-50 border border-red-200' :
                                        lateInfo.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                                            'bg-green-50 border border-green-200'
                                        }`}>
                                        <div className="flex items-start">
                                            {lateInfo.severity === 'error' && <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />}
                                            {lateInfo.severity === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />}
                                            {lateInfo.severity === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />}
                                            <div>
                                                <p className={`font-semibold mb-1 ${lateInfo.severity === 'error' ? 'text-red-900' :
                                                    lateInfo.severity === 'warning' ? 'text-yellow-900' :
                                                        'text-green-900'
                                                    }`}>
                                                    {lateInfo.isBlocked ? 'Check-in Blocked' :
                                                        lateInfo.isLate ? 'Late Arrival' : 'On Time'}
                                                </p>
                                                <p className={`text-sm ${lateInfo.severity === 'error' ? 'text-red-700' :
                                                    lateInfo.severity === 'warning' ? 'text-yellow-700' :
                                                        'text-green-700'
                                                    }`}>
                                                    {lateInfo.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCheckInModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCheckIn}
                                disabled={isWeekend || lateInfo?.isBlocked || actionLoading}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading ? 'Processing...' : 'Confirm Check-In'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Check-Out Modal */}
            {showCheckOutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setShowCheckOutModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center mb-4">
                            <Clock className="w-8 h-8 text-red-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">Check-Out Confirmation</h2>
                        </div>

                        {/* Current Time Display */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-600 mb-1">Current Time</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        {/* Warning Message */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                                <div>
                                    <p className="font-semibold text-yellow-900 mb-1">Confirm Check-Out</p>
                                    <p className="text-sm text-yellow-700">
                                        Please confirm that you want to check out now. Your working hours will be calculated based on this time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Checkbox */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={checkOutConfirmed}
                                    onChange={(e) => setCheckOutConfirmed(e.target.checked)}
                                    className="mt-1 mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                    I confirm that I want to check out now and understand that my attendance status will be updated based on my total working hours.
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCheckOutModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCheckOut}
                                disabled={!checkOutConfirmed || actionLoading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading ? 'Processing...' : 'Confirm Check-Out'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Present Days</p>
                            <p className="text-2xl font-bold text-gray-800">{stats?.stats?.present}</p>
                        </div>
                        <CheckCircle className="text-green-500 w-8 h-8" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Absent Days</p>
                            <p className="text-2xl font-bold text-gray-800">{stats?.stats?.absent}</p>
                        </div>
                        <XCircle className="text-red-500 w-8 h-8" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Late Arrivals</p>
                            <p className="text-2xl font-bold text-gray-800">{stats?.stats?.late}</p>
                        </div>
                        <AlertCircle className="text-yellow-500 w-8 h-8" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Hours</p>
                            <p className="text-2xl font-bold text-gray-800">{stats?.stats?.totalHours?.toFixed(1)}</p>
                        </div>
                        <Clock className="text-blue-500 w-8 h-8" />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats?.recentActivity?.map((record) => (
                                <tr key={record._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                              ${record.status === 'present' ? 'bg-green-100 text-green-800' :
                                                record.status === 'absent' || record.status === 'leave' ? 'bg-red-100 text-red-800' :
                                                    record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-orange-100 text-orange-800'}`}>
                                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.totalHours}</td>
                                </tr>
                            ))}
                            {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No recent activity found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;

