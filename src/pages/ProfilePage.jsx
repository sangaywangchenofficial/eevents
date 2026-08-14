import React, { useState, useEffect } from 'react';
import PublicLayout from '../publiclayout/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    PencilIcon,
    CheckCircleIcon,
    XMarkIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { isAuthenticated, getUserId, clearAuth } from '../utils/auth';
import { api } from '../utils/api';

const ProfilePage = () => {
    const userId = getUserId();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        register_date: ''
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        first_name: '',
        last_name: ''
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            toast.error('Please login to view your profile');
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [userId, navigate]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/users/${userId}/`);
            setFormData(data);
            setEditData({
                first_name: data.first_name || '',
                last_name: data.last_name || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await api.put(`/users/update/${userId}/`, {
                first_name: editData.first_name,
                last_name: editData.last_name
            });
            setFormData({
                ...formData,
                first_name: editData.first_name,
                last_name: editData.last_name
            });
            setIsEditing(false);
            toast.success(data.message || 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        setEditData({
            first_name: formData.first_name || '',
            last_name: formData.last_name || ''
        });
        setIsEditing(false);
    };

    const handleLogout = () => {
        clearAuth();
        toast.success('Logged out successfully');
        navigate('/login', { replace: true });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getInitials = () => {
        const first = formData.first_name?.charAt(0) || '';
        const last = formData.last_name?.charAt(0) || '';
        return (first + last).toUpperCase() || 'U';
    };

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <p className="mt-6 text-gray-600 font-medium">Loading profile...</p>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <ToastContainer position="top-right" autoClose={2000} theme="dark" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="relative mb-10">
                        <div className="text-center">
                            <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
                                <UserCircleIcon className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    My Profile
                                </span>
                            </h1>
                            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                                Manage your personal information and account settings
                            </p>
                            <div className="mt-4 flex justify-center">
                                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-8 sm:px-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-xl">
                                    <span className="text-5xl font-bold text-white">{getInitials()}</span>
                                </div>

                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold text-white">
                                        {formData.first_name} {formData.last_name}
                                    </h2>
                                    <p className="text-blue-200 flex items-center justify-center sm:justify-start gap-2 mt-1">
                                        <EnvelopeIcon className="h-4 w-4" />
                                        {formData.email}
                                    </p>
                                    <p className="text-blue-200 flex items-center justify-center sm:justify-start gap-2 mt-1">
                                        <PhoneIcon className="h-4 w-4" />
                                        {formData.phone_number}
                                    </p>
                                    <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start">
                                        <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <CheckCircleIcon className="h-3 w-3" />
                                            Verified Account
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            {!isEditing ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-5 border border-gray-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <UserIcon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900">{formData.first_name || 'N/A'}</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-5 border border-gray-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <UserIcon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900">{formData.last_name || 'N/A'}</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl p-5 border border-gray-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <EnvelopeIcon className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900 break-all">{formData.email || 'N/A'}</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl p-5 border border-gray-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <PhoneIcon className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900">{formData.phone_number || 'N/A'}</p>
                                        </div>

                                        <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl p-5 border border-gray-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <CalendarIcon className="h-4 w-4 text-green-600" />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member Since</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900">{formatDate(formData.register_date)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium transform hover:-translate-y-0.5"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                            Edit Profile
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={editData.first_name}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                                                placeholder="Enter your first name"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={editData.last_name}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                                                placeholder="Enter your last name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium transform hover:-translate-y-0.5"
                                        >
                                            <CheckCircleIcon className="h-5 w-5" />
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800">My Bookings</h3>
                                    <p className="text-xs text-gray-500">View all your bookings</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/events')}
                            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800">Browse Events</h3>
                                    <p className="text-xs text-gray-500">Discover new events</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800">Logout</h3>
                                    <p className="text-xs text-gray-500">Sign out of your account</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default ProfilePage;
