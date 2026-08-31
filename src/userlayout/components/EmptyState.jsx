import React from 'react';

const EmptyState = ({ icon: Icon, title, desc, actionLabel, onAction }) => (
    <div className="text-center py-12 px-4 bg-gradient-to-br from-[#FDFDF7] to-[#F4F3EC] rounded-2xl">
        <div className="inline-block p-4 bg-white dark:bg-[#1C2B27] rounded-2xl shadow-sm mb-4">
            <Icon className="h-10 w-10 text-gray-300" />
        </div>
        <h3 className="text-gray-700 dark:text-[#A8C4BE] font-semibold text-lg">{title}</h3>
        <p className="text-gray-400 dark:text-[#66756F] mt-1">{desc}</p>
        {actionLabel && (
            <button onClick={onAction}
                className="mt-4 px-5 py-2 bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white rounded-lg font-medium hover:shadow-md transition-all">
                {actionLabel}
            </button>
        )}
    </div>
);

export default EmptyState;
