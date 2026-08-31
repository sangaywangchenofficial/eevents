import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FiSearch,
    FiTrash2,
    FiDownload,
    FiMail,
    FiUser,
    FiCalendar,
    FiMessageSquare,
    FiCheckCircle,
    FiXCircle,
    FiEye,
    FiEyeOff
} from 'react-icons/fi';
import { CSVLink } from 'react-csv';
import { API_BASE_URL } from '../../../../utils/auth';

const ManageContact = () => {
    const [messages, setMessages] = useState([]);
    const [allMessages, setAllMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessages, setSelectedMessages] = useState([]);
    const navigate = useNavigate();

    const adminUser = localStorage.getItem('adminUser');

    // Check authentication
    useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
            return;
        }
        fetchMessages();
    }, [adminUser, navigate]);

    // Fetch all messages
    const fetchMessages = () => {
        setIsLoading(true);
        fetch(`${API_BASE_URL}/contact-messages/`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                const msgs = Array.isArray(data) ? data : (data.data || data.results || []);
                setMessages(msgs);
                setAllMessages(msgs);
            })
            .catch(err => {
                console.error("API Error:", err);
                toast.error("Failed to load messages");
            })
            .finally(() => setIsLoading(false));
    };

    // Search filter
    const handleSearch = (term) => {
        setSearchTerm(term);
        const keywords = term.toLowerCase().trim();
        if (!keywords) {
            setMessages(allMessages);
            return;
        }
        const filtered = allMessages.filter(msg =>
            msg.name.toLowerCase().includes(keywords) ||
            msg.email.toLowerCase().includes(keywords) ||
            msg.subject.toLowerCase().includes(keywords) ||
            msg.message.toLowerCase().includes(keywords)
        );
        setMessages(filtered);
    };

    // Toggle read/unread status
    const toggleReadStatus = (id, currentStatus) => {
        const action = currentStatus ? 'mark_unread' : 'mark_read';
        const url = `${API_BASE_URL}/contact-messages/${id}/${action}/`;
        setIsLoading(true);
        fetch(url, { method: 'PATCH' })
            .then(res => {
                if (!res.ok) throw new Error('Failed to update status');
                toast.success(`Message marked as ${currentStatus ? 'unread' : 'read'}`);
                fetchMessages(); // refresh list
            })
            .catch(err => {
                console.error("Toggle status error:", err);
                toast.error("Failed to update status");
            })
            .finally(() => setIsLoading(false));
    };

    // Delete single message
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        setIsLoading(true);
        fetch(`${API_BASE_URL}/contact-messages/${id}/`, {
            method: 'DELETE',
        })
            .then(res => {
                if (!res.ok) throw new Error('Delete failed');
                toast.success("Message deleted");
                fetchMessages();
            })
            .catch(err => {
                console.error("Delete error:", err);
                toast.error("Failed to delete message");
            })
            .finally(() => setIsLoading(false));
    };

    // Bulk delete
    const handleBulkDelete = () => {
        if (selectedMessages.length === 0) {
            toast.warning("Select messages to delete");
            return;
        }
        if (!window.confirm(`Delete ${selectedMessages.length} messages?`)) return;
        setIsLoading(true);
        const promises = selectedMessages.map(id =>
            fetch(`${API_BASE_URL}/contact-messages/${id}/`, { method: 'DELETE' })
        );
        Promise.all(promises)
            .then(() => {
                toast.success(`${selectedMessages.length} messages deleted`);
                setSelectedMessages([]);
                fetchMessages();
            })
            .catch(() => toast.error("Bulk delete failed"))
            .finally(() => setIsLoading(false));
    };

    // Toggle selection
    const toggleSelection = (id) => {
        setSelectedMessages(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedMessages.length === messages.length) {
            setSelectedMessages([]);
        } else {
            setSelectedMessages(messages.map(m => m.id));
        }
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Compute stats
    const total = allMessages.length;
    const unread = allMessages.filter(m => !m.is_read).length;
    const read = allMessages.filter(m => m.is_read).length;
    const today = allMessages.filter(m => {
        const d = new Date(m.created_at);
        const now = new Date();
        return d.toDateString() === now.toDateString();
    }).length;

    return (
        <>
            <AdminLayout>
                <ToastContainer position="top-right" autoClose={3000} theme="dark" />

                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Contact Messages
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-stone-400 mt-1">
                                Manage all incoming messages from the contact form
                            </p>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-stone-400">
                            Total: {total} | Unread: {unread}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Total</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
                                </div>
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                    <FiMail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Unread</p>
                                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{unread}</p>
                                </div>
                                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                                    <FiEyeOff className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Read</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{read}</p>
                                </div>
                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                    <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Today</p>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{today}</p>
                                </div>
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                                    <FiCalendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="w-full sm:w-80 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <FiSearch className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, email, subject..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-stone-700 bg-white dark:bg-[#1C2B27] text-gray-900 dark:text-stone-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {selectedMessages.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    Delete ({selectedMessages.length})
                                </button>
                            )}
                            <CSVLink
                                data={messages.map(m => ({
                                    name: m.name,
                                    email: m.email,
                                    subject: m.subject,
                                    message: m.message,
                                    created_at: formatDate(m.created_at),
                                    status: m.is_read ? 'Read' : 'Unread'
                                }))}
                                filename={'contact_messages.csv'}
                                headers={[
                                    { label: 'Name', key: 'name' },
                                    { label: 'Email', key: 'email' },
                                    { label: 'Subject', key: 'subject' },
                                    { label: 'Message', key: 'message' },
                                    { label: 'Date', key: 'created_at' },
                                    { label: 'Status', key: 'status' },
                                ]}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                                <FiDownload className="w-4 h-4" />
                                Download CSV
                            </CSVLink>
                        </div>
                    </div>

                    {/* Messages Table */}
                    <div className="bg-white dark:bg-[#1C2B27] border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm transition-colors">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                                    <p className="mt-4 text-gray-500 dark:text-stone-400">Loading messages...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-stone-800/50 border-b border-gray-200 dark:border-stone-700 text-xs font-semibold text-gray-600 dark:text-stone-400 uppercase">
                                            <th className="px-4 py-3 text-center w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMessages.length === messages.length && messages.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="px-4 py-3 w-12">#</th>
                                            <th className="px-4 py-3">From</th>
                                            <th className="px-4 py-3 hidden md:table-cell">Subject</th>
                                            <th className="px-4 py-3 hidden lg:table-cell">Message</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 hidden xl:table-cell">Received</th>
                                            <th className="px-4 py-3 text-center w-28">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-stone-700 text-sm text-gray-700 dark:text-stone-300">
                                        {messages.length > 0 ? (
                                            messages.map((msg, index) => (
                                                <tr key={msg.id} className={`hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors ${!msg.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedMessages.includes(msg.id)}
                                                            onChange={() => toggleSelection(msg.id)}
                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-medium text-gray-500 dark:text-stone-400">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-stone-100">{msg.name}</p>
                                                            <p className="text-xs text-gray-500 dark:text-stone-400">{msg.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 hidden md:table-cell max-w-xs truncate">
                                                        {msg.subject}
                                                    </td>
                                                    <td className="px-4 py-3 hidden lg:table-cell max-w-md truncate">
                                                        {msg.message}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${msg.is_read ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                            {msg.is_read ? 'Read' : 'Unread'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 hidden xl:table-cell text-gray-500 dark:text-stone-400">
                                                        {formatDate(msg.created_at)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => toggleReadStatus(msg.id, msg.is_read)}
                                                                title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                                disabled={isLoading}
                                                            >
                                                                {msg.is_read ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(msg.id)}
                                                                title="Delete"
                                                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                disabled={isLoading}
                                                            >
                                                                <FiTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-8 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FiMessageSquare className="w-12 h-12 text-gray-400" />
                                                        <p className="text-gray-500 dark:text-stone-400 font-medium">
                                                            No messages found
                                                        </p>
                                                        <p className="text-sm text-gray-400 dark:text-stone-500">
                                                            {searchTerm ? 'Try adjusting your search' : 'Messages from the contact form will appear here'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {messages.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-stone-400">
                            <p>
                                Showing <span className="font-medium">{messages.length}</span> of{' '}
                                <span className="font-medium">{allMessages.length}</span> messages
                            </p>
                            {selectedMessages.length > 0 && (
                                <p className="text-blue-600 dark:text-blue-400">
                                    {selectedMessages.length} message(s) selected
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
};

export default ManageContact;