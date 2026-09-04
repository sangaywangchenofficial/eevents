import React from 'react';
import { EnvelopeIcon, PhoneIcon, UserIcon, CalendarIcon, PencilIcon, CheckCircleIcon, XCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import ProfileField from '../components/ProfileField';
import PwdField from '../components/PwdField';

const ProfileTab = ({
    user, isEditing, setIsEditing, editData, handleEditChange, saveProfile,
    formatDateTime, pwdData, handlePwdChange, submitPassword,
    showOldPwd, setShowOldPwd, showNewPwd, setShowNewPwd,
    showConfirmPwd, setShowConfirmPwd, pwdLoading, getInitials
}) => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-[#1C2B27] rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-[#2A3D38]">
                <div className="bg-gradient-to-r from-[#1E352F] via-[#1E8B7A] to-[#29BBA3] px-6 py-5">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/30 flex items-center justify-center text-4xl font-bold text-white">
                            {getInitials()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {user?.first_name} {user?.last_name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <p className="text-teal-100 flex items-center gap-2 text-sm">
                                    <EnvelopeIcon className="h-4 w-4" /> {user?.email}
                                </p>
                                {user?.verified && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white text-[#1E8B7A] shadow-md shadow-black/10 ml-2">
                                        <CheckCircleIcon className="h-4 w-4" /> Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-teal-100 flex items-center gap-2 text-sm">
                                <PhoneIcon className="h-4 w-4" /> {user?.phone_number}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {!isEditing ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ProfileField label="First Name" value={user?.first_name} icon={UserIcon} color="blue" />
                                <ProfileField label="Last Name" value={user?.last_name} icon={UserIcon} color="blue" />
                                <ProfileField label="Email" value={user?.email} icon={EnvelopeIcon} color="purple" />
                                <ProfileField label="Phone Number" value={user?.phone_number} icon={PhoneIcon} color="purple" />
                                <ProfileField label="Member Since" value={formatDateTime(user?.register_date)} icon={CalendarIcon} color="green" full />
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <PencilIcon className="h-4 w-4" /> Edit Profile
                            </button>
                        </>
                    ) : (
                        <form onSubmit={saveProfile}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-[#A8C4BE] mb-1.5">First Name</label>
                                    <input name="first_name" value={editData.first_name} onChange={handleEditChange} required
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-[#2A3D38] bg-white dark:bg-[#162019] text-gray-800 dark:text-[#E8F5F2] rounded-xl focus:border-[#29BBA3] focus:ring-2 focus:ring-[#C8EDE8] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-[#A8C4BE] mb-1.5">Last Name</label>
                                    <input name="last_name" value={editData.last_name} onChange={handleEditChange} required
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-[#2A3D38] bg-white dark:bg-[#162019] text-gray-800 dark:text-[#E8F5F2] rounded-xl focus:border-[#29BBA3] focus:ring-2 focus:ring-[#C8EDE8] outline-none" />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-6">
                                <button type="submit"
                                    className="px-6 py-2.5 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                                    <CheckCircleIcon className="h-4 w-4" /> Save Changes
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)}
                                    className="px-6 py-2.5 border-2 border-gray-300 dark:border-[#3D5550] text-gray-700 dark:text-[#A8C4BE] rounded-xl font-semibold hover:bg-gray-50 dark:bg-[#0F1A17] transition-all flex items-center gap-2">
                                    <XCircleIcon className="h-4 w-4" /> Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#1C2B27] rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-[#2A3D38]">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-[#2A3D38] flex items-center gap-2">
                    <LockClosedIcon className="h-5 w-5 text-[#29BBA3]" />
                    <h3 className="font-bold text-gray-800 dark:text-[#E8F5F2]">Change Password</h3>
                </div>
                <form onSubmit={submitPassword} className="p-6 space-y-4">
                    <PwdField label="Current Password" name="old_password" value={pwdData.old_password}
                        onChange={handlePwdChange} show={showOldPwd} onToggle={() => setShowOldPwd(!showOldPwd)} />
                    <PwdField label="New Password" name="new_password" value={pwdData.new_password}
                        onChange={handlePwdChange} show={showNewPwd} onToggle={() => setShowNewPwd(!showNewPwd)} />
                    <PwdField label="Confirm New Password" name="confirm_password" value={pwdData.confirm_password}
                        onChange={handlePwdChange} show={showConfirmPwd} onToggle={() => setShowConfirmPwd(!showConfirmPwd)} />
                    <button type="submit" disabled={pwdLoading}
                        className="w-full py-2.5 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60">
                        {pwdLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    </div>
);

export default ProfileTab;
