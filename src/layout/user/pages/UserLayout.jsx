// UserLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import UserSidebar from '../../../components/UserSidebar';
import UserHeader from '../../../components/UserHeader';
import { toast } from 'react-toastify';

const UserLayout = ({ children }) => {
    const [sideBarShow, setSideBarShow] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Check if user is logged in
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            toast.error('Please login to access this page');
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(user);
            // If user is staff/admin, redirect to admin dashboard
            if (userData.isStaff) {
                navigate('/admin-dashboard');
                return;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user');
            navigate('/login');
        }

        setIsLoading(false);
    }, [navigate]);

    // Toggle sidebar function
    const toggleSidebar = () => {
        setSideBarShow(!sideBarShow);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="text-stone-400 mt-4 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-zinc-900 overflow-hidden">
            {/* Sidebar - Conditionally rendered */}
            <div className={`flex-shrink-0 transition-all duration-300 ${sideBarShow ? 'w-64' : 'w-0'}`}>
                {sideBarShow && <UserSidebar />}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <UserHeader
                    toggleSidebar={toggleSidebar}
                    sideBarShow={sideBarShow}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-purple-950/20">
                    <div className="max-w-7xl mx-auto">
                        {children || <Outlet />}
                    </div>
                </main>

                {/* Footer (Optional) */}
                <footer className="bg-zinc-950/80 border-t border-stone-800/60 px-6 py-3">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
                        <p className="text-xs text-stone-500">
                            © {new Date().getFullYear()} eEvents. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-stone-500">
                            <span>Version 1.0.0</span>
                            <span className="w-1 h-1 rounded-full bg-stone-700"></span>
                            <span>Secure Connection</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default UserLayout;