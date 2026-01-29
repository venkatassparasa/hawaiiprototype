import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Save, Camera } from 'lucide-react';

const UserProfile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                    <p className="text-slate-500">Manage your account information and preferences.</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-2 bg-hawaii-ocean text-white rounded-lg hover:bg-blue-800 flex items-center gap-2 font-medium shadow-sm"
                >
                    {isEditing ? (
                        <>
                            <Save className="w-4 h-4" /> Save Changes
                        </>
                    ) : (
                        'Edit Profile'
                    )}
                </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">

                {/* Cover Photo */}
                <div className="h-32 bg-gradient-to-r from-hawaii-ocean to-blue-600 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl">
                                <div className="w-full h-full rounded-full bg-hawaii-ocean flex items-center justify-center text-white text-3xl font-bold">
                                    {user?.avatar || 'JD'}
                                </div>
                            </div>
                            {isEditing && (
                                <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50">
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-20 px-8 pb-8 space-y-6">

                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{user?.name || 'Jane Doe'}</h2>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                            <Shield className="w-4 h-4" />
                            {user?.role || 'Enforcement Officer'}
                        </p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    defaultValue={user?.email || 'jane.doe@hawaiicounty.gov'}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                />
                            ) : (
                                <p className="text-slate-800">{user?.email || 'jane.doe@hawaiicounty.gov'}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    defaultValue="(808) 555-0123"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                />
                            ) : (
                                <p className="text-slate-800">(808) 555-0123</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Department
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    defaultValue="Planning & Enforcement Division"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean/20"
                                />
                            ) : (
                                <p className="text-slate-800">Planning & Enforcement Division</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Member Since
                            </label>
                            <p className="text-slate-800">January 2024</p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Cases Reviewed</p>
                    <p className="text-3xl font-bold text-slate-800">247</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">NOVs Issued</p>
                    <p className="text-3xl font-bold text-slate-800">89</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Avg. Response Time</p>
                    <p className="text-3xl font-bold text-slate-800">4.2h</p>
                </div>
            </div>

        </div>
    );
};

export default UserProfile;
