import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MyAttendance = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const { data } = await api.get(`/attendance/my-history?month=${month}&year=${year}`);
            setAttendanceData(data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [currentDate]);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'present':
                return 'bg-green-200 text-green-800 hover:bg-green-300';
            case 'absent':
            case 'leave':
                return 'bg-red-200 text-red-800 hover:bg-red-300';
            case 'late':
                return 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300';
            case 'half-day':
                return 'bg-orange-200 text-orange-800 hover:bg-orange-300';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">My Attendance History</h1>
                <div className="flex items-center space-x-4 bg-white rounded-lg shadow p-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-semibold min-w-[150px] text-center">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                {loading ? (
                    <div className="text-center py-10">Loading calendar...</div>
                ) : (
                    <div className="grid grid-cols-7 gap-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center font-semibold text-gray-500 py-2">
                                {day}
                            </div>
                        ))}

                        {/* Empty cells for start of month */}
                        {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg"></div>
                        ))}

                        {daysInMonth.map((day) => {
                            const record = attendanceData.find(a => isSameDay(parseISO(a.date), day));
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`h-24 border rounded-lg p-2 flex flex-col justify-between transition-colors
                    ${record ? getStatusColor(record.status) : isWeekend ? 'bg-gray-50' : 'bg-white border-gray-200'}
                  `}
                                >
                                    <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                                        {format(day, 'd')}
                                    </span>

                                    {record && (
                                        <div className="text-xs mt-1">
                                            <div className="font-bold capitalize">{record.status}</div>
                                            {record.checkInTime && (
                                                <div>{format(new Date(record.checkInTime), 'HH:mm')} - {record.checkOutTime ? format(new Date(record.checkOutTime), 'HH:mm') : '...'}</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAttendance;
