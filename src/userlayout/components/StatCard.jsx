import React from 'react';

const StatCard = ({ label, value, icon: Icon, color }) => {
    const colorMap = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
        green: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
        gray: { bg: 'bg-gray-50 dark:bg-[#0F1A17]', text: 'text-gray-600 dark:text-[#7AA49D]' },
        purple: { bg: 'bg-[#E6F9F6] dark:bg-[#1C2B27]', text: 'text-[#1E8B7A]' },
        pink: { bg: 'bg-pink-50 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
        orange: { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
    };
    const c = colorMap[color] || colorMap.blue;
    return (
        <div className="bg-white dark:bg-[#1C2B27] rounded-2xl shadow-sm p-4 sm:p-5 border border-gray-100 dark:border-[#2A3D38] hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-[#7AA49D] font-medium">{label}</p>
                    <p className={`text-xl sm:text-2xl font-bold mt-1 ${c.text}`}>{value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl ${c.bg}`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${c.text}`} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
