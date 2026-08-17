import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FiSearch,
    FiEdit,
    FiTrash2,
    FiDownload,
    FiUserPlus,
    FiUser,
    FiMail,
    FiCalendar,
    FiShield,
    FiMoreVertical,
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi';
import { CSVLink } from 'react-csv';

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const navigate = useNavigate();

    const adminUser = localStorage.getItem('adminUser');

    // Check authentication
    useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
            return;
        }
        fetchUsers();
    }, [adminUser, navigate]);

    // Fetch users
    const fetchUsers = () => {
        setIsLoading(true);
        fetch('http://127.0.0.1:8000/api/v1/view-users/')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("API Response Data:", data);
                const usersArray = Array.isArray(data) ? data : (data.data || data.results || []);
                setUsers(usersArray);
                setAllUsers(usersArray);
            })
            .catch(err => {
                console.error("API Error:", err);
                toast.error("Failed to load users");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Search filter
    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        const keywords = searchTerm.toLowerCase().trim();

        if (!keywords) {
            setUsers(allUsers);
            return;
        }

        const filteredUsers = allUsers.filter((user) => {
            const fullName = (user.first_name || user.name || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const username = (user.username || '').toLowerCase();

            return fullName.includes(keywords) ||
                email.includes(keywords) ||
                username.includes(keywords);
        });

        console.log("Filtered Users:", filteredUsers);
        setUsers(filteredUsers);
    };

    // Delete user
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this User?")) {
            return;
        }

        setIsLoading(true);
        fetch(`http://127.0.0.1:8000/api/v1/user-details/${id}/`, {
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
                toast.success(data.message || "User deleted successfully!");
                fetchUsers(); // Refresh the list
            })
            .catch(err => {
                console.error("Delete Error:", err);
                toast.error(err.message || "Failed to delete user");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Bulk delete users
    const handleBulkDelete = () => {
        if (selectedUsers.length === 0) {
            toast.warning("Please select users to delete");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
            return;
        }

        setIsLoading(true);
        const deletePromises = selectedUsers.map(id =>
            fetch(`http://127.0.0.1:8000/api/v1/user-details/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        );

        Promise.all(deletePromises)
            .then(() => {
                toast.success(`${selectedUsers.length} user(s) deleted successfully!`);
                setSelectedUsers([]);
                fetchUsers();
            })
            .catch(err => {
                console.error("Bulk Delete Error:", err);
                toast.error("Failed to delete some users");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Toggle user selection
    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // Toggle select all
    const toggleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id || user.pk));
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get user initials
    const getUserInitials = (user) => {
        const firstName = user.first_name || user.name || '';
        const lastName = user.last_name || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
    };

    // Get user status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            case 'suspended':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <>
            <AdminLayout>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    theme="dark"
                />

                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Manage Users
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-stone-400 mt-1">
                                Manage all registered users
                            </p>
                        </div>

                        <Link
                            to="/add-user"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <FiUserPlus className="w-4 h-4" />
                            Add New User
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {allUsers.length}
                                    </p>
                                </div>
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                    <FiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Active Users</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {allUsers.filter(u => u.status === 'active').length}
                                    </p>
                                </div>
                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                    <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Inactive Users</p>
                                    <p className="text-2xl font-bold text-gray-600 dark:text-stone-400">
                                        {allUsers.filter(u => u.status === 'inactive').length}
                                    </p>
                                </div>
                                <div className="bg-gray-100 dark:bg-stone-800 p-3 rounded-full">
                                    <FiXCircle className="w-6 h-6 text-gray-600 dark:text-stone-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-stone-400">Recent Users</p>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {allUsers.filter(u => {
                                            const date = new Date(u.register_date || u.created_at || u.date_joined);
                                            const now = new Date();
                                            const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
                                            return diffDays <= 7;
                                        }).length}
                                    </p>
                                </div>
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                                    <FiCalendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="w-full sm:w-80 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FiSearch className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, email, or username..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-stone-100 rounded-lg text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            {selectedUsers.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    Delete Selected ({selectedUsers.length})
                                </button>
                            )}

                            <CSVLink
                                data={users}
                                filename={'users.csv'}
                                headers={[
                                    { label: 'Phone', key: 'phone_number' },
                                    { label: 'First Name', key: 'first_name' },
                                    { label: 'Last Name', key: 'last_name' },
                                    { label: 'Email', key: 'email' },
                                    { label: 'Status', key: 'status' },
                                    { label: 'Joined', key: 'register_date' },
                                ]}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <FiDownload className="w-4 h-4" />
                                Download CSV
                            </CSVLink>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 rounded-lg overflow-hidden shadow-sm transition-colors">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
                                    <p className="mt-4 text-gray-500 dark:text-stone-400">Loading users...</p>
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
                                                    checked={selectedUsers.length === users.length && users.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="px-4 py-3 w-12">#</th>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3 hidden md:table-cell">Email</th>
                                            <th className="px-4 py-3 hidden lg:table-cell">Phone</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 hidden xl:table-cell">Joined</th>
                                            <th className="px-4 py-3 text-center w-24">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-stone-700 text-sm text-gray-700 dark:text-stone-300">
                                        {users && users.length > 0 ? (
                                            users.map((user, index) => (
                                                <tr key={user.id || user.pk || index} className="hover:bg-gray-50 dark:hover:bg-stone-800/50 transition-colors">
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.includes(user.id || user.pk)}
                                                            onChange={() => toggleUserSelection(user.id || user.pk)}
                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-medium text-gray-500 dark:text-stone-400">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                                                                {getUserInitials(user)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-stone-100">
                                                                    {user.first_name || user.name || 'Unknown'}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-stone-400 md:hidden">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 hidden md:table-cell text-gray-600 dark:text-stone-300">
                                                        <div className="flex items-center gap-2">
                                                            <FiMail className="w-3 h-3 text-gray-400" />
                                                            {user.email || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 hidden lg:table-cell">
                                                        <span className="text-gray-600 dark:text-stone-300">
                                                            {user.phone_number || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status || 'active')}`}>
                                                            {user.status || 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 hidden xl:table-cell text-gray-500 dark:text-stone-400">
                                                        {formatDate(user.register_date || user.created_at || user.date_joined || user.created)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleDelete(user.id || user.pk)}
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
                                                        <FiUser className="w-12 h-12 text-gray-400" />
                                                        <p className="text-gray-500 dark:text-stone-400 font-medium">
                                                            No users found
                                                        </p>
                                                        <p className="text-sm text-gray-400 dark:text-stone-500">
                                                            {searchTerm ? 'Try adjusting your search' : 'Start by adding a new user'}
                                                        </p>
                                                        {!searchTerm && (
                                                            <Link
                                                                to="/add-user"
                                                                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                            >
                                                                <FiUserPlus className="w-4 h-4" />
                                                                Add New User
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    {users && users.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-stone-400">
                            <p>
                                Showing <span className="font-medium">{users.length}</span> of{' '}
                                <span className="font-medium">{allUsers.length}</span> users
                            </p>
                            {selectedUsers.length > 0 && (
                                <p className="text-blue-600 dark:text-blue-400">
                                    {selectedUsers.length} user(s) selected
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
};

export default ManageUser;