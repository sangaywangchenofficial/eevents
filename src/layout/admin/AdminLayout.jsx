import React from 'react';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';

// Layout is used to get sidebar bar and header components tobe used in AdminDashboard.jsx

export const AdminLayout = ({ children }) => {

    const [sideBarShow, setSideBarShow] = useState(true)
    // Side bar show and hide according to the screen size of a device.
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768)
                setSideBarShow(false) // Mobile View
            else {
                setSideBarShow(true) // Desktop View
            }
        }
        handleResize() // Initial Check
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Sidebar show/hide when user clicked on toggle button
    const toggleSidebar = () => {
        setSideBarShow(prev => !prev)
    }

    return (
        <div className="flex min-h-screen bg-stone-900 text-stone-100 overflow-x-hidden">
            {/* Sidebar remains fixed/sticky on the left side */}
            {sideBarShow &&
                <AdminSidebar toggleSidebar={toggleSidebar} setSideBarShow={setSideBarShow} />
            }

            {/* Right side container holds both Header and dynamic Page Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader
                    onSidebarToggle={toggleSidebar}
                    toggleSidebar={toggleSidebar}
                    sideBarShow={sideBarShow}
                />
                <div>
                    {children} {/* This is where AdminDashboard.jsx content will be rendered*/}
                </div>

                {/* Main viewport area where child sub-routes will render */}
                <main className="flex-1 p-6 md:p-8 bg-zinc-900 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};