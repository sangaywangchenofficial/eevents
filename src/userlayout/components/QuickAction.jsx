import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const QuickAction = ({ onClick, label, icon: Icon, primary }) => (
    <button
        onClick={onClick}
        className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${primary
            ? 'bg-gradient-to-r from-[#29BBA3] to-[#1E8B7A] text-white shadow-md hover:shadow-lg'
            : 'border-2 border-gray-200 dark:border-[#2A3D38] text-gray-700 dark:text-[#A8C4BE] hover:border-[#29BBA3] hover:text-[#1E8B7A] hover:bg-[#E6F9F6] dark:hover:bg-[#162019] dark:bg-[#1C2B27] dark:hover:bg-[#162019] dark:bg-[#1C2B27]'
            }`}
    >
        <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {label}</span>
        <ChevronRightIcon className="h-4 w-4" />
    </button>
);

export default QuickAction;
