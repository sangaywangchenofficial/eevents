import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../AdminLayout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiSearch, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi'
import { CSVLink } from 'react-csv';

const ManageEvent = () => {
    const [events, setEvents] = useState([]); // Adds all events in tables 
    const [allEvents, setAllEvents] = useState([]); // to store all events during search

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/view-events/')
            .then(res => res.json())
            .then(data => {
                console.log("Django API Response Data:", data);
                const eventsList = data.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
                setEvents(eventsList);
                setAllEvents(eventsList);
            })
            .catch(err => console.error("API Error:", err))
    }, [])

    // to filter with input
    const handleSearch = (searchKeyword) => {
        const keyword = searchKeyword.toLowerCase().trim();

        if (!keyword) {
            setEvents(allEvents);
            return;
        }

        const filteredEvents = allEvents.filter((event) => {
            // Check multiple possible event name fields
            const eventName = (event.name || event.event_name || event.title || "").toLowerCase();
            const eventDescription = (event.description || event.event_description || "").toLowerCase();
            const eventLocation = (event.location || event.event_location || "").toLowerCase();

            return eventName.includes(keyword) ||
                eventDescription.includes(keyword) ||
                eventLocation.includes(keyword);
        });

        setEvents(filteredEvents);
    };


    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this Event?")) {
            return;
        }

        fetch(`http://127.0.0.1:8000/api/v1/event-detail/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                toast.success(data.message || "Event deleted successfully!");
                fetchEvents();
            })
            .catch(err => {
                console.error("Delete Error:", err);
                toast.error(err.message || "Failed to delete event");
            });
    };
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Get event name with fallback
    const getEventName = (event) => {
        return event.name || event.event_name || event.title || "No Name Found";
    };

    // Get event date with fallback
    const getEventDate = (event) => {
        return event.event_date || event.date || event.created_at || event.created || "N/A";
    };

    // Get event location with fallback
    const getEventLocation = (event) => {
        return event.location || event.event_location || event.venue || "N/A";
    };

    // CSV headers
    const csvHeaders = [
        { label: 'Event Name', key: 'name' },
        { label: 'Description', key: 'description' },
        { label: 'Location', key: 'location' },
        { label: 'Event Date', key: 'event_date' },
        { label: 'Created At', key: 'created_at' },
    ];

    return (
        <>
            <AdminLayout>
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />

                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Events</h1>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="w-full sm:w-auto bg-gray-100 dark:bg-stone-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-stone-700 transition-colors">
                            <span className="text-gray-600 dark:text-stone-300 text-sm font-medium">
                                Total Events: <strong className="text-gray-900 dark:text-stone-100">{events ? events.length : 0}</strong>
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="w-full sm:w-72 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FiSearch className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, description, or location..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-stone-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>

                            <CSVLink
                                data={events}
                                filename={'events.csv'}
                                headers={csvHeaders}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <FiDownload className="w-4 h-4" />
                                Download CSV
                            </CSVLink>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm transition-colors">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-stone-800/50 border-b border-gray-200 dark:border-stone-700 text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase">
                                        <th className="px-6 py-3 text-center w-16">Sr.No</th>
                                        <th className="px-6 py-3 min-w-[150px]">Event Name</th>
                                        <th className="px-6 py-3 min-w-[200px]">Description</th>
                                        <th className="px-6 py-3 min-w-[120px]">Location</th>
                                        <th className="px-6 py-3 min-w-[120px]">Event Date</th>
                                        <th className="px-6 py-3 text-center w-40">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-stone-700 text-sm text-gray-700 dark:text-stone-300">
                                    {events && events.length > 0 ? (
                                        events.map((event, index) => (
                                            <tr key={event.id || event.pk || index} className="hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors">
                                                <td className="px-6 py-3 text-center font-medium text-gray-500 dark:text-stone-400">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-3 font-medium text-gray-900 dark:text-stone-100">
                                                    {getEventName(event)}
                                                </td>
                                                <td className="px-6 py-3 text-gray-600 dark:text-stone-400 max-w-xs truncate">
                                                    {event.description || event.event_description || event.details || "No description"}
                                                </td>
                                                <td className="px-6 py-3 text-gray-500 dark:text-stone-400">
                                                    {getEventLocation(event)}
                                                </td>
                                                <td className="px-6 py-3 text-gray-500 dark:text-stone-400">
                                                    {formatDate(getEventDate(event))}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <Link to={`/edit-event/${event.id || event.pk}`}>
                                                            <button
                                                                title="Edit Event"
                                                                className="text-blue-600 hover:text-blue-700 transition-colors hover:scale-110 transform"
                                                                onClick={() => console.log('Edit event:', event.id)}
                                                            >
                                                                <FiEdit className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(event.id)}
                                                            title="Delete Event"
                                                            className="text-red-600 hover:text-red-700 transition-colors hover:scale-110 transform"
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-stone-400">
                                                {allEvents.length === 0 ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-lg">📅</span>
                                                        <p>No events found</p>
                                                        <p className="text-xs text-gray-400 dark:text-stone-500">Try adding your first event</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-lg">🔍</span>
                                                        <p>No events match your search</p>
                                                        <p className="text-xs text-gray-400 dark:text-stone-500">Try adjusting your search terms</p>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    )
}

export default ManageEvent