import React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const PwdField = ({ label, name, value, onChange, show, onToggle }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-[#A8C4BE] mb-1.5">{label}</label>
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                name={name} value={value} onChange={onChange} required
                className="w-full pl-4 pr-11 py-2.5 border-2 border-gray-200 dark:border-[#2A3D38] bg-white dark:bg-[#162019] text-gray-800 dark:text-[#E8F5F2] rounded-xl focus:border-[#29BBA3] focus:ring-2 focus:ring-[#C8EDE8] outline-none placeholder:text-gray-300 dark:placeholder:text-[#3D5550]"
                placeholder="••••••••"
            />
            <button type="button" onClick={onToggle}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-[#66756F] hover:text-[#1E8B7A]">
                {show ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
        </div>
    </div>
);

export default PwdField;
