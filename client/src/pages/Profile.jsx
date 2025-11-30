import React from 'react';
import useAuthStore from '../store/useAuthStore';
import { User, Mail, Briefcase, IdCard } from 'lucide-react';

const Profile = () => {
    const { user } = useAuthStore();

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6">
                        <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg mx-auto">
                            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-500">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-gray-500 capitalize">{user?.role}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <Mail className="w-6 h-6 text-gray-400 mr-4" />
                            <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <p className="font-medium text-gray-800">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <IdCard className="w-6 h-6 text-gray-400 mr-4" />
                            <div>
                                <p className="text-sm text-gray-500">Employee ID</p>
                                <p className="font-medium text-gray-800">{user?.employeeId}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <Briefcase className="w-6 h-6 text-gray-400 mr-4" />
                            <div>
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="font-medium text-gray-800">{user?.department}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
