import React from 'react';

const ProfileField = ({ label, value, icon: Icon, color, full }) => {
    const c = {
        blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
        purple: 'bg-[#E6F9F6] dark:bg-[#162019] text-[#1E8B7A] dark:text-[#29BBA3]',
        green: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    }[color] || 'bg-gray-100 dark:bg-[#162019] text-gray-600 dark:text-[#7AA49D]';
    return (
        <div className={`bg-gradient-to-br from-[#FDFDF7] to-[#F4F3EC] dark:from-[#162019] dark:to-[#1C2B27] rounded-xl p-4 border border-gray-100 dark:border-[#2A3D38] ${full ? 'sm:col-span-2' : ''}`}>
            <div className="flex items-center gap-2 mb-1.5">
                <div className={`p-1.5 rounded-lg ${c}`}>
                    <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#66756F]">{label}</span>
            </div>
            <p className="text-base font-semibold text-gray-800 dark:text-[#E8F5F2] break-all">{value || 'N/A'}</p>
        </div>
    );
};

export default ProfileField;
