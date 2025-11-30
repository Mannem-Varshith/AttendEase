import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import {
    LayoutDashboard,
    Calendar,
    User,
    LogOut,
    Users,
    FileText,
    ClipboardList,
    UserPlus,
    Settings as SettingsIcon
} from 'lucide-react';
import clsx from 'clsx';

const Layout = ({ children }) => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const employeeLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My History', path: '/my-history', icon: Calendar },
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
    ];

    const managerLinks = [
        { name: 'Dashboard', path: '/manager-dashboard', icon: LayoutDashboard },
        { name: 'All Attendance', path: '/all-attendance', icon: Users },
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Create Employee', path: '/create-employee', icon: UserPlus },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
    ];

    const links = user?.role === 'manager' ? managerLinks : employeeLinks;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-600">AttendEase</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome, {user?.name}</p>
                </div>
                <nav className="mt-6">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={clsx(
                                    'flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors',
                                    location.pathname === link.path && 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                                )}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors mt-auto"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
