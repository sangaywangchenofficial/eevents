import React from 'react';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../components/AdminSidebar';

// Layout is used to get sidebar bar and header components tobe used in AdminDashboard.jsx

export const AdminLayout = ({ children }) => {

    const [sideBarShow, setSideBarShow] = useState(true)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('adminDarkMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });

    // Load notifications from localStorage on initial load
    const [newBookings, setNewBookings] = useState(() => {
        const saved = localStorage.getItem('adminNewBookings');
        return saved ? JSON.parse(saved) : 0;
    });

    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('adminNotifications');
        return saved ? JSON.parse(saved) : [];
    });

    const [showNotificationBadge, setShowNotificationBadge] = useState(() => {
        const saved = localStorage.getItem('adminShowBadge');
        return saved ? JSON.parse(saved) : false;
    });

    const [lastFetchCount, setLastFetchCount] = useState(() => {
        const saved = localStorage.getItem('adminLastFetchCount');
        return saved ? JSON.parse(saved) : 0;
    });

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('adminNotifications', JSON.stringify(notifications));
        localStorage.setItem('adminNewBookings', JSON.stringify(newBookings));
        localStorage.setItem('adminShowBadge', JSON.stringify(showNotificationBadge));
        localStorage.setItem('adminLastFetchCount', JSON.stringify(lastFetchCount));
    }, [notifications, newBookings, showNotificationBadge, lastFetchCount]);

    // Fetch new bookings count - only when there are new ones
    useEffect(() => {
        // Initial fetch when component mounts
        fetchNewBookingsCount();

        // Set up polling to check for new bookings every 30 seconds
        const interval = setInterval(fetchNewBookingsCount, 30000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchNewBookingsCount = () => {
        fetch('http://127.0.0.1:8000/api/v1/admin/dashboard-metrics/')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                const count = data.new_bookings || 0;

                // Only create notification if count > 0 AND count is greater than last fetched count
                // AND admin hasn't already seen these notifications
                if (count > 0 && count > lastFetchCount) {
                    // Check if notification already exists and is unread
                    const existingUnread = notifications.some(n =>
                        n.type === 'new_bookings' && n.unread === true
                    );

                    if (!existingUnread) {
                        const newNotification = {
                            id: Date.now(),
                            type: 'new_bookings',
                            text: `${count} new booking${count > 1 ? 's' : ''} received!`,
                            time: 'Just now',
                            unread: true,
                            count: count,
                            timestamp: Date.now()
                        };
                        setNotifications(prev => [newNotification, ...prev]);
                        setShowNotificationBadge(true);
                        setNewBookings(count);
                        setLastFetchCount(count);
                    } else {
                        // Update existing notification count
                        setNotifications(prev =>
                            prev.map(n =>
                                n.type === 'new_bookings' && n.unread === true
                                    ? { ...n, text: `${count} new booking${count > 1 ? 's' : ''} received!`, count: count }
                                    : n
                            )
                        );
                        setNewBookings(count);
                        setLastFetchCount(count);
                    }
                } else if (count === 0) {
                    // If count is 0, check if we need to update
                    setNewBookings(0);
                    setLastFetchCount(0);
                }
            })
            .catch(err => {
                console.error("Error fetching new bookings:", err);
            });
    };

    // Dark mode persistence
    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    // Side bar show and hide according to the screen size of a device.
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768)
                setSideBarShow(false)
            else {
                setSideBarShow(true)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Sidebar show/hide when user clicked on toggle button
    const toggleSidebar = () => {
        setSideBarShow(prev => !prev)
    }

    // Mark a single notification as read
    const markNotificationAsRead = (id) => {
        setNotifications(prev => {
            const updated = prev.map(n =>
                n.id === id ? { ...n, unread: false, readAt: Date.now() } : n
            );

            // Check if all notifications are read
            const hasUnread = updated.some(n => n.unread === true);
            if (!hasUnread) {
                setShowNotificationBadge(false);
                setNewBookings(0);
            }

            // Update lastFetchCount to prevent re-notification
            const unreadNotifs = updated.filter(n => n.unread === true);
            if (unreadNotifs.length === 0) {
                setLastFetchCount(prev => {
                    const maxCount = Math.max(prev, newBookings);
                    return maxCount;
                });
            }

            return updated;
        });
    };

    // Mark all notifications as read
    const markAllNotificationsAsRead = () => {
        setNotifications(prev => {
            const updated = prev.map(n => ({
                ...n,
                unread: false,
                readAt: Date.now()
            }));

            // Hide badge and reset new bookings count
            setShowNotificationBadge(false);
            setNewBookings(0);

            // Update lastFetchCount to prevent re-notification
            const maxCount = Math.max(lastFetchCount, newBookings);
            setLastFetchCount(maxCount);

            return updated;
        });
    };

    // Clear all notifications
    const clearAllNotifications = () => {
        setNotifications([]);
        setShowNotificationBadge(false);
        setNewBookings(0);
        setLastFetchCount(0);
    };

    // Get unread count
    const getUnreadCount = () => {
        return notifications.filter(n => n.unread).length;
    };

    // Check if there are any unread notifications
    const hasUnreadNotifications = () => {
        return notifications.some(n => n.unread === true);
    };

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-zinc-950 text-stone-100' : 'bg-[#FDFDF7] text-[#1E352F]'} overflow-x-hidden transition-colors duration-300`}>
            {/* Sidebar remains fixed/sticky on the left side */}
            {sideBarShow &&
                <AdminSidebar toggleSidebar={toggleSidebar} setSideBarShow={setSideBarShow} isDarkMode={isDarkMode} />
            }

            {/* Right side container holds both Header and dynamic Page Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader
                    onSidebarToggle={toggleSidebar}
                    toggleSidebar={toggleSidebar}
                    sideBarShow={sideBarShow}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    newBookings={newBookings}
                    notifications={notifications}
                    unreadCount={getUnreadCount()}
                    showNotificationBadge={showNotificationBadge}
                    hasUnreadNotifications={hasUnreadNotifications()}
                    markNotificationAsRead={markNotificationAsRead}
                    markAllNotificationsAsRead={markAllNotificationsAsRead}
                    clearAllNotifications={clearAllNotifications}
                />
                <div>
                    {children}
                </div>

                {/* Main viewport area where child sub-routes will render */}
                <main className="flex-1 p-6 md:p-8 bg-[#F4F3EC] dark:bg-zinc-900 overflow-y-auto transition-colors duration-300">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};